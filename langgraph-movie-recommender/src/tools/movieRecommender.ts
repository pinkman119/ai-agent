import { MovieRecommendation } from "../types/index.js";

/**
 * 获取10部预设电影推荐
 * 返回硬编码的经典电影列表
 */
export function getMovieRecommendations(): MovieRecommendation[] {
  return [
    {
      title: "肖申克的救赎",
      genre: "剧情",
      year: 1994,
      rating: 9.7,
      description: "银行家安迪被冤枉入狱，在肖申克监狱中展现坚韧与智慧，最终重获自由。",
    },
    {
      title: "教父",
      genre: "犯罪/剧情",
      year: 1972,
      rating: 9.3,
      description: "黑帮家族的故事，展现了权力、家族和背叛的复杂关系。",
    },
    {
      title: "黑暗骑士",
      genre: "动作/犯罪",
      year: 2008,
      rating: 9.2,
      description: "蝙蝠侠与小丑的终极对决，探讨正义与邪恶的界限。",
    },
    {
      title: "十二怒汉",
      genre: "剧情",
      year: 1957,
      rating: 9.4,
      description: "12位陪审员在密闭房间中讨论一桩谋杀案，展现人性的复杂。",
    },
    {
      title: "辛德勒的名单",
      genre: "剧情/历史",
      year: 1993,
      rating: 9.5,
      description: "二战期间，德国商人辛德勒拯救了1200名犹太人的真实故事。",
    },
    {
      title: "阿甘正传",
      genre: "剧情/爱情",
      year: 1994,
      rating: 9.5,
      description: "智商只有75的阿甘，用纯真和坚持创造了不平凡的人生。",
    },
    {
      title: "盗梦空间",
      genre: "科幻/悬疑",
      year: 2010,
      rating: 9.3,
      description: "在梦境中植入想法的复杂任务，探讨现实与梦境的界限。",
    },
    {
      title: "泰坦尼克号",
      genre: "爱情/灾难",
      year: 1997,
      rating: 9.4,
      description: "在泰坦尼克号上的浪漫爱情故事，展现了人性的光辉。",
    },
    {
      title: "星际穿越",
      genre: "科幻/冒险",
      year: 2014,
      rating: 9.3,
      description: "为了拯救人类，一群探险家穿越虫洞寻找新家园。",
    },
    {
      title: "楚门的世界",
      genre: "剧情/科幻",
      year: 1998,
      rating: 9.3,
      description: "楚门发现自己生活在一个巨大的电视节目中，决定逃离虚假的世界。",
    },
  ];
}
