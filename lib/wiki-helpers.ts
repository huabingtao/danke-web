import { LOCAL_WIKI_ENTRIES, WikiEntryItem } from './local-wiki-data';

export type AgentClassType = 'SP' | 'S' | '普通';

const LOCAL_COLLECTIBLE_MAP = new Map<string, WikiEntryItem>(
  LOCAL_WIKI_ENTRIES.filter((e) => e.category === 'COLLECTIBLE').map((e) => [
    e.name,
    e,
  ]),
);

const LOCAL_MOUNT_MAP = new Map<string, WikiEntryItem>(
  LOCAL_WIKI_ENTRIES.filter((e) => e.category === 'MOUNT').flatMap((e) => [
    [e.name, e],
    ['幽焰逐影（幽灵狼）', e],
  ]),
);

export const AGENT_ALL_HERO_BUFFS: Record<string, string[]> = {
  科萌: ['全体特工暴击伤害+5%', '全体特工升级时恢复5%生命', '全体特工暴击率+5%'],
  月咏: ['全体特工攻击+5%', '全体特工暴击率+5%', '全体特工暴击伤害+5%'],
  凯蒂斯: ['全体特工生命+5%', '全体特工恢复效果+5%', '全体特工攻击+5%'],
  沃尔默: ['全体特工生命+5%', '全体特工恢复效果+5%', '全体特工攻击+5%'],
  金: ['全体特工攻击+5%', '全体特工暴击率+5%', '全体特工暴击伤害+5%'],
  章鱼哥: ['全体特工暴击伤害+5%', '全体特工升级时恢复5%生命', '全体特工暴击率+5%'],
  海绵宝宝: ['全体特工暴击伤害+5%', '全体特工升级时恢复5%生命', '全体特工暴击率+5%'],
  威彻: ['全体特工攻击+5%', '全体特工暴击率+5%', '全体特工暴击伤害+5%'],
  艾琳娜: ['全体特工生命+5%', '全体特工恢复效果+5%', '全体特工攻击+5%'],
  杨大师: ['全体特工攻击+10%', '全体特工恢复效果+5%', '全体特工暴击率+10%'],
  派大星: ['全体特工暴击伤害+5%', '全体特工升级时恢复5%生命', '全体特工暴击率+5%'],
  珊迪: ['全体特工暴击伤害+5%', '全体特工升级时恢复5%生命', '全体特工暴击率+5%'],
  凛音: ['全体特工攻击+10%', '全体特工恢复效果+5%', '全体特工暴击伤害+10%'],
  莱昂纳多: ['全体特工生命+5%', '全体特工升级时恢复5%生命', '全体特工攻击+5%'],
  拉斐尔: ['全体特工生命+5%', '全体特工升级时恢复5%生命', '全体特工攻击+5%'],
  爱普莉尔: ['全体特工生命+5%', '全体特工恢复效果+5%', '全体特工攻击+5%'],
  多纳泰罗: ['全体特工生命+5%', '全体特工升级时恢复5%生命', '全体特工攻击+5%'],
  米开朗基罗: ['全体特工生命+5%', '全体特工升级时恢复5%生命', '全体特工攻击+5%'],
  斯普林特: ['全体特工生命+5%', '全体特工恢复效果+5%', '全体特工攻击+5%'],
  乔伊: ['全体特工攻击+10%', '全体特工恢复效果+5%', '全体特工暴击伤害+10%'],
  塔洛西娅: ['全体特工攻击+10%', '全体特工恢复效果+5%', '全体特工暴击伤害+10%'],
  维托尔: ['全体特工攻击+10%', '全体特工恢复效果+5%', '全体特工暴击伤害+10%'],
  哪吒: ['全体特工生命+5%', '全体特工升级时恢复5%生命', '全体特工攻击+5%'],
  伏尔甘: ['全体特工生命+5%', '全体特工升级时恢复5%生命', '全体特工攻击+5%'],
  洛基: ['全体特工生命+5%', '全体特工升级时恢复5%生命', '全体特工攻击+5%'],
  伊狑: ['全体特工攻击+10%', '全体特工恢复效果+5%', '全体特工暴击伤害+10%'],
};

const S_AGENTS = new Set(['维托尔', '伊狑', '塔洛西娅', '凛音', '杨大师', '乔伊']);
const NORMAL_AGENTS = new Set([
  '科萌',
  '金',
  '月咏',
  '沃尔默',
  '艾琳娜',
  '凯蒂斯',
  '威彻',
  '海绵宝宝',
  '派大星',
  '章鱼哥',
  '珊迪',
]);

export function getAgentClass(entry: WikiEntryItem): AgentClassType {
  if (S_AGENTS.has(entry.name)) return 'S';
  if (NORMAL_AGENTS.has(entry.name)) return '普通';
  if (entry.subcategory === 'S' || entry.rarity === 'S') return 'S';
  if (entry.subcategory === '普通' || entry.rarity === 'COMMON') return '普通';
  return 'SP';
}

export function getAgentAllHeroBuffTags(entry: WikiEntryItem): string[] {
  return AGENT_ALL_HERO_BUFFS[entry.name] || entry.tags;
}

export function normalizeWikiEntries(entries: WikiEntryItem[]): WikiEntryItem[] {
  return entries.map((entry) => {
    if (entry.category === 'COLLECTIBLE') {
      const canonical = LOCAL_COLLECTIBLE_MAP.get(entry.name);
      if (canonical) {
        return {
          ...canonical,
          tier: undefined,
        };
      }
      return {
        ...entry,
        tier: undefined,
        tags: entry.tags.map((t) =>
          t === '传奇红藏' ? '传奇' : t === '史诗金藏' ? '史诗' : t,
        ),
      };
    }
    if (entry.category === 'MOUNT') {
      const canonical = LOCAL_MOUNT_MAP.get(entry.name);
      if (canonical) {
        return {
          ...canonical,
          tier: undefined,
        };
      }
      return {
        ...entry,
        tier: undefined,
      };
    }
    if (entry.category === 'EQUIPMENT') {
      const isSS =
        entry.rarity === 'SS' ||
        entry.subcategory === 'SS' ||
        entry.subcategory === 'SS神器';
      const sub = isSS ? 'SS' : 'S';
      return {
        ...entry,
        subcategory: sub,
        rarity: isSS ? 'SS' : 'S',
        tier: undefined,
        tags: entry.tags.map((t) =>
          t === 'SS神器' || t === 'SS装备'
            ? 'SS'
            : t === 'S级装备' || t === 'S装备'
              ? 'S'
              : t,
        ),
      };
    }
    if (entry.category === 'PET') {
      const isSPet =
        entry.subcategory === 'S级宠物' ||
        entry.subcategory === 'S级' ||
        (entry.rarity === 'S' && entry.subcategory !== '宠物助战技能');
      const isSkill = entry.subcategory === '宠物助战技能' || entry.subcategory === '助战技能';
      const petClass = isSkill ? '助战技能' : isSPet ? 'S级' : '普通';
      return {
        ...entry,
        subcategory: petClass,
        rarity: isSkill ? entry.rarity : isSPet ? 'S' : 'COMMON',
        tier: undefined,
        tags: entry.tags.map((t) =>
          t === 'S级宠物' || t === 'S级'
            ? 'S级'
            : t === '普通宠物' || t === '普通'
              ? '普通'
              : t === '宠物助战技能'
                ? '助战技能'
                : t,
        ),
      };
    }
    if (entry.category !== 'AGENT') {
      return {
        ...entry,
        tier: undefined,
      };
    }
    const agentClass = getAgentClass(entry);
    return {
      ...entry,
      subcategory: agentClass,
      rarity: agentClass === 'SP' ? 'SP' : agentClass === 'S' ? 'S' : 'COMMON',
      tier: undefined,
      tags: getAgentAllHeroBuffTags(entry),
    };
  });
}

export const AGENT_CLASS_STYLES: Record<
  AgentClassType,
  { badge: string; border: string; glow: string; label: string }
> = {
  SP: {
    badge: 'bg-red-600 text-white',
    border: 'border-red-500/40 hover:border-red-400',
    glow: 'from-red-500/15 via-slate-900/90 to-slate-950',
    label: 'SP',
  },
  S: {
    badge: 'bg-amber-400 text-slate-950',
    border: 'border-amber-500/40 hover:border-amber-400',
    glow: 'from-amber-500/15 via-slate-900/90 to-slate-950',
    label: 'S',
  },
  普通: {
    badge: 'bg-blue-500 text-white',
    border: 'border-blue-500/40 hover:border-blue-400',
    glow: 'from-blue-500/15 via-slate-900/90 to-slate-950',
    label: '普通',
  },
};

export const RARITY_STYLES: Record<
  string,
  { badge: string; border: string; glow: string; label: string }
> = {
  SS: {
    badge: 'bg-gradient-to-r from-rose-500 via-amber-400 to-cyan-400 text-slate-950 font-black',
    border: 'border-orange-500/40 hover:border-orange-400',
    glow: 'from-orange-500/15 via-slate-900/90 to-slate-950',
    label: 'SS',
  },
  SP: {
    badge: 'bg-red-600 text-white',
    border: 'border-red-500/40 hover:border-red-400',
    glow: 'from-red-500/15 via-slate-900/90 to-slate-950',
    label: 'SP',
  },
  LEGENDARY: {
    badge: 'bg-gradient-to-r from-red-600 to-rose-400 text-white',
    border: 'border-rose-500/40 hover:border-rose-400',
    glow: 'from-rose-500/15 via-slate-900/90 to-slate-950',
    label: '传奇红品',
  },
  S: {
    badge: 'bg-[#00b4ff] text-slate-950 font-black',
    border: 'border-sky-500/40 hover:border-sky-400',
    glow: 'from-sky-500/15 via-slate-900/90 to-slate-950',
    label: 'S',
  },
  EPIC: {
    badge: 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950',
    border: 'border-amber-500/35 hover:border-amber-400',
    glow: 'from-amber-500/15 via-slate-900/90 to-slate-950',
    label: '史诗金品',
  },
  COMMON: {
    badge: 'bg-blue-500 text-white',
    border: 'border-slate-700 hover:border-slate-500',
    glow: 'from-slate-800/40 via-slate-900/90 to-slate-950',
    label: '基础常驻',
  },
  PET_S: {
    badge: 'bg-gradient-to-r from-slate-200 via-indigo-200 to-pink-200 text-slate-950 font-black border border-white/80 shadow-sm',
    border: 'border-indigo-400/50 hover:border-indigo-300',
    glow: 'from-indigo-500/15 via-slate-900/90 to-slate-950',
    label: 'S级',
  },
  PET_NORMAL: {
    badge: 'bg-blue-500 text-white font-black',
    border: 'border-blue-500/40 hover:border-blue-400',
    glow: 'from-blue-500/15 via-slate-900/90 to-slate-950',
    label: '普通',
  },
  PET_SKILL: {
    badge: 'bg-slate-800 text-emerald-300 font-bold border border-emerald-500/40',
    border: 'border-emerald-500/30 hover:border-emerald-400/50',
    glow: 'from-emerald-500/10 via-slate-900/90 to-slate-950',
    label: '助战技能',
  },
};

export const COLLECTIBLE_EDITIONS = [
  'ALL',
  '第1期',
  '第2期',
  '第3期',
  '第4期',
  '第5期',
  '第6期',
  '第7期',
  '第8期',
  '第9期',
  '第10期',
];

export interface WikiFilterOptions {
  activeCategory: string;
  selectedEdition?: string;
  quickFilter?: string;
  searchQuery?: string;
}

export function filterWikiEntries(
  entries: WikiEntryItem[],
  {
    activeCategory,
    selectedEdition = 'ALL',
    quickFilter = 'ALL',
    searchQuery = '',
  }: WikiFilterOptions,
): WikiEntryItem[] {
  const normalized = normalizeWikiEntries(entries);
  return normalized.filter((item) => {
    if (activeCategory !== 'ALL' && item.category !== activeCategory) {
      return false;
    }

    if (
      activeCategory === 'COLLECTIBLE' &&
      selectedEdition !== 'ALL' &&
      item.edition !== selectedEdition
    ) {
      return false;
    }

    if (quickFilter !== 'ALL') {
      if (quickFilter === 'AGENT_SP') {
        if (item.category !== 'AGENT' || getAgentClass(item) !== 'SP') return false;
      } else if (quickFilter === 'AGENT_S') {
        if (item.category !== 'AGENT' || getAgentClass(item) !== 'S') return false;
      } else if (quickFilter === 'AGENT_NORMAL') {
        if (item.category !== 'AGENT' || getAgentClass(item) !== '普通') return false;
      } else if (quickFilter === 'CRIT_RATE' || quickFilter === 'EPIC_CRIT_RATE') {
        if (
          item.category !== 'COLLECTIBLE' ||
          !item.tags.some((t) => t.includes('暴击率'))
        ) {
          return false;
        }
      } else if (quickFilter === 'CRIT_DMG' || quickFilter === 'EPIC_CRIT_DMG') {
        if (
          item.category !== 'COLLECTIBLE' ||
          !item.tags.some((t) => t.includes('暴击伤害'))
        ) {
          return false;
        }
      } else if (quickFilter === 'SS_EQUIP') {
        if (
          item.category !== 'EQUIPMENT' ||
          (item.subcategory !== 'SS' &&
            item.rarity !== 'SS' &&
            item.subcategory !== 'SS神器')
        ) {
          return false;
        }
      } else if (quickFilter === 'S_EQUIP') {
        if (
          item.category !== 'EQUIPMENT' ||
          (item.subcategory !== 'S' &&
            item.rarity !== 'S' &&
            item.subcategory !== 'S级装备')
        ) {
          return false;
        }
      } else if (quickFilter === 'S_PET') {
        if (
          item.category !== 'PET' ||
          (item.subcategory !== 'S级宠物' &&
            item.subcategory !== 'S级' &&
            item.rarity !== 'S')
        ) {
          return false;
        }
      } else if (quickFilter === 'NORMAL_PET') {
        if (
          item.category !== 'PET' ||
          (item.subcategory !== '普通宠物' &&
            item.subcategory !== '普通')
        ) {
          return false;
        }
      } else if (item.category === 'MECHANIC') {
        if (item.subcategory !== quickFilter) {
          return false;
        }
      }
    }

    if (searchQuery.trim()) {
      const kw = searchQuery.trim().toLowerCase();
      const matchName = item.name.toLowerCase().includes(kw);
      const matchSummary = item.summary.toLowerCase().includes(kw);
      const matchSub = (item.subcategory || '').toLowerCase().includes(kw);
      const matchEdition = (item.edition || '').toLowerCase().includes(kw);
      const matchTags = item.tags.some((t) => t.toLowerCase().includes(kw));
      return matchName || matchSummary || matchSub || matchEdition || matchTags;
    }

    return true;
  });
}

