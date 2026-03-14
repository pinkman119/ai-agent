import { StateGraph, END, START } from "@langchain/langgraph";
import { GraphState, messagesReducer } from "./graph/state.js";
import { recommendNode } from "./graph/nodes.js";

/**
 * 构建电影推荐 Agent 图
 * 简单的线性流程：接收用户输入 -> 生成推荐 -> 返回结果
 */
function createMovieAgentGraph() {
  // 创建状态图
  const workflow = new StateGraph<GraphState>({
    channels: {
      messages: {
        reducer: messagesReducer,
        default: () => [],
      },
      recommendations: {
        default: () => undefined,
      },
    },
  });

  // 添加节点
  workflow.addNode("recommend", recommendNode);

  // 设置入口点
  workflow.addEdge(START, "recommend");
  workflow.addEdge("recommend", END);

  // 编译图
  return workflow.compile();
}

// 导出编译后的图
export const agent = createMovieAgentGraph();
