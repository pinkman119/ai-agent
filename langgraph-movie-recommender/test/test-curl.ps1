# PowerShell 版本的 curl 测试脚本
# 使用方式: .\test\test-curl.ps1

$API_URL = "http://localhost:2024/movieAgent/invoke"

Write-Host "🚀 开始测试电影推荐 Agent..." -ForegroundColor Green
Write-Host "📡 API 地址: $API_URL" -ForegroundColor Cyan
Write-Host ""

$body = @{
    messages = @(
        @{
            role = "user"
            content = "请推荐一些电影"
        }
    )
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $API_URL -Method Post -Body $body -ContentType "application/json"
    
    Write-Host "✅ 响应成功!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📥 响应数据:" -ForegroundColor Yellow
    $response | ConvertTo-Json -Depth 10
    
    # 显示推荐内容
    if ($response.messages -and $response.messages.Count -gt 0) {
        $lastMessage = $response.messages[-1]
        Write-Host ""
        Write-Host "🎬 电影推荐内容:" -ForegroundColor Magenta
        Write-Host ("─" * 50)
        Write-Host $lastMessage.content
        Write-Host ("─" * 50)
    }
    
    # 显示推荐列表
    if ($response.recommendations -and $response.recommendations.Count -gt 0) {
        Write-Host ""
        Write-Host "📋 推荐电影列表:" -ForegroundColor Cyan
        $index = 1
        foreach ($movie in $response.recommendations) {
            Write-Host "$index. 《$($movie.title)》($($movie.year)) - $($movie.genre) - 评分: $($movie.rating)/10"
            $index++
        }
    }
    
    Write-Host ""
    Write-Host "✨ 测试完成!" -ForegroundColor Green
} catch {
    Write-Host "❌ 测试失败:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    Write-Host ""
    Write-Host "💡 提示:" -ForegroundColor Yellow
    Write-Host "1. 确保 LangGraph 服务器正在运行 (npm run dev)"
    Write-Host "2. 检查服务器地址是否正确"
    Write-Host "3. 检查网络连接"
}
