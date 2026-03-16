/**
 * 测试客户端 - 用于与 LangGraph 服务器交互
 * 
 * 使用方法：
 * 1. 确保 LangGraph 服务器正在运行 (npm run dev)
 * 2. 运行此脚本: npx tsx test-client.ts
 */

import { HumanMessage } from "@langchain/core/messages";

const SERVER_URL = "http://127.0.0.1:2024";
const GRAPH_ID = "movieAgent";

/**
 * 调用 movieAgent graph
 */
async function invokeMovieAgent(userMessage: string) {
  try {
    const response = await fetch(`${SERVER_URL}/${GRAPH_ID}/invoke`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: userMessage,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("调用失败:", error);
    throw error;
  }
}

/**
 * 流式调用 movieAgent graph
 */
async function streamMovieAgent(userMessage: string) {
  try {
    const response = await fetch(`${SERVER_URL}/${GRAPH_ID}/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: userMessage,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error("无法读取响应流");
    }

    console.log("\n流式响应:");
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n").filter((line) => line.trim());

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") {
            console.log("\n流式响应完成");
            return;
          }
          try {
            const parsed = JSON.parse(data);
            console.log(JSON.stringify(parsed, null, 2));
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
    }
  } catch (error) {
    console.error("流式调用失败:", error);
    throw error;
  }
}

/**
 * 主函数
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || "invoke";
  const message = args[1] || "请推荐一些电影";

  console.log(`\n正在调用 ${GRAPH_ID}...`);
  console.log(`用户消息: ${message}\n`);

  if (command === "stream") {
    await streamMovieAgent(message);
  } else {
    const result = await invokeMovieAgent(message);
    console.log("\n=== 响应结果 ===");
    console.log(JSON.stringify(result, null, 2));

    // 如果有推荐结果，格式化输出
    if (result.recommendations) {
      console.log("\n=== 电影推荐列表 ===");
      result.recommendations.forEach((movie: any, index: number) => {
        console.log(
          `${index + 1}. 《${movie.title}》(${movie.year}) - ${movie.genre} - 评分: ${movie.rating}/10`
        );
      });
    }

    // 输出最后一条 AI 消息
    if (result.messages && result.messages.length > 0) {
      const lastMessage = result.messages[result.messages.length - 1];
      if (lastMessage.content) {
        console.log("\n=== AI 回复 ===");
        console.log(lastMessage.content);
      }
    }
  }
}

// 运行主函数
main().catch(console.error);
