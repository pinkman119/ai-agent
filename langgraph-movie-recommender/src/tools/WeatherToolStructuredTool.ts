import { StructuredTool } from "@langchain/core/tools";
import { z } from "zod";

// 用面向对象方式创建工具
class WeatherToolStructuredTool extends StructuredTool {
  name = "WeatherToolStructuredTool";
  description = "查询天气";
  schema = z.object({
    city: z.string().describe("城市名称"),
    unit: z.enum(["celsius", "fahrenheit"]).optional(),
  });
  async _call({ city, unit }: z.infer<typeof this.schema>) {
    // 复杂业务逻辑
    const temp = unit === 'fahrenheit' ? 77 : 25;
    return `🌤️ ${city} 天气：${temp}°${unit === 'fahrenheit' ? 'F' : 'C'}`;
  }
}

export const weatherToolStructuredTool = new WeatherToolStructuredTool();