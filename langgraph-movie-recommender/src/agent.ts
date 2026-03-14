import { StateGraph, END, START, Annotation } from "@langchain/langgraph";
import { GraphState, messagesReducer } from "./graph/state.js";
import { recommendNode } from "./graph/nodes.js";

/**
 * 定义状态注解
 * 使用 Annotation.Root 来正确定义状态结构
 */
const StateAnnotation = Annotation.Root({
  messages: Annotation<GraphState["messages"]>({
    reducer: messagesReducer,
    default: () => [],
  }),
  recommendations: Annotation<GraphState["recommendations"]>(),
});

/**
 * 构建电影推荐 Agent 图
 * 简单的线性流程：接收用户输入 -> 生成推荐 -> 返回结果
 */
function createMovieAgentGraph() {
  // 创建状态图并添加节点和边
  const workflow = new StateGraph(StateAnnotation)
    .addNode("recommend", recommendNode)
    .addEdge(START, "recommend")
    .addEdge("recommend", END);

  // 编译图
  return workflow.compile();
}

// 导出编译后的图
export const agent = createMovieAgentGraph();
