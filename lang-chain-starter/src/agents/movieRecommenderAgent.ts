import { z } from "zod";
import { ChatDeepSeek } from "@langchain/deepseek";

// 定义电影列表的结构化输出 Schema
const movieListSchema = z.object({
  movies: z.array(
    z.object({
      name: z.string().describe("电影名称"),
      rating: z.string().describe("电影评分"),
      describe: z.string().describe("电影简介"),
    })
  ),
});

const model = new ChatDeepSeek({
  model: "deepseek-chat",
  temperature: 0.7,
  maxTokens: 1000,
});

export type Movie = z.infer<typeof movieListSchema>["movies"][number];

// 对外暴露的 Agent 能力：推荐电影
export async function recommendMovies(count = 10, language = "中文") {
  const structuredModel = model.withStructuredOutput(movieListSchema, {
    name: "movie_list",
  });

  const prompt = `请推荐${count}部${language}电影，并给出评分和简介。`;
  const result = await structuredModel.invoke(prompt);

  return {
    movies: result.movies as Movie[],
  };
}

