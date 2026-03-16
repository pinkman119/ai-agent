import express from "express";
import cors from "cors";
import { HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";
import { agent } from "./agent.js";
import { createDeepSeekLLM } from "./config/deepSeek.js";
import { tools } from "./tools/WeatherTool.js";

import { weatherToolStructuredTool } from "./tools/WeatherToolStructuredTool.js";
// 使用 langchain 提供的 createAgent（TS 类型暂时忽略）
// @ts-ignore
import { createAgent } from "langchain";

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

/**
 * 将 HTTP 请求中的消息格式转换为 LangChain BaseMessage
 */
function convertToMessages(messages: any[]): BaseMessage[] {
  return messages.map((msg) => {
    if (msg.role === "user" || msg.role === "human") {
      return new HumanMessage(msg.content);
    } else if (msg.role === "assistant" || msg.role === "ai") {
      return new AIMessage(msg.content);
    } else {
      // 默认作为用户消息处理
      return new HumanMessage(msg.content);
    }
  });
}

/**
 * 将 BaseMessage 转换为可序列化的格式
 */
function serializeMessage(msg: BaseMessage): any {
  return {
    role: msg instanceof HumanMessage ? "user" : "assistant",
    content: msg.content,
  };
}

/**
 * 健康检查端点
 */
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "movieAgent API" });
});

/**
 * 同步调用端点: POST /movieAgent/invoke
 */
app.post("/movieAgent/invoke", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Invalid request: messages array is required",
      });
    }

    // 转换消息格式
    const langchainMessages = convertToMessages(messages);

    // 调用 agent
    const result = await agent.invoke({
      messages: langchainMessages,
    });

    // 转换响应格式
    const response = {
      messages: result.messages.map(serializeMessage),
      recommendations: result.recommendations || [],
    };

    res.json(response);
  } catch (error: any) {
    console.error("Invoke error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

/**
 * 流式调用端点: POST /movieAgent/stream
 */
app.post("/movieAgent/stream", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Invalid request: messages array is required",
      });
    }

    // 转换消息格式
    const langchainMessages = convertToMessages(messages);

    // 设置 SSE 响应头
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // 调用 agent stream
    const stream = await agent.stream({
      messages: langchainMessages,
    });

    // 发送流式数据
    for await (const chunk of stream) {
      const data = JSON.stringify(chunk);
      res.write(`data: ${data}\n\n`);
    }

    // 发送结束标记
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error: any) {
    console.error("Stream error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

/**
 * 获取所有可用的图列表
 */
app.get("/graphs", (req, res) => {
  res.json({
    graphs: ["movieAgent"],
  });
});

app.get("/deepSeek/weather", async (req, res) => {
  try {
    // 从 query 中获取 message
    const message = String(req.query.message);
    // 移除不存在的 TTools 实例化
    const weatherAgent = createAgent({
      // 使用已经封装好的 DeepSeek 聊天模型
      model: createDeepSeekLLM(),
      // 工具列表：普通天气工具 + 结构化天气工具
      tools: [...tools, weatherToolStructuredTool],
      // 不使用结构化输出，显式设置为 undefined，匹配无 responseFormat 的重载
      responseFormat: undefined,
      middleware:[],
    });

    // 校验并规范化用户输入（可能是 string | string[] | undefined）
    if (!message) {
      return res.status(400).json({
        error: "Invalid request: query param 'message' is required",
      });
    }

    // 使用新的 invoke 方法
    const result = await weatherAgent.invoke({
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    // 转换响应格式
    const response = {
      result:result.messages,
    };

    res.json(response);
  } catch (error: any) {
    console.error("Invoke error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Movie Agent API 服务器运行在 http://localhost:${PORT}`);
  console.log(`📡 健康检查: http://localhost:${PORT}/health`);
  console.log(`🎬 调用端点: POST http://localhost:${PORT}/movieAgent/invoke`);
  console.log(`🌊 流式端点: POST http://localhost:${PORT}/movieAgent/stream`);
});
