/**
 * 电影推荐数据结构
 */
export interface MovieRecommendation {
  title: string;
  genre: string;
  year: number;
  rating: number;
  description: string;
}

/**
 * Agent 状态接口
 */
export interface AgentState {
  messages: Array<any>;
  recommendations?: MovieRecommendation[];
}
