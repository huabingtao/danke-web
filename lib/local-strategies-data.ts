export interface StrategyArticle {
  id: string;
  slug: string;
  title: string;
  tag?: string;
  category: string;
  categoryLabel: string;
  summary: string;
  coverImage?: string;
  coverVertical?: string;
  publishedAt: string;
  updatedAt?: string;
  gameVersion?: string;
  tags: string[];
  externalUrl?: string;
  isPinned?: boolean;
  isMustRead?: boolean;
  series?: string;
  subtopic?: string;
  subtopicLabel?: string;
  contentType?: string;
  date?: string;
  highlights?: string[];
}

// 手动指定的本期重点置顶攻略（非日历重磅爆料精算）
export const FEATURED_STRATEGY: StrategyArticle = {
  id: 'featured-1',
  slug: 'pub-20260911-2247486319',
  title: '【爆料】月殇护手开启异星神炼：全等级效果与质变节点深度解析',
  tag: '爆料',
  category: 'event',
  categoryLabel: '版本爆料',
  summary: '月殇护手（SS手套）异星神炼全13级属性明细、四大触发机制实战分析与平民/高战分档投资建议。',
  coverImage: '/uploads/creator/爆料/ss手套开启神炼/cover.png',
  coverVertical: '/uploads/creator/爆料/ss手套开启神炼/cover_vertical.png',
  publishedAt: '2026-09-11',
  updatedAt: '2026-09-11',
  gameVersion: 'v2.11+',
  tags: ['爆料', '版本爆料', 'SS手套神炼', '质变节点'],
  isPinned: true,
};

// 新玩家必读精选（4篇核心次要攻略，100%本地战术详情页可达，真实专属封面）
export const MUST_READ_STRATEGIES: StrategyArticle[] = [
  {
    id: 'mr-1',
    slug: 'pub-20260831-2247486070',
    title: '高频问答 FAQ 第一弹：特工选择、狼马对比与配件过载全指南',
    tag: '答疑',
    category: 'agent',
    categoryLabel: '常见问题',
    summary: '解决萌新最纠结的核心问题：开局特工顺位、坐骑过渡路径、配件过载触发机制与红装神铸踩坑预警。',
    coverImage: '/uploads/creator/其他/高频问答第一弹/cover.png',
    coverVertical: '/uploads/creator/其他/高频问答第一弹/cover_vertical.png',
    publishedAt: '2026-08-31',
    gameVersion: 'v2.10+',
    tags: ['答疑', '新手必读', '特工选择', '避坑指南'],
    isMustRead: true,
  },
  {
    id: 'mr-2',
    slug: 'pub-20260910-1000000149',
    title: '最新 S 特工伊狑实测分析：爆发机制、星级质变与装备契合度',
    tag: '特工',
    category: 'agent',
    categoryLabel: '特工评测',
    summary: '特工机制与增伤倍率实测拆解，微氪与零氪玩家的星级解锁顺位及武器共鸣实战推荐。',
    coverImage: '/uploads/creator/特工/s特工伊狑分析/cover.png',
    coverVertical: '/uploads/creator/特工/s特工伊狑分析/cover_vertical.png',
    publishedAt: '2026-09-10',
    gameVersion: 'v2.11+',
    tags: ['特工', '特工养成', '伤害机制', '星级质变'],
    isMustRead: true,
  },
  {
    id: 'mr-3',
    slug: 'pub-20260818-2247485796',
    title: 'S 级战术宠物从入门到精通：洗练被动与出战契约搭配',
    tag: '宠物',
    category: 'resources',
    categoryLabel: '装备养成',
    summary: '系统讲解宠物升级、被动技能锁词条逻辑与异宠核心搭配，避免乱耗金币与觉醒石。',
    coverImage: '/uploads/creator/宠物/从入门到入土-宠物篇/cover.png',
    coverVertical: '/uploads/creator/宠物/从入门到入土-宠物篇/cover_vertical.png',
    publishedAt: '2026-08-18',
    gameVersion: 'v2.10+',
    tags: ['宠物', '战术宠物', '洗练指南', '配队思路'],
    isMustRead: true,
  },
  {
    id: 'mr-4',
    slug: 'pub-20260912-1000000157',
    title: '高频问答 FAQ 第二弹：特工协同 741、神炼节奏与扭曲腰带门槛',
    tag: '答疑',
    category: 'agent',
    categoryLabel: '常见问题',
    summary: '深入解答特工 741 含义、神炼材料投入优先度、扭曲腰带伤害放大门槛等中高阶疑难。',
    coverImage: '/uploads/creator/其他/高频问答第二弹/cover.png',
    coverVertical: '/uploads/creator/其他/高频问答第二弹/cover_vertical.png',
    publishedAt: '2026-09-12',
    gameVersion: 'v2.11+',
    tags: ['答疑', '高阶答疑', '神炼节奏', '装备门槛'],
    isMustRead: true,
  },
];

// 最新攻略完整列表（6-8篇纯真实数据，支持分类筛选）
export const ALL_STRATEGIES: StrategyArticle[] = [
  {
    id: 's-101',
    slug: 'ss-glove-god-forge',
    title: '【爆料】月殇护手开启异星神炼：全等级效果与质变节点深度解析',
    tag: '爆料',
    category: 'version',
    categoryLabel: '版本前瞻',
    summary: '月殇护手（SS手套）异星神炼全13级属性明细、四大触发机制实战分析与平民/高战分档投资建议。',
    coverImage: '/uploads/creator/爆料/ss手套开启神炼/cover.png',
    publishedAt: '2026-09-11',
    gameVersion: 'v2.11+',
    tags: ['爆料', '版本爆料', '月殇护手', '异星神炼'],
  },
  {
    id: 's-102',
    slug: 'water-park-chaos',
    title: '【活动】水上乐园大乱斗全解析：330/630档位开箱与补钻精算指南',
    tag: '活动',
    category: 'season',
    categoryLabel: '赛季攻略',
    summary: '水上乐园大乱斗活动玩法机制、任务产出明细表、三大开箱冲级方案及兑换优先级精算。',
    coverImage: '/uploads/creator/活动/水上乐园大乱斗/cover.png',
    publishedAt: '2026-09-11',
    gameVersion: 'v2.11',
    tags: ['活动', '活动精算', '水上乐园', '代币兑换'],
  },
  {
    id: 's-103',
    slug: 'anniversary-4th-gacha-calc',
    title: '【4周年庆】一番赏与彩虹骰阶梯消耗精算：低成本拿保底全指南',
    tag: '活动',
    category: 'season',
    categoryLabel: '赛季攻略',
    summary: '深度拆解 4 周年一番赏每日免费抓取上限、彩虹矿石兑换顺位与微氪党/零氪玩家止损节点。',
    coverImage: '/uploads/creator/活动/4周年活动爆料详细内容/cover.png',
    publishedAt: '2026-09-06',
    gameVersion: 'v2.11+',
    tags: ['活动', '活动精算', '保底策略', '一番赏'],
    externalUrl: 'https://mp.weixin.qq.com/s/vN79nJW3Cyn9sy0UDGvKaw',
  },
  {
    id: 's-104',
    slug: 'echoes-of-battle-boss',
    title: '【回响之战】狂暴机械主脑 & 毒雾暴君：极限刷分走位与技能搭配',
    tag: '区域行动',
    category: 'season',
    categoryLabel: '赛季攻略',
    summary: '针对本周回响之战高难度 Boss 的弹幕死角、开局 60 秒技能抓取优先级及特工无伤卡位技巧。',
    coverImage: '/uploads/creator/区域行动/cover.png',
    publishedAt: '2026-09-05',
    gameVersion: 'v2.11',
    tags: ['区域行动', '回响之战', 'Boss走位', '极限刷分'],
  },
  {
    id: 's-105',
    slug: 'faq-vol-1',
    title: '【高频问答】FAQ 第一弹：特工选择、狼马对比与配件过载全指南',
    tag: '答疑',
    category: 'faq',
    categoryLabel: '常见问题',
    summary: '解决萌新最纠结的核心问题：开局特工顺位、坐骑过渡路径、配件过载触发机制与红装神铸踩坑预警。',
    coverImage: '/uploads/creator/其他/高频问答第一弹/cover.png',
    publishedAt: '2026-09-03',
    gameVersion: 'v2.10+',
    tags: ['答疑', '新手必读', '特工选择', '避坑指南'],
    externalUrl: 'https://mp.weixin.qq.com/s/QMfvpK7okI0yFyg2kRYkXQ',
  },
  {
    id: 's-106',
    slug: 'agent-yilin-deep-dive',
    title: '【特工测评】最新 S 特工伊狑实测：爆发机制、星级质变与装备契合度',
    tag: '特工',
    category: 'growth',
    categoryLabel: '养成提升',
    summary: '特工机制与增伤倍率实测拆解，微氪与零氪玩家的星级解锁顺位及武器共鸣实战推荐。',
    coverImage: '/uploads/creator/特工/s特工伊狑分析/cover.png',
    publishedAt: '2026-08-28',
    gameVersion: 'v2.10+',
    tags: ['特工', '特工养成', '伤害机制', '星级质变'],
    externalUrl: 'https://mp.weixin.qq.com/s/E0sOnFzWfDOI_giJ9_b5cg',
  },
  {
    id: 's-107',
    slug: 'pet-system-complete-guide',
    title: '【宠物指南】S 级战术宠物从入门到精通：洗练被动与出战契约搭配',
    tag: '宠物',
    category: 'growth',
    categoryLabel: '养成提升',
    summary: '系统讲解宠物升级、被动技能锁词条逻辑与异宠核心搭配，避免乱耗金币与觉醒石。',
    coverImage: '/uploads/creator/宠物/从入门到入土-宠物篇/cover.png',
    publishedAt: '2026-08-22',
    gameVersion: 'v2.10+',
    tags: ['宠物', '战术宠物', '洗练指南', '配队思路'],
    externalUrl: 'https://mp.weixin.qq.com/s/pJitLL_Vu7wI9ctzSM-EMg',
  },
  {
    id: 's-108',
    slug: 'damage-calc-tool-usage',
    title: '【新手工具】手把手教你使用《弹壳特攻队》特工伤害计算器',
    tag: '答疑',
    category: 'beginner',
    categoryLabel: '新手入坑',
    summary: '无需复杂公式，输入攻击力面板与装备词条即可精算局内技能期望输出与神铸收益。',
    coverImage: '/uploads/creator/其他/高频问答第一弹/cover.png',
    publishedAt: '2026-08-15',
    gameVersion: '全版本',
    tags: ['答疑', '伤害精算', '工具指南', '新手必读'],
    externalUrl: 'https://mp.weixin.qq.com/s/vN79nJW3Cyn9sy0UDGvKaw',
  },
];
