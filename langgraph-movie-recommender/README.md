# LangGraph 电影推荐 Agent

一个基于 Node.js + LangChain + LangGraph 的简单电影推荐 Agent 示例项目。

## 功能特性

- 使用 LangGraph 构建 Agent 工作流
- 集成 DeepSeek LLM 进行自然语言处理
- 固定返回 10 部经典电影推荐
- 支持 LangGraph 标准部署流程
- 无需数据库，数据硬编码在工具函数中

## 项目结构

```
langgraph-movie-recommender/
├── src/
│   ├── agent.ts              # Agent 图定义和导出入口
│   ├── graph/
│   │   ├── state.ts          # 状态定义
│   │   └── nodes.ts          # 节点函数
│   ├── tools/
│   │   └── movieRecommender.ts  # 电影推荐工具
│   ├── config/
│   │   └── llm.ts            # DeepSeek LLM 配置
│   └── types/
│       └── index.ts          # TypeScript 类型定义
├── langgraph.json            # LangGraph 部署配置
├── package.json              # 项目依赖
├── tsconfig.json             # TypeScript 配置
└── README.md                 # 项目说明文档
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env` 文件（参考 `.env.example`）：

```env
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

### 3. 启动开发服务器

```bash
npm run dev
```

或者使用 LangGraph CLI：

```bash
npx @langchain/langgraph-cli dev
```

### 4. 访问服务

- **API 端点**: `http://127.0.0.1:2024`
- **LangGraph Studio**: 会自动打开浏览器，提供可视化调试界面

## 使用示例

### 通过 API 调用

```bash
curl -X POST http://127.0.0.1:2024/movieAgent/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "请推荐一些电影"
      }
    ]
  }'
```

### 在代码中使用

```typescript
import { agent } from "./src/agent.js";

const result = await agent.invoke({
  messages: [
    {
      role: "user",
      content: "请推荐一些电影",
    },
  ],
});

console.log(result.messages[result.messages.length - 1].content);
```

## 技术栈

- **Node.js**: JavaScript 运行时
- **TypeScript**: 类型安全的 JavaScript
- **LangChain**: LLM 应用开发框架
- **LangGraph**: 基于 LangChain 的状态图框架
- **DeepSeek**: LLM 提供商

## 项目特点

- ✅ 生产级项目结构和命名规范
- ✅ TypeScript 类型安全
- ✅ 最小化依赖，仅使用核心框架
- ✅ 支持 LangGraph 标准部署
- ✅ 无需数据库，简单易用

## 开发说明

### 构建项目

```bash
npm run build
```

### 运行编译后的代码

```bash
npm start
```

## 许可证

MIT
