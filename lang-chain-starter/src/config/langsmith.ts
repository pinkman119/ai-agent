import "dotenv/config";

// 统一初始化 LangSmith 追踪（本地开发用）
export function initTracing() {
  // 如果用户在 .env 里没配，可以在这里兜底
  if (!process.env.LANGSMITH_PROJECT) {
    process.env.LANGSMITH_PROJECT = "ai-agent-local";
  }

  // 开启 LangSmith tracing（LangChain / LangGraph 会自动上报）
  if (!process.env.LANGSMITH_TRACING) {
    process.env.LANGSMITH_TRACING = "true";
  }
}

