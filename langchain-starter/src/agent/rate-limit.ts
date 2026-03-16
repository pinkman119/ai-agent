// import { InMemoryRateLimiter } from "@langchain/core/rate_limiters";
// import { ChatDeepSeek } from "@langchain/deepseek";

// // 1. 创建内存限流器实例
// const rateLimiter = new InMemoryRateLimiter({
//   requestsPerSecond: 0.5,      // 每秒0.5个请求，即每2秒1次
//   checkEveryNSeconds: 0.1,      // 每100ms检查一次令牌
//   maxBucketSize: 10,            // 令牌桶最大容量，允许突发请求
// });

// // 2. 创建 DeepSeek 模型并绑定限流器
// const model = new ChatDeepSeek({
//   apiKey: "你的密钥",
//   model: "deepseek-chat",
//   temperature: 0.7,
//   rateLimiter: rateLimiter,      // 关键：将限流器传给模型
// });

// // 3. 测试限流效果
// async function testRateLimiter() {
//   console.log("开始测试限流器...");
  
//   for (let i = 0; i < 5; i++) {
//     const start = Date.now();
    
//     try {
//       const response = await model.invoke(`请求 #${i + 1}: 你好`);
//       const end = Date.now();
//       console.log(`请求 ${i + 1} 完成，耗时: ${(end - start) / 1000}秒`);
//     } catch (error) {
//       console.error(`请求 ${i + 1} 失败:`, error);
//     }
//   }
// }

// // testRateLimiter();