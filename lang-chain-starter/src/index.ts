import "dotenv/config";
import { initTracing } from "./config/langsmith.js";
import { movieGraph } from "./graph/movieGraph.js";

async function main() {
  // 初始化 LangSmith 追踪（本地）
  initTracing();

  console.log("🚀 启动电影推荐 Agent 流程（LangGraph + LangSmith）...");

  const result = await movieGraph.invoke({
    input: "推荐10部中文电影",
    movies: [],
  });

  if (result.error) {
    console.error("❌ 执行出错：", result.error);
    return;
  }

  console.log("✅ 推荐结果：");
  if (Array.isArray(result.movies)) {
    console.log(result.movies);
    console.log("总数：", result.movies.length);
  } else {
    console.log([]);
    console.log("总数：", 0);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

