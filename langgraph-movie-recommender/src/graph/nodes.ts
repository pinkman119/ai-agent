import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { GraphState } from "./state.js";
import { getMovieRecommendations } from "../tools/movieRecommender.js";
import { createDeepSeekLLM } from "../config/deepSeek.js";

/**
 * 推荐节点
 * 调用电影推荐工具，使用 LLM 格式化输出推荐结果
 */
export async function recommendNode(
  state: GraphState
): Promise<Partial<GraphState>> {
  // 获取电影推荐列表
  const movies = getMovieRecommendations();
  
  // 创建 LLM 实例
  const llm = createDeepSeekLLM();
  
  // 构建提示词
  const movieList = movies
    .map(
      (movie, index) =>
        `${index + 1}. 《${movie.title}》(${movie.year}) - ${movie.genre} - 评分: ${movie.rating}/10\n   简介: ${movie.description}`
    )
    .join("\n\n");

  const prompt = `你是一个专业的电影推荐助手。以下是为你推荐的10部经典电影：

${movieList}

请用友好、专业的语气向用户介绍这些电影推荐，突出每部电影的亮点和值得观看的理由。`;

  // 调用 LLM 生成推荐文本
  const response = await llm.invoke([new HumanMessage(prompt)]);
  
  // 返回更新后的状态
  return {
    messages: [
      new AIMessage({
        content: response.content,
      }),
    ],
    recommendations: movies,
  };
}
