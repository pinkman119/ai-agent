import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import dotenv from "dotenv";

dotenv.config();

const model = new ChatOpenAI({
  model: "deepseek-chat",  
  temperature: 0.7,
  configuration: {
    baseURL: process.env.DEEPSEEK_BASE_URL,  
    apiKey: process.env.DEEPSEEK_API_KEY,    
  }
});

// 使用流式输出
const stream = await model.stream([
  new HumanMessage("解释一下什么是流式输出？")
]);

for await (const chunk of stream) {
    // 这个chunk可以看做装内容的一个小单位
  const content = chunk.content as any;

  if (typeof content === "string") {
    // 大多数情况下，content 会直接是字符串
    process.stdout.write(content);
  } else if (Array.isArray(content)) {
    // 有些模型会返回 content 数组，需要拼接 text 字段
    for (const part of content) {
      if (part?.type === "text" && typeof part.text === "string") {
        process.stdout.write(part.text);
      }
    }
  }
}

console.log("\n\n[流式输出结束]");