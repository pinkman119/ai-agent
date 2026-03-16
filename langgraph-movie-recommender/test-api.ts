/**
 * API 测试客户端 - 用于测试自定义 HTTP API 服务器
 * 
 * 使用方法：
 * 1. 启动 API 服务器: npm run server:dev
 * 2. 运行此脚本: npx tsx test-api.ts
 */

const SERVER_URL = process.env.API_URL || "http://localhost:3000";
const GRAPH_ID = "movieAgent";

/**
 * 调用 movieAgent graph
 */
async function invokeMovieAgent(userMessage: string) {
  try {
    console.log(`\n📡 正在调用 ${SERVER_URL}/${GRAPH_ID}/invoke...`);
    
    const response = await fetch(`${SERVER_URL}/${GRAPH_ID}/invoke`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: userMessage,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("❌ 调用失败:", error.message);
    throw error;
  }
}

/**
 * 流式调用 movieAgent graph
 */
async function streamMovieAgent(userMessage: string) {
  try {
    console.log(`\n🌊 正在流式调用 ${SERVER_URL}/${GRAPH_ID}/stream...`);
    
    const response = await fetch(`${SERVER_URL}/${GRAPH_ID}/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: userMessage,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error("无法读取响应流");
    }

    console.log("\n📥 流式响应:");
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n").filter((line) => line.trim());

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") {
            console.log("\n✅ 流式响应完成");
            return;
          }
          try {
            const parsed = JSON.parse(data);
            console.log(JSON.stringify(parsed, null, 2));
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
    }
  } catch (error: any) {
    console.error("❌ 流式调用失败:", error.message);
    throw error;
  }
}

/**
 * 健康检查
 */
async function healthCheck() {
  try {
    const response = await fetch(`${SERVER_URL}/health`);
    if (response.ok) {
      const data = await response.json();
      console.log("✅ 服务器健康:", data);
      return true;
    }
    return false;
  } catch (error) {
    console.error("❌ 健康检查失败:", error);
    return false;
  }
}

/**
 * 主函数
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || "invoke";
  const message = args[1] || "请推荐一些电影";

  console.log("=".repeat(50));
  console.log("🎬 Movie Agent API 测试客户端");
  console.log("=".repeat(50));

  // 先进行健康检查
  console.log("\n🔍 检查服务器状态...");
  const isHealthy = await healthCheck();
  if (!isHealthy) {
    console.error("\n❌ 服务器未响应，请确保 API 服务器正在运行:");
    console.error("   npm run server:dev");
    process.exit(1);
  }

  console.log(`\n📝 用户消息: ${message}`);

  if (command === "stream") {
    await streamMovieAgent(message);
  } else {
    const result = await invokeMovieAgent(message);
    
    console.log("\n" + "=".repeat(50));
    console.log("📊 响应结果");
    console.log("=".repeat(50));

    // 如果有推荐结果，格式化输出
    if (result.recommendations && result.recommendations.length > 0) {
      console.log("\n🎞️  电影推荐列表:");
      result.recommendations.forEach((movie: any, index: number) => {
        console.log(
          `   ${index + 1}. 《${movie.title}》(${movie.year}) - ${movie.genre} - 评分: ${movie.rating}/10`
        );
      });
    }

    // 输出最后一条 AI 消息
    if (result.messages && result.messages.length > 0) {
      const lastMessage = result.messages[result.messages.length - 1];
      if (lastMessage.content) {
        console.log("\n🤖 AI 回复:");
        console.log("   " + lastMessage.content);
      }
    }

    console.log("\n" + "=".repeat(50));
  }
}

// 运行主函数
main().catch((error) => {
  console.error("\n❌ 发生错误:", error);
  process.exit(1);
});
