import { z } from "zod";
import { ChatDeepSeek } from "@langchain/deepseek";

// 1. 定义：最外层是对象，里面有一个 movies 数组字段
const movieSchema = z.object({
  movies: z.array(
    z.object({
      name: z.string().describe("电影名称"),
      rating: z.string().describe("电影评分"),
      describe: z.string().describe("电影简介"),
    })
  ),
});

// 2. 初始化模型
const model = new ChatDeepSeek({
  model: "deepseek-chat",
  temperature: 0,
});

// 3. 绑定成结构化输出模型（schema 最外层是 object，符合 DeepSeek 要求）
const structuredModel = model.withStructuredOutput(movieSchema, {
  name: "movie_list",
});

// 4. 调用：明确让它给 10 部电影
const result = await structuredModel.invoke("请推荐10部电影，并给出评分和简介，要求中文电影");

// 5. result 现在是一个对象，真正的数组在 result.movies 里
console.log(result); // 预期是 10

/*
    思路：处理无法进行格式化的大模型，你可以用提示词 + JSON解析的方式来处理
    1. 请你帮我输出一个xxx，严格基于JSON格式，无其他额外内容，可以直接进行JSON转换，要求{"name":"xxx","rating":""}
    2. 拿到大模型返回的JSON数据进行解析
*/