import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";

// 加载环境变量
dotenv.config();

/**
 * 创建并配置 DeepSeek LLM 实例
 * DeepSeek 使用 OpenAI 兼容的 API 接口
 */
export function createDeepSeekLLM() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const baseURL = process.env.DEEPSEEK_BASE_URL;

  return new ChatOpenAI({
    modelName: "deepseek-chat",
    temperature: 0.7,
    apiKey: apiKey,
    configuration: {
      baseURL: baseURL,
    },
  });
}
