// 引入必要的依赖（注意：在新版 LangChain 中 DynamicTool 位于 @langchain/core/tools）
import { DynamicTool } from "@langchain/core/tools";


// ==================== 1. 简单工具：使用 DynamicTool ====================
// 特点：简单直接，参数为单个字符串

/**
 * 天气查询工具 - DynamicTool版本
 * 工具名: weather_query
 * 参数含义: 输入参数为城市名称字符串
 * 工具描述: 查询指定城市的实时天气情况，输入应为城市名称
 * 是否直接返回: 是，直接返回天气信息字符串
 * 
 * 
 */
const getWeatherDynamicTool = new DynamicTool({
  name: "getWeatherDynamicTool",
  description: "当你需要查询某个城市的天气情况时使用。输入应该是城市名称，如'北京'、'上海'、'New York'。",
  func: async (city: string) => {
    // 模拟天气API调用
    console.log(`正在查询城市 [${city}] 的天气...`);
    
    // 这里应该是真实的API调用，现在模拟返回数据
    const weathers = {
      "北京": "晴朗，气温25°C，空气质量良好",
      "上海": "多云，气温28°C，湿度较大",
      "广州": "雷阵雨，气温32°C，注意带伞",
      "深圳": "阴天，气温30°C，微风",
    };
    
    // 默认返回
    const result = weathers[city as keyof typeof weathers] || 
                  `${city} 天气未知，建议查询当地气象局数据`;
    
    return `🌤️ ${city}天气：${result}`;
  },
});


import { tool } from "@langchain/core/tools";
import { z } from "zod";

const getWeatherTool = tool(
  async ({ city, unit }) => {
    console.log(`正在查询城市 [${city}] 的天气...`);
    return `🌤️ ${city} 天气：25°${unit === 'celsius' ? 'C' : 'F'}`;
  },
  {
    name: "getWeatherTool",
    description: "查询天气",
    schema: z.object({
      city: z.string().describe("城市名称"),
      unit: z.enum(["celsius", "fahrenheit"]).optional().describe("温度单位"),
    }),
  }
);


import { DynamicStructuredTool } from "@langchain/core/tools";

const getDynamicStructuredTool = new DynamicStructuredTool({
  name: "getDynamicStructuredTool",
  description: "查询天气",
  schema: z.object({
    city: z.string().describe("城市名称"),
    unit: z.enum(["celsius", "fahrenheit"]).optional(),
  }),
  func: async ({ city, unit }) => {
    return `🌤️ ${city} 天气：25°${unit === 'fahrenheit' ? 'F' : 'C'}`;
  },
});

export const tools = [getDynamicStructuredTool,getWeatherDynamicTool,getWeatherTool];