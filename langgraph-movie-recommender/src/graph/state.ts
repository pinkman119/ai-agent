import type { BaseMessage } from "@langchain/core/messages";
import { MovieRecommendation } from "../types/index.js";

/**
 * 定义 Agent 的状态结构
 */
export interface GraphState {
  messages: BaseMessage[];
  recommendations?: MovieRecommendation[];
}

/**
 * 状态 reducer 函数
 * 用于合并消息到现有状态
 */
export function messagesReducer(
  x: BaseMessage[],
  y: BaseMessage[]
): BaseMessage[] {
  return x.concat(y);
}
