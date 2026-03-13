import { StateGraph, START, END } from "@langchain/langgraph";
import type { RunnableConfig } from "@langchain/core/runnables";
import { recommendMovies, type Movie } from "../agents/movieRecommenderAgent.ts";

// 定义图中使用的状态结构
export interface MovieAgentState {
  input: string;
  movies: Movie[];
  error?: string;
}

// 初始化状态图
const workflow = new StateGraph<MovieAgentState>({
  channels: {
    input: {
      value: (x: string) => x,
    },
    movies: {
      value: (x: Movie[]) => x,
    },
    error: {
      value: (x?: string) => x,
    },
  },
});

// 节点：调用推荐电影 Agent
async function movieNode(
  state: MovieAgentState,
  _config?: RunnableConfig
): Promise<Partial<MovieAgentState>> {
  try {
    const { movies } = await recommendMovies(10, "中文");
    return {
      movies,
      error: undefined,
    };
  } catch (err) {
    return {
      movies: [],
      error: (err as Error).message ?? String(err),
    };
  }
}

workflow.addNode("movie_recommender", movieNode);
workflow.addEdge(START, "movie_recommender");
workflow.addEdge("movie_recommender", END);

export const movieGraph = workflow.compile();

