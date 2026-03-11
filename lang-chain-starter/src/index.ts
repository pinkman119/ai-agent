import * as dotenv from "dotenv";
import { OpenAI } from "langchain";

dotenv.config();

// 使用 DeepSeek 模型
const model = new OpenAI({
  // 按需替换为你要使用的 DeepSeek 具体模型名
  modelName: "deepseek-chat",
  // DeepSeek 的 API Key，从 .env 中读取
  openAIApiKey: process.env.DEEPSEEK_API_KEY,
  // DeepSeek OpenAI 兼容接口地址（通过 configuration 传入）
  configuration: {
    baseURL: process.env.DEEPSEEK_BASE_URL,
  },
} as any);

try {
  const res = await model.call("你好，请问你是谁？");
  console.log(res);
} catch (err: any) {
  // 打印更详细的错误信息，方便排查 403 的具体原因
  console.error("调用 DeepSeek 失败：", err?.response?.status, err?.response?.statusText);
  console.error("响应体：", err?.response?.data);
  throw err;
}
