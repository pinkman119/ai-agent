import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import dotenv from "dotenv";

dotenv.config();

// 通过 configuration 参数配置 DeepSeek
const model = new ChatOpenAI({
  model: "deepseek-chat",  // 或 "deepseek-reasoner"
  temperature: 0.7,
  configuration: {
    baseURL: "https://api.deepseek.com/v1",  // DeepSeek API 地址
    apiKey: process.env.DEEPSEEK_API_KEY,    // 使用 DeepSeek 的 API key
  }
});

// 调用方式保持不变
const response = await model.invoke([
  new HumanMessage("用一句话解释什么是大语言模型？")
]);

console.log(response.content);