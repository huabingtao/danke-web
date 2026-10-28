export interface VehicleSkill {
  unlockedAt: string;
  title: string;
  desc: string;
}

export interface VehicleData {
  id: string;
  name: string;
  tier: string;
  image: string;
  qualityBadge: string;
  speed: string;
  description: string;
  coreSkills: VehicleSkill[];
  layoutTip: string;
}

export const VEHICLES_DATA: VehicleData[] = [
  {
    id: "veh_9007",
    name: "末世战马",
    tier: "SS",
    image: "/wiki/vehicles/末世战马.png",
    qualityBadge: "SS级传说",
    speed: "基础移动速度 +150 / 极速冲刺",
    description: "曾经万里挑一的汗血宝马，在感染了E细胞之后却发生了超强的进化。",
    coreSkills: [
      {
        unlockedAt: "基础形态",
        title: "赤兔狂奔",
        desc: "骑乘状态移动速度大幅提升，对撞击沿途敌群造成高额物理碰撞伤害。"
      },
      {
        unlockedAt: "进阶共振",
        title: "神驹破势",
        desc: "冲刺过程中获得全额霸体与护盾，受到攻击时将部分伤害反弹给周围敌群。"
      },
      {
        unlockedAt: "芯片改装",
        title: "末世咆哮",
        desc: "释放战马践踏，在前方地面引发环形冲击波并施加25%独立物理易伤。"
      }
    ],
    layoutTip: "主驾战车首选，冲刺撞击提供极强易伤与破盾，适合高压尸潮与回响Boss竞速。"
  },
  {
    id: "veh_9008",
    name: "幽焰逐影",
    tier: "S",
    image: "/wiki/vehicles/幽焰逐影.png",
    qualityBadge: "S级绝品",
    speed: "基础移动速度 +120 / 幽焰滑行",
    description: "灾变降临后诞生的特殊实验体，身披幽焰，影随魂行。",
    coreSkills: [
      {
        unlockedAt: "基础形态",
        title: "幽焰轨迹",
        desc: "行驶轨迹留下持续灼烧的幽焰地带，对踏入的敌人造成持续暗影灼伤。"
      },
      {
        unlockedAt: "副驾联动",
        title: "魂盾共鸣",
        desc: "副驾共振时为特工提供20%常驻减伤与受击幽焰爆炸反震。"
      }
    ],
    layoutTip: "高难挑战和持久生存核心，幽焰抗性与护盾联动，副驾共振极大减免受到伤害。"
  },
  {
    id: "veh_9009",
    name: "科技滑板",
    tier: "杰出",
    image: "/wiki/vehicles/科技滑板.png",
    qualityBadge: "杰出战车",
    speed: "基础移动速度 +90 / 气动滑行",
    description: "最新一代的喷气式防护型滑板，可提供全方位的保护。",
    coreSkills: [
      {
        unlockedAt: "气动推进",
        title: "悬浮机动",
        desc: "悬浮规避地面减速带与障碍物，提供平稳机动规避走位。"
      },
      {
        unlockedAt: "能量护盾",
        title: "脉冲发生",
        desc: "每隔15秒生成一层吸收特工最大生命15%伤害的能量护盾。"
      }
    ],
    layoutTip: "气动悬浮机动性强，自带减伤护盾与碰撞反击，中盘过渡性价比极佳。"
  },
  {
    id: "veh_9010",
    name: "电动平衡车",
    tier: "优秀",
    image: "/wiki/vehicles/电动平衡车.png",
    qualityBadge: "精良座驾",
    speed: "基础移动速度 +60 / 轻巧巡弋",
    description: "经过科技改造过的电动平衡车，让旅途变的更加安全。",
    coreSkills: [
      {
        unlockedAt: "轻巧走位",
        title: "灵活穿行",
        desc: "车体轻巧，在狭窄走廊与怪群边缘快速巡弋与拾取经验豆。"
      }
    ],
    layoutTip: "极速穿行战场，走位灵活，适合快速扫图、收集经验与前期过渡。"
  }
];
