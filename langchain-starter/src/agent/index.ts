import { ChatDeepSeek } from "@langchain/deepseek";
import { HumanMessage } from "@langchain/core/messages";
import { AIMessage } from "@langchain/core/messages";
import { SystemMessage } from "@langchain/core/messages";
import { ToolMessage } from "@langchain/core/messages";


import dotenv from "dotenv";
// 0 加载 .env 文件中的环境变量
dotenv.config(); 

// 1 实例化 DeepSeek 聊天模型
const model = new ChatDeepSeek({
  model: "deepseek-chat", // 普通对话，非深度思考
  // model: "deepseek-reasoner",  // 使用推理模型，开启深度思考，会额外返回"reasoning_content"字段
  temperature: 1.3,       // 控制输出的随机性：根据不同场景进行配置
  // apiKey 默认从环境变量 DEEPSEEK_API_KEY 读取
  // baseURL 默认deepSeek的官网
  maxTokens: 1000, // 大致一个汉字占用一个token，生产内容、传入提示词也越长
});

// 2 调用模型
const response = await model.invoke([
  new HumanMessage("什么是深度思考?")
]);
console.log(response);