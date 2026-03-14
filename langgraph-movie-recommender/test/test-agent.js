/**
 * 简单的 Agent 调用测试脚本
 * 使用方式: node test/test-agent.js
 */

const API_URL = "http://localhost:2024/movieAgent/invoke";

async function testAgent() {
  console.log("🚀 开始测试电影推荐 Agent...\n");
  console.log(`📡 API 地址: ${API_URL}\n`);

  const requestBody = {
    messages: [
      {
        role: "user",
        content: "请推荐一些电影",
      },
    ],
  };

  console.log("📤 发送请求:");
  console.log(JSON.stringify(requestBody, null, 2));
  console.log("\n");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP 错误! 状态: ${response.status}`);
    }

    const data = await response.json();
    
    console.log("✅ 响应成功!\n");
    console.log("📥 响应数据:");
    console.log(JSON.stringify(data, null, 2));
    console.log("\n");

    // 提取并显示推荐内容
    if (data.messages && data.messages.length > 0) {
      const lastMessage = data.messages[data.messages.length - 1];
      console.log("🎬 电影推荐内容:");
      console.log("─".repeat(50));
      if (typeof lastMessage.content === "string") {
        console.log(lastMessage.content);
      } else {
        console.log(JSON.stringify(lastMessage.content, null, 2));
      }
      console.log("─".repeat(50));
    }

    // 显示推荐列表
    if (data.recommendations && data.recommendations.length > 0) {
      console.log("\n📋 推荐电影列表:");
      data.recommendations.forEach((movie, index) => {
        console.log(
          `${index + 1}. 《${movie.title}》(${movie.year}) - ${movie.genre} - 评分: ${movie.rating}/10`
        );
      });
    }

    console.log("\n✨ 测试完成!");
  } catch (error) {
    console.error("❌ 测试失败:");
    console.error(error.message);
    
    if (error.message.includes("fetch")) {
      console.error("\n💡 提示:");
      console.error("1. 确保 LangGraph 服务器正在运行 (npm run dev)");
      console.error("2. 检查服务器地址是否正确");
      console.error("3. 检查网络连接");
    }
    process.exit(1);
  }
}

// 运行测试
testAgent();
