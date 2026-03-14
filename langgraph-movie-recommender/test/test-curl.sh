#!/bin/bash
# 使用 curl 测试 Agent 的脚本
# 使用方式: bash test/test-curl.sh

API_URL="http://localhost:2024/movieAgent/invoke"

echo "🚀 开始测试电影推荐 Agent..."
echo "📡 API 地址: $API_URL"
echo ""

curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "请推荐一些电影"
      }
    ]
  }' \
  -w "\n\nHTTP 状态码: %{http_code}\n" \
  | jq '.' 2>/dev/null || cat

echo ""
echo "✨ 测试完成!"
