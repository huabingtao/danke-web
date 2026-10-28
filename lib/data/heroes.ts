export interface HeroStarSkill {
  star: string;
  type: 'personal' | 'all';
  desc: string;
  isKey?: boolean;
}

export interface HeroData {
  id: string;
  name: string;
  title: string;
  tier: 'SP' | 'S' | 'A';
  avatar: string;
  tag: string;
  description: string;
  exclusiveSkill: {
    name: string;
    desc: string;
    evolutionName: string;
    evolutionDesc: string;
  };
  synergyInfo?: {
    recommendRank: string;
    synergyCoreCost: string;
    role: '主输出 (中)' | '协同辅助 (左/右)' | '万能过渡';
  };
  keyStats: {
    damageType: string;
    targetTags: string[];
    allHeroBuffs: string[];
  };
  stars: HeroStarSkill[];
}

export const HEROES_DATA: HeroData[] = [
  {
    "id": "hero_6001",
    "name": "科萌",
    "title": "A级特工 · 科萌",
    "tier": "A",
    "avatar": "/wiki/heroes/科萌.png",
    "tag": "A级特工 · male|nohair",
    "description": "居家宅男，痴迷于各种漫画、武器、外星生物、神秘学。\\n大灾变后被动加入冬眠计划，后在人类反攻行动中，侥幸通过了“梦境试炼”被唤醒，苦于一直没有自主选择的机会...",
    "exclusiveSkill": {
      "name": "科萌专属特工技",
      "desc": "特工科萌专属战斗技巧与专属机制。",
      "evolutionName": "真·科萌绝技",
      "evolutionDesc": "科萌进阶超武进化形态，战斗能力全面觉醒。"
    },
    "synergyInfo": {
      "recommendRank": "战术特工",
      "synergyCoreCost": "A级特工专属核心",
      "role": "万能过渡"
    },
    "keyStats": {
      "damageType": "科萌专属流派",
      "targetTags": [
        "战术技能",
        "属性加成"
      ],
      "allHeroBuffs": [
        "特工专属战斗加成"
      ]
    },
    "stars": [
      {
        "star": "1星",
        "type": "personal",
        "desc": "毫无重点\\n增加3%所有技能伤害",
        "isKey": false
      },
      {
        "star": "2星",
        "type": "personal",
        "desc": "2星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "3星",
        "type": "personal",
        "desc": "过期计划\\n增加3%所有技能范围",
        "isKey": true
      },
      {
        "star": "4星",
        "type": "personal",
        "desc": "4星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "5星",
        "type": "personal",
        "desc": "特工属性提升：{\"HeroMaxHpRate\":0.04}",
        "isKey": true
      },
      {
        "star": "6星",
        "type": "personal",
        "desc": "手忙脚乱\\n减少3%所有技能冷却",
        "isKey": true
      }
    ]
  },
  {
    "id": "hero_6002",
    "name": "月咏",
    "title": "A级特工 · 月咏",
    "tier": "A",
    "avatar": "/wiki/heroes/月咏.png",
    "tag": "A级特工 · female|longhair",
    "description": "高冷萌妹，讨厌一切麻烦的事情，是极少数没有参加冬眠计划的平民，拥有高超剑术和强大实力，甚至没有选择居住在地下庇护所。\\n据说大钢牙的下巴和手臂就是因为打扰她休息被斩下的...",
    "exclusiveSkill": {
      "name": "月咏专属特工技",
      "desc": "特工月咏专属战斗技巧与专属机制。",
      "evolutionName": "真·月咏绝技",
      "evolutionDesc": "月咏进阶超武进化形态，战斗能力全面觉醒。"
    },
    "synergyInfo": {
      "recommendRank": "战术特工",
      "synergyCoreCost": "A级特工专属核心",
      "role": "万能过渡"
    },
    "keyStats": {
      "damageType": "月咏专属流派",
      "targetTags": [
        "战术技能",
        "属性加成"
      ],
      "allHeroBuffs": [
        "特工专属战斗加成"
      ]
    },
    "stars": [
      {
        "star": "1星",
        "type": "personal",
        "desc": "月影斩\\n向前方释放强力斩击",
        "isKey": false
      },
      {
        "star": "2星",
        "type": "personal",
        "desc": "2星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "3星",
        "type": "personal",
        "desc": "双刀流\\n当获得刀类主武器的超武时，月华斩可再次进阶",
        "isKey": true
      },
      {
        "star": "4星",
        "type": "personal",
        "desc": "4星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "5星",
        "type": "personal",
        "desc": "特工属性提升：{\"HeroApRate\":0.04}",
        "isKey": true
      },
      {
        "star": "6星",
        "type": "personal",
        "desc": "超武解禁\\n月华斩再次进阶不再受到主武器限制",
        "isKey": true
      }
    ]
  },
  {
    "id": "hero_6003",
    "name": "凯蒂斯",
    "title": "A级特工 · 凯蒂斯",
    "tier": "A",
    "avatar": "/wiki/heroes/凯蒂斯.png",
    "tag": "A级特工 · animal|nohair",
    "description": "猫咪动物大学毕业的高材生，曾经是人类，之前一直从事科技配件研究，专攻E细胞研究。\\n因为E细胞发生了事故，自己进行了人体实验，与猫咪融合了。在一次变异者围攻中被科萌所救，开始作为战地医师活跃在抗击变异者的一线...",
    "exclusiveSkill": {
      "name": "凯蒂斯专属特工技",
      "desc": "特工凯蒂斯专属战斗技巧与专属机制。",
      "evolutionName": "真·凯蒂斯绝技",
      "evolutionDesc": "凯蒂斯进阶超武进化形态，战斗能力全面觉醒。"
    },
    "synergyInfo": {
      "recommendRank": "战术特工",
      "synergyCoreCost": "A级特工专属核心",
      "role": "万能过渡"
    },
    "keyStats": {
      "damageType": "凯蒂斯专属流派",
      "targetTags": [
        "战术技能",
        "属性加成"
      ],
      "allHeroBuffs": [
        "特工专属战斗加成"
      ]
    },
    "stars": [
      {
        "star": "1星",
        "type": "personal",
        "desc": "医疗型无人机\\n释放一个具有持续治疗效果的区域",
        "isKey": false
      },
      {
        "star": "2星",
        "type": "personal",
        "desc": "2星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "3星",
        "type": "personal",
        "desc": "科技突破\\n各型号无人机可以自由组合",
        "isKey": true
      },
      {
        "star": "4星",
        "type": "personal",
        "desc": "4星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "5星",
        "type": "personal",
        "desc": "特工属性提升：{\"HeroMaxHpRate\":0.04}",
        "isKey": true
      },
      {
        "star": "6星",
        "type": "personal",
        "desc": "高等医学\\n治疗无人机的治疗效果翻倍",
        "isKey": true
      }
    ]
  },
  {
    "id": "hero_6004",
    "name": "沃尔默",
    "title": "A级特工 · 沃尔默",
    "tier": "A",
    "avatar": "/wiki/heroes/沃尔默.png",
    "tag": "A级特工 · male|shorthair",
    "description": "低调的情报商人\\n常年带着面具和变声器，极为神秘，地球卫队的档案中也没有他的详细资料，游荡在各大组织之间，靠贩卖情报为生，据说只要出得起价钱，就连月球基地的绝密档案他都能搞定",
    "exclusiveSkill": {
      "name": "沃尔默专属特工技",
      "desc": "特工沃尔默专属战斗技巧与专属机制。",
      "evolutionName": "真·沃尔默绝技",
      "evolutionDesc": "沃尔默进阶超武进化形态，战斗能力全面觉醒。"
    },
    "synergyInfo": {
      "recommendRank": "战术特工",
      "synergyCoreCost": "A级特工专属核心",
      "role": "万能过渡"
    },
    "keyStats": {
      "damageType": "沃尔默专属流派",
      "targetTags": [
        "战术技能",
        "属性加成"
      ],
      "allHeroBuffs": [
        "特工专属战斗加成"
      ]
    },
    "stars": [
      {
        "star": "1星",
        "type": "personal",
        "desc": "绝密窃听\\n勘察敌人的弱点，使其受伤增加",
        "isKey": false
      },
      {
        "star": "2星",
        "type": "personal",
        "desc": "2星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "3星",
        "type": "personal",
        "desc": "现金交易\\n大幅减少碰撞伤害，少量增加子弹伤害",
        "isKey": true
      },
      {
        "star": "4星",
        "type": "personal",
        "desc": "4星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "5星",
        "type": "personal",
        "desc": "特工属性提升：{\"HeroApRate\":0.04}",
        "isKey": true
      },
      {
        "star": "6星",
        "type": "personal",
        "desc": "策反行动\\n绝密窃听可以进阶为策反行动，累积策反值让敌人撤出战斗",
        "isKey": true
      }
    ]
  },
  {
    "id": "hero_6005",
    "name": "金",
    "title": "S级特工 · 金",
    "tier": "S",
    "avatar": "/wiki/heroes/金.png",
    "tag": "S级特工 · female|longhair",
    "description": "热爱自由、玩世不恭的御姐\\n曾隶属于某大型特工组织的王牌特工，身手十分了得\\n酷爱喝酒，从原特工组织退役后更是嗜酒如命\\n当前资料没有关于其特工生涯的具体信息，据说由于喝酒贪杯导致任务失败而被其组织开除，一直赋闲在家，被科萌调配的神秘饮料诱惑（实际上是科萌制作的高度酒精燃烧瓶），最终加入特攻小队",
    "exclusiveSkill": {
      "name": "金专属特工技",
      "desc": "特工金专属战斗技巧与专属机制。",
      "evolutionName": "真·金绝技",
      "evolutionDesc": "金进阶超武进化形态，战斗能力全面觉醒。"
    },
    "synergyInfo": {
      "recommendRank": "暴击过渡首选",
      "synergyCoreCost": "S级特工专属核心",
      "role": "万能过渡"
    },
    "keyStats": {
      "damageType": "金专属流派",
      "targetTags": [
        "暴击率+1星",
        "暴击率+3星",
        "暴击伤害+3星"
      ],
      "allHeroBuffs": [
        "特工专属战斗加成"
      ]
    },
    "stars": [
      {
        "star": "1星",
        "type": "personal",
        "desc": "特工直觉\\n每级增加8%的暴击率",
        "isKey": false
      },
      {
        "star": "2星",
        "type": "personal",
        "desc": "2星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "3星",
        "type": "personal",
        "desc": "致命感应\\n特工直觉可以进阶为致命感应，增加50%暴击率和25%暴击伤害",
        "isKey": true
      },
      {
        "star": "4星",
        "type": "personal",
        "desc": "4星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "5星",
        "type": "personal",
        "desc": "特工属性提升：{\"HeroMaxHpRate\":0.04}",
        "isKey": true
      },
      {
        "star": "6星",
        "type": "personal",
        "desc": "幸运绝杀\\n如果暴击判定失败，则会再进行一次暴击判定",
        "isKey": true
      }
    ]
  },
  {
    "id": "hero_6006",
    "name": "章鱼哥",
    "title": "S级特工 · 章鱼哥",
    "tier": "S",
    "avatar": "/wiki/heroes/章鱼哥.png",
    "tag": "S级特工 · animal|nohair",
    "description": "一直生活在比奇堡，过着平凡的生活，言辞犀利、热爱音乐\\n只会使用自己独特的武器（切换武器不能获得武器的效果，只有武器属性生效）",
    "exclusiveSkill": {
      "name": "章鱼哥专属特工技",
      "desc": "特工章鱼哥专属战斗技巧与专属机制。",
      "evolutionName": "真·章鱼哥绝技",
      "evolutionDesc": "章鱼哥进阶超武进化形态，战斗能力全面觉醒。"
    },
    "synergyInfo": {
      "recommendRank": "战术特工",
      "synergyCoreCost": "S级特工专属核心",
      "role": "万能过渡"
    },
    "keyStats": {
      "damageType": "章鱼哥专属流派",
      "targetTags": [
        "战术技能",
        "属性加成"
      ],
      "allHeroBuffs": [
        "特工专属战斗加成"
      ]
    },
    "stars": [
      {
        "star": "1星",
        "type": "personal",
        "desc": "单簧管\\n章鱼哥会吹奏乐曲攻击身边敌人",
        "isKey": false
      },
      {
        "star": "2星",
        "type": "personal",
        "desc": "2星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "3星",
        "type": "personal",
        "desc": "D小调\\n单簧管的音波攻击间隔降低40%",
        "isKey": true
      },
      {
        "star": "4星",
        "type": "personal",
        "desc": "4星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "5星",
        "type": "personal",
        "desc": "特工属性提升：{\"HeroMaxHpRate\":0.04}",
        "isKey": true
      },
      {
        "star": "6星",
        "type": "personal",
        "desc": "华丽变奏\\n致命乐章击败敌人的爆炸伤害翻倍",
        "isKey": true
      }
    ]
  },
  {
    "id": "hero_6007",
    "name": "海绵宝宝",
    "title": "S级特工 · 海绵宝宝",
    "tier": "S",
    "avatar": "/wiki/heroes/海绵宝宝.png",
    "tag": "S级特工 · animal|nohair",
    "description": "比奇堡的模范市民，积极乐观、热情善良\\n只会使用自己独特的武器（切换武器不能获得武器的效果，只有武器属性生效）",
    "exclusiveSkill": {
      "name": "海绵宝宝专属特工技",
      "desc": "特工海绵宝宝专属战斗技巧与专属机制。",
      "evolutionName": "真·海绵宝宝绝技",
      "evolutionDesc": "海绵宝宝进阶超武进化形态，战斗能力全面觉醒。"
    },
    "synergyInfo": {
      "recommendRank": "战术特工",
      "synergyCoreCost": "S级特工专属核心",
      "role": "万能过渡"
    },
    "keyStats": {
      "damageType": "海绵宝宝专属流派",
      "targetTags": [
        "战术技能",
        "属性加成"
      ],
      "allHeroBuffs": [
        "特工专属战斗加成"
      ]
    },
    "stars": [
      {
        "star": "1星",
        "type": "personal",
        "desc": "锅铲\\n海绵宝宝会使用锅铲攻击最近敌人",
        "isKey": false
      },
      {
        "star": "2星",
        "type": "personal",
        "desc": "2星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "3星",
        "type": "personal",
        "desc": "金牌厨师\\n锅铲攻击范围提升40%",
        "isKey": true
      },
      {
        "star": "4星",
        "type": "personal",
        "desc": "4星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "5星",
        "type": "personal",
        "desc": "特工属性提升：{\"HeroApRate\":0.04}",
        "isKey": true
      },
      {
        "star": "6星",
        "type": "personal",
        "desc": "高速马达\\n全自动涡轮铲的攻击间隔降低20%，伤害提高25%",
        "isKey": true
      }
    ]
  },
  {
    "id": "hero_6008",
    "name": "威彻",
    "title": "S级特工 · 威彻",
    "tier": "S",
    "avatar": "/wiki/heroes/威彻.png",
    "tag": "S级特工 · male|nohair",
    "description": "现役地球卫队士官，第五特攻小队指挥官，科萌的直属上级\\n冷静果敢、坚毅沉着的职业军人，不过偶尔稍显木讷\\n当初极力反对将金招募进第五小队，后在和金比拼酒力时醉倒，默认了金的加入（实际上是因为醉倒后睡了3天，错过了评审会）\\n在金加入后，逼着第五小队所有人发誓不会将醉倒的事说出去，否则集体关禁闭",
    "exclusiveSkill": {
      "name": "威彻专属特工技",
      "desc": "特工威彻专属战斗技巧与专属机制。",
      "evolutionName": "真·威彻绝技",
      "evolutionDesc": "威彻进阶超武进化形态，战斗能力全面觉醒。"
    },
    "synergyInfo": {
      "recommendRank": "战术特工",
      "synergyCoreCost": "S级特工专属核心",
      "role": "万能过渡"
    },
    "keyStats": {
      "damageType": "威彻专属流派",
      "targetTags": [
        "战术技能",
        "属性加成"
      ],
      "allHeroBuffs": [
        "特工专属战斗加成"
      ]
    },
    "stars": [
      {
        "star": "1星",
        "type": "personal",
        "desc": "电磁手雷\\n使用高科技电磁手雷攻击敌人",
        "isKey": false
      },
      {
        "star": "2星",
        "type": "personal",
        "desc": "2星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "3星",
        "type": "personal",
        "desc": "教官福利\\n投掷手雷时，有概率会获得来自基地的支援",
        "isKey": true
      },
      {
        "star": "4星",
        "type": "personal",
        "desc": "4星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "5星",
        "type": "personal",
        "desc": "特工属性提升：{\"HeroApRate\":0.04}",
        "isKey": true
      },
      {
        "star": "6星",
        "type": "personal",
        "desc": "电磁结界\\n教官之怒的同时会生成一个电磁结界，结界可以阻挡敌人进攻",
        "isKey": true
      }
    ]
  },
  {
    "id": "hero_6009",
    "name": "艾琳娜",
    "title": "S级特工 · 艾琳娜",
    "tier": "S",
    "avatar": "/wiki/heroes/艾琳娜.png",
    "tag": "S级特工 · female|shorthair",
    "description": "艾琳娜是一位天才级的黑客，她在网络世界中游刃有余，并且对系统入侵和数据盗取技术精通。在终局之战中为破译实验室大门做出了巨大贡献，同时依靠自己的高智商将随身武器设计的无懈可击。",
    "exclusiveSkill": {
      "name": "艾琳娜专属特工技",
      "desc": "特工艾琳娜专属战斗技巧与专属机制。",
      "evolutionName": "真·艾琳娜绝技",
      "evolutionDesc": "艾琳娜进阶超武进化形态，战斗能力全面觉醒。"
    },
    "synergyInfo": {
      "recommendRank": "战术特工",
      "synergyCoreCost": "S级特工专属核心",
      "role": "万能过渡"
    },
    "keyStats": {
      "damageType": "艾琳娜专属流派",
      "targetTags": [
        "战术技能",
        "属性加成"
      ],
      "allHeroBuffs": [
        "特工专属战斗加成"
      ]
    },
    "stars": [
      {
        "star": "1星",
        "type": "personal",
        "desc": "自动手枪\\n艾琳娜通过自己高端的黑客技术开发的全能武器",
        "isKey": false
      },
      {
        "star": "2星",
        "type": "personal",
        "desc": "2星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "3星",
        "type": "personal",
        "desc": "投影加速\\n投影状态下移速+5",
        "isKey": true
      },
      {
        "star": "4星",
        "type": "personal",
        "desc": "4星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "5星",
        "type": "personal",
        "desc": "特工属性提升：{\"HeroMaxHpRate\":0.04}",
        "isKey": true
      },
      {
        "star": "6星",
        "type": "personal",
        "desc": "投影强化\\n暴击可以延续全息投影时间单次最多延续到6秒",
        "isKey": true
      }
    ]
  },
  {
    "id": "hero_6010",
    "name": "杨大师",
    "title": "S级特工 · 杨大师",
    "tier": "S",
    "avatar": "/wiki/heroes/杨大师.png",
    "tag": "S级特工 · animal|nohair",
    "description": "杨大师，特工小队中最神秘的教官，以正义和勇气为准则，将阴阳形态的转换用于保护和拯救幸存者\\n作为备受尊敬的守护者和智者，在末世中，通过系统的武术训练，教授队员们阳形态下的快速攻击技巧和阴形态下的灵活防御策略。",
    "exclusiveSkill": {
      "name": "杨大师专属特工技",
      "desc": "特工杨大师专属战斗技巧与专属机制。",
      "evolutionName": "真·杨大师绝技",
      "evolutionDesc": "杨大师进阶超武进化形态，战斗能力全面觉醒。"
    },
    "synergyInfo": {
      "recommendRank": "844/840 顶级输出与挂毒核心",
      "synergyCoreCost": "S级特工专属核心",
      "role": "主输出 (中)"
    },
    "keyStats": {
      "damageType": "杨大师专属流派",
      "targetTags": [
        "独立易伤",
        "暴击伤害+6星"
      ],
      "allHeroBuffs": [
        "特工专属战斗加成"
      ]
    },
    "stars": [
      {
        "star": "1星",
        "type": "personal",
        "desc": "阴阳平衡\\n杨大师可在战斗中通过调整阴阳的状态使用不同的技能",
        "isKey": false
      },
      {
        "star": "2星",
        "type": "personal",
        "desc": "2星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "3星",
        "type": "personal",
        "desc": "心平气和\\n纯阳真气爆炸后会生成可以阻挡怪物移动的真气气旋，受到气旋影响的敌人增加50%易伤",
        "isKey": true
      },
      {
        "star": "4星",
        "type": "personal",
        "desc": "4星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "5星",
        "type": "personal",
        "desc": "特工属性提升：{\"HeroApRate\":0.08}",
        "isKey": true
      },
      {
        "star": "6星",
        "type": "personal",
        "desc": "怒火中烧\\n烈阳掌暴击伤害提高100%",
        "isKey": true
      }
    ]
  },
  {
    "id": "hero_6011",
    "name": "派大星",
    "title": "S级特工 · 派大星",
    "tier": "S",
    "avatar": "/wiki/heroes/派大星.png",
    "tag": "S级特工 · animal|nohair",
    "description": "海绵宝宝最好的好朋友\\n只会使用自己独特的武器（切换武器不能获得武器的效果，只有武器属性生效）",
    "exclusiveSkill": {
      "name": "派大星专属特工技",
      "desc": "特工派大星专属战斗技巧与专属机制。",
      "evolutionName": "真·派大星绝技",
      "evolutionDesc": "派大星进阶超武进化形态，战斗能力全面觉醒。"
    },
    "synergyInfo": {
      "recommendRank": "战术特工",
      "synergyCoreCost": "S级特工专属核心",
      "role": "万能过渡"
    },
    "keyStats": {
      "damageType": "派大星专属流派",
      "targetTags": [
        "战术技能",
        "属性加成"
      ],
      "allHeroBuffs": [
        "特工专属战斗加成"
      ]
    },
    "stars": [
      {
        "star": "1星",
        "type": "personal",
        "desc": "海星拳\\n（专属武器）派大星会使用拳头攻击朝向的敌人，可以进阶为海星空手道",
        "isKey": false
      },
      {
        "star": "2星",
        "type": "personal",
        "desc": "2星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "3星",
        "type": "personal",
        "desc": "快速挥拳\\n挥拳范围增加40%",
        "isKey": true
      },
      {
        "star": "4星",
        "type": "personal",
        "desc": "4星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "5星",
        "type": "personal",
        "desc": "特工属性提升：{\"HeroApRate\":0.04}",
        "isKey": true
      },
      {
        "star": "6星",
        "type": "personal",
        "desc": "天赋爆发\\n海星空手道攻击间隔降低20%，伤害提高25%",
        "isKey": true
      }
    ]
  },
  {
    "id": "hero_6012",
    "name": "珊迪",
    "title": "S级特工 · 珊迪",
    "tier": "S",
    "avatar": "/wiki/heroes/珊迪.png",
    "tag": "S级特工 · animal|nohair",
    "description": "一只伟大的松鼠，也是一个专业牛仔\\n只会使用自己独特的武器（切换武器不能获得武器的效果，只有武器属性生效）",
    "exclusiveSkill": {
      "name": "珊迪专属特工技",
      "desc": "特工珊迪专属战斗技巧与专属机制。",
      "evolutionName": "真·珊迪绝技",
      "evolutionDesc": "珊迪进阶超武进化形态，战斗能力全面觉醒。"
    },
    "synergyInfo": {
      "recommendRank": "战术特工",
      "synergyCoreCost": "S级特工专属核心",
      "role": "万能过渡"
    },
    "keyStats": {
      "damageType": "珊迪专属流派",
      "targetTags": [
        "战术技能",
        "属性加成"
      ],
      "allHeroBuffs": [
        "特工专属战斗加成"
      ]
    },
    "stars": [
      {
        "star": "1星",
        "type": "personal",
        "desc": "飞绳坚果\\n（专属武器）珊迪会挥舞飞绳坚果攻击一圈敌人，坚果可以进阶为无敌泡泡",
        "isKey": false
      },
      {
        "star": "2星",
        "type": "personal",
        "desc": "2星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "3星",
        "type": "personal",
        "desc": "超强臂力\\n飞绳坚果攻击范围提升25%",
        "isKey": true
      },
      {
        "star": "4星",
        "type": "personal",
        "desc": "4星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "5星",
        "type": "personal",
        "desc": "特工属性提升：{\"HeroMaxHpRate\":0.04}",
        "isKey": true
      },
      {
        "star": "6星",
        "type": "personal",
        "desc": "加速泡泡\\n无敌泡泡的转速提高20%，伤害提高25%",
        "isKey": true
      }
    ]
  },
  {
    "id": "hero_6013",
    "name": "凛音",
    "title": "S级特工 · 凛音",
    "tier": "S",
    "avatar": "/wiki/heroes/凛音.png",
    "tag": "S级特工 · female|longhair",
    "description": "红凤凰乐队主唱，活力四射，心直口快的摇滚乐手。\\n大灾变后不知为何她的音乐中产生了能够影响真实的神秘力量，因此被沃尔默发掘上报，成为防卫队的一员，经杨大师指导，逐渐发挥出音乐增幅之力；\\n眼神乍看有些冷酷，实则是作为科萌的爱豆，面对粉丝时故意表现出来的。",
    "exclusiveSkill": {
      "name": "凛音专属特工技",
      "desc": "特工凛音专属战斗技巧与专属机制。",
      "evolutionName": "真·凛音绝技",
      "evolutionDesc": "凛音进阶超武进化形态，战斗能力全面觉醒。"
    },
    "synergyInfo": {
      "recommendRank": "741/840 协同副C",
      "synergyCoreCost": "S级特工专属核心",
      "role": "协同辅助 (左/右)"
    },
    "keyStats": {
      "damageType": "凛音专属流派",
      "targetTags": [
        "战术技能",
        "属性加成"
      ],
      "allHeroBuffs": [
        "特工专属战斗加成"
      ]
    },
    "stars": [
      {
        "star": "1星",
        "type": "personal",
        "desc": "和声之力\\n（局内选择）攻击衰弱目标时可以回复能量护盾，对中毒和冰缓目标伤害加深",
        "isKey": false
      },
      {
        "star": "2星",
        "type": "personal",
        "desc": "2星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "3星",
        "type": "personal",
        "desc": "毁灭之声\\n三音演奏所附带的异常效果时间+5秒，和声之力对中毒和冰缓目标伤害大幅提升",
        "isKey": true
      },
      {
        "star": "4星",
        "type": "personal",
        "desc": "4星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "5星",
        "type": "personal",
        "desc": "特工属性提升：{\"HeroApRate\":0.08}",
        "isKey": true
      },
      {
        "star": "6星",
        "type": "personal",
        "desc": "余音不绝\\n三音演奏所附带的异常效果时间+15秒",
        "isKey": true
      }
    ]
  },
  {
    "id": "hero_6014",
    "name": "莱昂纳多",
    "title": "S级特工 · 莱昂纳多",
    "tier": "S",
    "avatar": "/wiki/heroes/莱昂纳多.png",
    "tag": "S级特工 · animal|nohair",
    "description": "富有领导才能的忍者神龟\\n只会使用自己独特的武器（切换武器不能获得武器的效果，只有武器属性生效）",
    "exclusiveSkill": {
      "name": "莱昂纳多专属特工技",
      "desc": "特工莱昂纳多专属战斗技巧与专属机制。",
      "evolutionName": "真·莱昂纳多绝技",
      "evolutionDesc": "莱昂纳多进阶超武进化形态，战斗能力全面觉醒。"
    },
    "synergyInfo": {
      "recommendRank": "战术特工",
      "synergyCoreCost": "S级特工专属核心",
      "role": "万能过渡"
    },
    "keyStats": {
      "damageType": "莱昂纳多专属流派",
      "targetTags": [
        "战术技能",
        "属性加成"
      ],
      "allHeroBuffs": [
        "特工专属战斗加成"
      ]
    },
    "stars": [
      {
        "star": "1星",
        "type": "personal",
        "desc": "疾风双刀\\n（专属武器）莱昂纳多使用双刀进行长短两次攻击，可以进阶为圆月斩击（不可响应月咏觉醒被动技能刀匠的增幅）",
        "isKey": false
      },
      {
        "star": "2星",
        "type": "personal",
        "desc": "2星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "3星",
        "type": "personal",
        "desc": "破空连斩\\n追加长短攻击次数",
        "isKey": true
      },
      {
        "star": "4星",
        "type": "personal",
        "desc": "4星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "5星",
        "type": "personal",
        "desc": "特工属性提升：{\"CritProb\":8}",
        "isKey": true
      },
      {
        "star": "6星",
        "type": "personal",
        "desc": "奥义突破\\n圆月斩击突破，追加攻击",
        "isKey": true
      }
    ]
  },
  {
    "id": "hero_6015",
    "name": "拉斐尔",
    "title": "S级特工 · 拉斐尔",
    "tier": "S",
    "avatar": "/wiki/heroes/拉斐尔.png",
    "tag": "S级特工 · animal|nohair",
    "description": "心地善良、乐于助人的忍者神龟\\n只会使用自己独特的武器（切换武器不能获得武器的效果，只有武器属性生效）",
    "exclusiveSkill": {
      "name": "拉斐尔专属特工技",
      "desc": "特工拉斐尔专属战斗技巧与专属机制。",
      "evolutionName": "真·拉斐尔绝技",
      "evolutionDesc": "拉斐尔进阶超武进化形态，战斗能力全面觉醒。"
    },
    "synergyInfo": {
      "recommendRank": "战术特工",
      "synergyCoreCost": "S级特工专属核心",
      "role": "万能过渡"
    },
    "keyStats": {
      "damageType": "拉斐尔专属流派",
      "targetTags": [
        "战术技能",
        "属性加成"
      ],
      "allHeroBuffs": [
        "特工专属战斗加成"
      ]
    },
    "stars": [
      {
        "star": "1星",
        "type": "personal",
        "desc": "铁尺\\n（专属武器）拉斐尔投掷两把铁尺攻击敌人，可以进阶为暴怒铁尺",
        "isKey": false
      },
      {
        "star": "2星",
        "type": "personal",
        "desc": "2星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "3星",
        "type": "personal",
        "desc": "奋力一击\\n每攻击5次，额外投掷一发巨大铁尺，攻击附带流血效果",
        "isKey": true
      },
      {
        "star": "4星",
        "type": "personal",
        "desc": "4星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "5星",
        "type": "personal",
        "desc": "特工属性提升：{\"CritProb\":8}",
        "isKey": true
      },
      {
        "star": "6星",
        "type": "personal",
        "desc": "暴躁脾气\\n铁尺、暴怒铁尺伤害增加70%",
        "isKey": true
      }
    ]
  },
  {
    "id": "hero_6016",
    "name": "爱普莉尔",
    "title": "S级特工 · 爱普莉尔",
    "tier": "S",
    "avatar": "/wiki/heroes/爱普莉尔.png",
    "tag": "S级特工 · female|longhair",
    "description": "一名干练的女记者，忍者神龟们的好友\\n只会使用自己独特的武器（切换武器不能获得武器的效果，只有武器属性生效）",
    "exclusiveSkill": {
      "name": "爱普莉尔专属特工技",
      "desc": "特工爱普莉尔专属战斗技巧与专属机制。",
      "evolutionName": "真·爱普莉尔绝技",
      "evolutionDesc": "爱普莉尔进阶超武进化形态，战斗能力全面觉醒。"
    },
    "synergyInfo": {
      "recommendRank": "战术特工",
      "synergyCoreCost": "S级特工专属核心",
      "role": "万能过渡"
    },
    "keyStats": {
      "damageType": "爱普莉尔专属流派",
      "targetTags": [
        "战术技能",
        "属性加成"
      ],
      "allHeroBuffs": [
        "特工专属战斗加成"
      ]
    },
    "stars": [
      {
        "star": "1星",
        "type": "personal",
        "desc": "麦克风\\n（专属武器）爱普莉尔使用话筒发出声波球攻击敌人，可以进阶为超声波球",
        "isKey": false
      },
      {
        "star": "2星",
        "type": "personal",
        "desc": "2星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "3星",
        "type": "personal",
        "desc": "音量加大\\n声波球伤害提升30%",
        "isKey": true
      },
      {
        "star": "4星",
        "type": "personal",
        "desc": "4星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "5星",
        "type": "personal",
        "desc": "特工属性提升：{\"CritProb\":8}",
        "isKey": true
      },
      {
        "star": "6星",
        "type": "personal",
        "desc": "音爆\\n超声波球命中敌人会造成小范围爆炸",
        "isKey": true
      }
    ]
  },
  {
    "id": "hero_6017",
    "name": "多纳泰罗",
    "title": "S级特工 · 多纳泰罗",
    "tier": "S",
    "avatar": "/wiki/heroes/多纳泰罗.png",
    "tag": "S级特工 · animal|nohair",
    "description": "冷静机智的忍者神龟\\n只会使用自己独特的武器（切换武器不能获得武器的效果，只有武器属性生效）",
    "exclusiveSkill": {
      "name": "多纳泰罗专属特工技",
      "desc": "特工多纳泰罗专属战斗技巧与专属机制。",
      "evolutionName": "真·多纳泰罗绝技",
      "evolutionDesc": "多纳泰罗进阶超武进化形态，战斗能力全面觉醒。"
    },
    "synergyInfo": {
      "recommendRank": "战术特工",
      "synergyCoreCost": "S级特工专属核心",
      "role": "万能过渡"
    },
    "keyStats": {
      "damageType": "多纳泰罗专属流派",
      "targetTags": [
        "战术技能",
        "属性加成"
      ],
      "allHeroBuffs": [
        "特工专属战斗加成"
      ]
    },
    "stars": [
      {
        "star": "1星",
        "type": "personal",
        "desc": "追击长棍\\n（专属武器）多纳泰罗转动长棍攻击敌人，可以进阶为迅猛长棍",
        "isKey": false
      },
      {
        "star": "2星",
        "type": "personal",
        "desc": "2星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "3星",
        "type": "personal",
        "desc": "超级横扫\\n追击长棍、迅猛长棍伤害增加30%",
        "isKey": true
      },
      {
        "star": "4星",
        "type": "personal",
        "desc": "4星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "5星",
        "type": "personal",
        "desc": "特工属性提升：{\"CritProb\":8}",
        "isKey": true
      },
      {
        "star": "6星",
        "type": "personal",
        "desc": "重棍出击\\n追击长棍、迅猛长棍增加攻击范围，伤害增加30%",
        "isKey": true
      }
    ]
  },
  {
    "id": "hero_6018",
    "name": "米开朗基罗",
    "title": "S级特工 · 米开朗基罗",
    "tier": "S",
    "avatar": "/wiki/heroes/米开朗基罗.png",
    "tag": "S级特工 · animal|nohair",
    "description": "活泼开朗的忍者神龟\\n只会使用自己独特的武器（切换武器不能获得武器的效果，只有武器属性生效）",
    "exclusiveSkill": {
      "name": "米开朗基罗专属特工技",
      "desc": "特工米开朗基罗专属战斗技巧与专属机制。",
      "evolutionName": "真·米开朗基罗绝技",
      "evolutionDesc": "米开朗基罗进阶超武进化形态，战斗能力全面觉醒。"
    },
    "synergyInfo": {
      "recommendRank": "战术特工",
      "synergyCoreCost": "S级特工专属核心",
      "role": "万能过渡"
    },
    "keyStats": {
      "damageType": "米开朗基罗专属流派",
      "targetTags": [
        "战术技能",
        "属性加成"
      ],
      "allHeroBuffs": [
        "特工专属战斗加成"
      ]
    },
    "stars": [
      {
        "star": "1星",
        "type": "personal",
        "desc": "弧光双节棍\\n（专属武器）米开朗基罗甩动双节棍，并发射旋风攻击敌人，可以进阶为逐风双节棍",
        "isKey": false
      },
      {
        "star": "2星",
        "type": "personal",
        "desc": "2星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "3星",
        "type": "personal",
        "desc": "狂乱龙卷\\n弧光双节棍、逐风双节棍的旋风伤害增加50%；增加旋风范围",
        "isKey": true
      },
      {
        "star": "4星",
        "type": "personal",
        "desc": "4星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "5星",
        "type": "personal",
        "desc": "特工属性提升：{\"CritProb\":8}",
        "isKey": true
      },
      {
        "star": "6星",
        "type": "personal",
        "desc": "末日龙卷\\n弧光双节棍、逐风双节棍的旋风伤害增加50%；旋风附带流血效果",
        "isKey": true
      }
    ]
  },
  {
    "id": "hero_6019",
    "name": "斯普林特",
    "title": "S级特工 · 斯普林特",
    "tier": "S",
    "avatar": "/wiki/heroes/斯普林特.png",
    "tag": "S级特工 · animal|nohair",
    "description": "教导神龟们的师傅\\n只会使用自己独特的武器（切换武器不能获得武器的效果，只有武器属性生效）",
    "exclusiveSkill": {
      "name": "斯普林特专属特工技",
      "desc": "特工斯普林特专属战斗技巧与专属机制。",
      "evolutionName": "真·斯普林特绝技",
      "evolutionDesc": "斯普林特进阶超武进化形态，战斗能力全面觉醒。"
    },
    "synergyInfo": {
      "recommendRank": "战术特工",
      "synergyCoreCost": "S级特工专属核心",
      "role": "万能过渡"
    },
    "keyStats": {
      "damageType": "斯普林特专属流派",
      "targetTags": [
        "战术技能",
        "属性加成"
      ],
      "allHeroBuffs": [
        "特工专属战斗加成"
      ]
    },
    "stars": [
      {
        "star": "1星",
        "type": "personal",
        "desc": "秘术冲击\\n（专属武器）斯普林特挥动手杖，发射冲击波攻击敌人，可以进阶为秘术融合",
        "isKey": false
      },
      {
        "star": "2星",
        "type": "personal",
        "desc": "2星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "3星",
        "type": "personal",
        "desc": "碎骨冲击\\n秘术冲击、秘术融合冲击波伤害提升30%，并附带减速效果",
        "isKey": true
      },
      {
        "star": "4星",
        "type": "personal",
        "desc": "4星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "5星",
        "type": "personal",
        "desc": "特工属性提升：{\"CritProb\":8}",
        "isKey": true
      },
      {
        "star": "6星",
        "type": "personal",
        "desc": "致命冲击\\n秘术冲击、秘术融合冲击波伤害提升30%，进一步强化减速效果",
        "isKey": true
      }
    ]
  },
  {
    "id": "hero_6020",
    "name": "乔伊",
    "title": "S级特工 · 乔伊",
    "tier": "S",
    "avatar": "/wiki/heroes/乔伊.png",
    "tag": "S级特工 · male|longhair",
    "description": "乔森家族最后的幸存者，是一名广受尊敬的拳师，擅长观察敌人弱点并给与致命一击\\n乔伊以拳头和护甲的默契配合闻名，战场上是敌人无法逾越的屏障。然而，他性格内向，常被同伴凛音调侃为“沉默的拳头”。与科萌的关系十分密切，钢熊的多次改装都饱含科萌的“个人恶趣味”，这让乔伊哭笑不得，却默默接受，因为“只要能保护",
    "exclusiveSkill": {
      "name": "乔伊专属特工技",
      "desc": "特工乔伊专属战斗技巧与专属机制。",
      "evolutionName": "真·乔伊绝技",
      "evolutionDesc": "乔伊进阶超武进化形态，战斗能力全面觉醒。"
    },
    "synergyInfo": {
      "recommendRank": "543 协同核心",
      "synergyCoreCost": "S级特工专属核心",
      "role": "协同辅助 (左/右)"
    },
    "keyStats": {
      "damageType": "乔伊专属流派",
      "targetTags": [
        "战术技能",
        "属性加成"
      ],
      "allHeroBuffs": [
        "特工专属战斗加成"
      ]
    },
    "stars": [
      {
        "star": "1星",
        "type": "personal",
        "desc": "决斗\\n乔伊可以看到Boss和精英敌人的弱点，攻击弱点可造成更高伤害并附加易损效果",
        "isKey": false
      },
      {
        "star": "2星",
        "type": "personal",
        "desc": "2星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "3星",
        "type": "personal",
        "desc": "重创\\n易损效果持续时间增加",
        "isKey": true
      },
      {
        "star": "4星",
        "type": "personal",
        "desc": "4星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "5星",
        "type": "personal",
        "desc": "特工属性提升：{\"HeroApRate\":0.08}",
        "isKey": true
      },
      {
        "star": "6星",
        "type": "personal",
        "desc": "重击软肋\\n弱点伤害增加",
        "isKey": true
      }
    ]
  },
  {
    "id": "hero_6021",
    "name": "塔洛西娅",
    "title": "S级特工 · 塔洛西娅",
    "tier": "S",
    "avatar": "/wiki/heroes/塔洛西娅.png",
    "tag": "S级特工 · female|nohair",
    "description": "在月球基地地底深处，科萌误触休眠舱所唤醒的神秘机械生命体。拥有独立自主的思维模块，却没有休眠前的记忆资料，自称为塔洛西娅，可变身为强大的机甲作战。\\n因科萌是她苏醒后的首个接触者，似乎认定了科萌为自己的指挥官，常伴随其执行任务。关于她制造来源的秘密，仍在探索之中。",
    "exclusiveSkill": {
      "name": "塔洛西娅专属特工技",
      "desc": "特工塔洛西娅专属战斗技巧与专属机制。",
      "evolutionName": "真·塔洛西娅绝技",
      "evolutionDesc": "塔洛西娅进阶超武进化形态，战斗能力全面觉醒。"
    },
    "synergyInfo": {
      "recommendRank": "战术特工",
      "synergyCoreCost": "S级特工专属核心",
      "role": "万能过渡"
    },
    "keyStats": {
      "damageType": "塔洛西娅专属流派",
      "targetTags": [
        "战术技能",
        "属性加成"
      ],
      "allHeroBuffs": [
        "特工专属战斗加成"
      ]
    },
    "stars": [
      {
        "star": "1星",
        "type": "personal",
        "desc": "火力武装\\n额外获得专属武器技能，专属武器命中时附加5秒裂伤效果，机甲状态下切换武器技能",
        "isKey": false
      },
      {
        "star": "2星",
        "type": "personal",
        "desc": "2星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "3星",
        "type": "personal",
        "desc": "转化\\n释放技能额外获得50%同步率，超载模式持续时间+5秒，对裂伤目标伤害+15%",
        "isKey": true
      },
      {
        "star": "4星",
        "type": "personal",
        "desc": "4星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "5星",
        "type": "personal",
        "desc": "特工属性提升：{\"HeroApRate\":0.08}",
        "isKey": true
      },
      {
        "star": "6星",
        "type": "personal",
        "desc": "超载\\n专属武器初始等级提高，超载模式下伤害额外+20%，对裂伤目标伤害+15%",
        "isKey": true
      }
    ]
  },
  {
    "id": "hero_6022",
    "name": "维托尔",
    "title": "S级特工 · 维托尔",
    "tier": "S",
    "avatar": "/wiki/heroes/维托尔.png",
    "tag": "S级特工 · male|longhair",
    "description": "经验丰富的怪物猎人，在大灾变后很长一段时间独自与怪物对抗，磨炼了强大的战斗技巧\\n在一次行动中感染了E细胞却没有失去理智，觉醒了操控血液的异能与强悍肉体\\n凯蒂斯对其体内的E细胞很感兴趣，经常与他接触。背后似乎有传言他喜欢猫咪",
    "exclusiveSkill": {
      "name": "维托尔专属特工技",
      "desc": "特工维托尔专属战斗技巧与专属机制。",
      "evolutionName": "真·维托尔绝技",
      "evolutionDesc": "维托尔进阶超武进化形态，战斗能力全面觉醒。"
    },
    "synergyInfo": {
      "recommendRank": "543 协同副C",
      "synergyCoreCost": "S级特工专属核心",
      "role": "协同辅助 (左/右)"
    },
    "keyStats": {
      "damageType": "维托尔专属流派",
      "targetTags": [
        "战术技能",
        "属性加成"
      ],
      "allHeroBuffs": [
        "特工专属战斗加成"
      ]
    },
    "stars": [
      {
        "star": "1星",
        "type": "personal",
        "desc": "肾上腺素\\n（局内选择）每次失去生命值时，一定时间内伤害增加（不可叠加）",
        "isKey": false
      },
      {
        "star": "2星",
        "type": "personal",
        "desc": "2星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "3星",
        "type": "personal",
        "desc": "亢奋\\n肾上腺素的伤害增加效果提高，持续时间+5秒",
        "isKey": true
      },
      {
        "star": "4星",
        "type": "personal",
        "desc": "4星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "5星",
        "type": "personal",
        "desc": "特工属性提升：{\"HeroApRate\":0.08}",
        "isKey": true
      },
      {
        "star": "6星",
        "type": "personal",
        "desc": "固若金汤\\n血契期间每秒固定获得百分比生命值的护盾值；对精英/BOSS敌人伤害提高",
        "isKey": true
      }
    ]
  },
  {
    "id": "hero_6023",
    "name": "哪吒",
    "title": "SP级特工 · 哪吒",
    "tier": "SP",
    "avatar": "/wiki/heroes/哪吒.png",
    "tag": "SP级特工 · male|longhair",
    "description": "心地不坏、脾气暴躁的混世魔童\\n拥有专属神兵法宝，脚踩风火轮后势不可挡",
    "exclusiveSkill": {
      "name": "哪吒专属特工技",
      "desc": "特工哪吒专属战斗技巧与专属机制。",
      "evolutionName": "真·哪吒绝技",
      "evolutionDesc": "哪吒进阶超武进化形态，战斗能力全面觉醒。"
    },
    "synergyInfo": {
      "recommendRank": "SP顶级主C (神火爆发)",
      "synergyCoreCost": "SP级特工专属核心",
      "role": "主输出 (中)"
    },
    "keyStats": {
      "damageType": "哪吒专属流派",
      "targetTags": [
        "战术技能",
        "属性加成"
      ],
      "allHeroBuffs": [
        "特工专属战斗加成"
      ]
    },
    "stars": [
      {
        "star": "1星",
        "type": "personal",
        "desc": "乾坤圈·混天绫\\n哪吒使用乾坤圈和混天绫进行攻击，可以进阶为混天乾坤阵",
        "isKey": false
      },
      {
        "star": "2星",
        "type": "personal",
        "desc": "2星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "3星",
        "type": "personal",
        "desc": "三头六臂\\n额外获得一个武器技能栏",
        "isKey": true
      },
      {
        "star": "4星",
        "type": "personal",
        "desc": "4星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "5星",
        "type": "personal",
        "desc": "特工属性提升：{\"CritProb\":8}",
        "isKey": true
      },
      {
        "star": "6星",
        "type": "personal",
        "desc": "法宝神通\\n乾坤圈和混天绫初始等级提升，乾坤圈和混天绫伤害增加",
        "isKey": true
      }
    ]
  },
  {
    "id": "hero_6024",
    "name": "伏尔甘",
    "title": "SP级特工 · 伏尔甘",
    "tier": "SP",
    "avatar": "/wiki/heroes/伏尔甘.png",
    "tag": "SP级特工 · female|longhair",
    "description": "奥林匹斯首席锻造师\\n淬炼武器时引发火山爆发，以炽热神火洗礼一切敌人",
    "exclusiveSkill": {
      "name": "伏尔甘专属特工技",
      "desc": "特工伏尔甘专属战斗技巧与专属机制。",
      "evolutionName": "真·伏尔甘绝技",
      "evolutionDesc": "伏尔甘进阶超武进化形态，战斗能力全面觉醒。"
    },
    "synergyInfo": {
      "recommendRank": "SP顶级主C / 全体暴击辅助",
      "synergyCoreCost": "SP级特工专属核心",
      "role": "主输出 (中)"
    },
    "keyStats": {
      "damageType": "伏尔甘专属流派",
      "targetTags": [
        "战术技能",
        "属性加成"
      ],
      "allHeroBuffs": [
        "特工专属战斗加成"
      ]
    },
    "stars": [
      {
        "star": "1星",
        "type": "personal",
        "desc": "火神之锤\\n伏尔甘使用火神之锤进行攻击，可以进阶为火神巨锤",
        "isKey": false
      },
      {
        "star": "2星",
        "type": "personal",
        "desc": "2星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "3星",
        "type": "personal",
        "desc": "万钧之力\\n火神之锤与火神巨锤伤害增加",
        "isKey": true
      },
      {
        "star": "4星",
        "type": "personal",
        "desc": "4星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "5星",
        "type": "personal",
        "desc": "特工属性提升：{\"CritProb\":8}",
        "isKey": true
      },
      {
        "star": "6星",
        "type": "personal",
        "desc": "熔岩打击\\n火神巨锤每挥动5次，附带一次熔岩打击，并附加神火效果",
        "isKey": true
      }
    ]
  },
  {
    "id": "hero_6025",
    "name": "洛基",
    "title": "SP级特工 · 洛基",
    "tier": "SP",
    "avatar": "/wiki/heroes/洛基.png",
    "tag": "SP级特工 · male|nohair",
    "description": "诡计多端的恶作剧之神\\n统帅邪恶又强力的眷属军团，在玩弄与折磨中将敌人蚕食殆尽",
    "exclusiveSkill": {
      "name": "洛基专属特工技",
      "desc": "特工洛基专属战斗技巧与专属机制。",
      "evolutionName": "真·洛基绝技",
      "evolutionDesc": "洛基进阶超武进化形态，战斗能力全面觉醒。"
    },
    "synergyInfo": {
      "recommendRank": "SP控制召唤主C",
      "synergyCoreCost": "SP级特工专属核心",
      "role": "主输出 (中)"
    },
    "keyStats": {
      "damageType": "洛基专属流派",
      "targetTags": [
        "战术技能",
        "属性加成"
      ],
      "allHeroBuffs": [
        "特工专属战斗加成"
      ]
    },
    "stars": [
      {
        "star": "1星",
        "type": "personal",
        "desc": "诡计戏法\\n（局内选择）首领的异常状态越多，受到的伤害越高",
        "isKey": false
      },
      {
        "star": "2星",
        "type": "personal",
        "desc": "2星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "3星",
        "type": "personal",
        "desc": "恶意\\n焚世之火命中首领单位时召唤随机眷属攻击，附加异常状态；对中毒目标伤害提高，对衰弱目标伤害提高",
        "isKey": true
      },
      {
        "star": "4星",
        "type": "personal",
        "desc": "4星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "5星",
        "type": "personal",
        "desc": "特工属性提升：{\"CritProb\":8}",
        "isKey": true
      },
      {
        "star": "6星",
        "type": "personal",
        "desc": "狡黠\\n诡计戏法的初始等级提高；对冰缓目标伤害提高，对裂伤目标伤害提高",
        "isKey": true
      }
    ]
  },
  {
    "id": "hero_6027",
    "name": "伊狑",
    "title": "SP级特工 · 伊狑",
    "tier": "SP",
    "avatar": "/wiki/heroes/伊狑.png",
    "tag": "SP级特工 · female|longhair",
    "description": "狂战士计划中同时植入E细胞与狼基因的融合实验体，实验代号10。凯蒂斯帮助她训练控制体内的兽灵能量，并取名伊狑\\n能够在“兽灵形态”与“共鸣形态”之间切换，与动物建立战术共鸣，保持人类理智的同时，利用野兽本能协同作战",
    "exclusiveSkill": {
      "name": "伊狑专属特工技",
      "desc": "特工伊狑专属战斗技巧与专属机制。",
      "evolutionName": "真·伊狑绝技",
      "evolutionDesc": "伊狑进阶超武进化形态，战斗能力全面觉醒。"
    },
    "synergyInfo": {
      "recommendRank": "SP顶级主C (全图穿透)",
      "synergyCoreCost": "SP级特工专属核心",
      "role": "主输出 (中)"
    },
    "keyStats": {
      "damageType": "伊狑专属流派",
      "targetTags": [
        "战术技能",
        "属性加成"
      ],
      "allHeroBuffs": [
        "特工专属战斗加成"
      ]
    },
    "stars": [
      {
        "star": "1星",
        "type": "personal",
        "desc": "野性感知\\n（局内选择）异宠共鸣增伤效果提高",
        "isKey": false
      },
      {
        "star": "2星",
        "type": "personal",
        "desc": "2星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "3星",
        "type": "personal",
        "desc": "狩猎本能\\n每次切换形态时释放一次狼爪攻击",
        "isKey": true
      },
      {
        "star": "4星",
        "type": "personal",
        "desc": "4星战斗潜能激活",
        "isKey": false
      },
      {
        "star": "5星",
        "type": "personal",
        "desc": "特工属性提升：{\"HeroApRate\":0.08}",
        "isKey": true
      },
      {
        "star": "6星",
        "type": "personal",
        "desc": "追猎\\n释放狼爪后额外再释放一次狼爪攻击",
        "isKey": true
      }
    ]
  }
];
