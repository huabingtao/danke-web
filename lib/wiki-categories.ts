import { Flame, Swords, Award, Shield, Cpu, Compass, Zap, Crosshair, Package, LucideIcon } from 'lucide-react';

export type WikiCategoryKey =
  | 'AGENT'
  | 'COLLECTIBLE'
  | 'EQUIPMENT'
  | 'PET'
  | 'TECH_PART'
  | 'MOUNT'
  | 'MECHANIC'
  | 'BUFF'
  | 'DAMAGE_STAT';

export interface WikiCategoryDef {
  key: WikiCategoryKey;
  slug: string;
  label: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
  description: string;
  linkHref: string;
}

export const WIKI_CATEGORIES: WikiCategoryDef[] = [
  {
    key: 'AGENT',
    slug: 'agent',
    label: '特工',
    icon: Flame,
    color: 'text-orange-400',
    gradient: 'from-orange-500/25 via-amber-950/40 to-slate-950',
    description: 'SP/S特工全星级属性与觉醒技能',
    linkHref: '/items/agent',
  },
  {
    key: 'COLLECTIBLE',
    slug: 'collectible',
    label: '收藏品',
    icon: Award,
    color: 'text-amber-400',
    gradient: 'from-amber-500/25 via-yellow-950/40 to-slate-950',
    description: '',
    linkHref: '/items/collectible',
  },
  {
    key: 'EQUIPMENT',
    slug: 'equipment',
    label: '装备',
    icon: Swords,
    color: 'text-rose-400',
    gradient: 'from-rose-500/25 via-red-950/40 to-slate-950',
    description: 'SS创世神装合成顺位与神炼节点',
    linkHref: '/items/equipment',
  },
  {
    key: 'PET',
    slug: 'pet',
    label: '宠物',
    icon: Shield,
    color: 'text-emerald-400',
    gradient: 'from-emerald-500/25 via-teal-950/40 to-slate-950',
    description: '',
    linkHref: '/items/pet',
  },
  {
    key: 'TECH_PART',
    slug: 'tech-part',
    label: '配件',
    icon: Cpu,
    color: 'text-cyan-400',
    gradient: 'from-cyan-500/25 via-sky-950/40 to-slate-950',
    description: '',
    linkHref: '/items/tech-part',
  },
  {
    key: 'MOUNT',
    slug: 'mount',
    label: '载具',
    icon: Compass,
    color: 'text-purple-400',
    gradient: 'from-purple-500/25 via-indigo-950/40 to-slate-950',
    description: '',
    linkHref: '/items/mount',
  },
  {
    key: 'MECHANIC',
    slug: 'mechanic',
    label: '消耗品',
    icon: Package,
    color: 'text-blue-400',
    gradient: 'from-blue-500/25 via-slate-900/50 to-slate-950',
    description: '核心、钥匙、碎片、宝箱、图纸与养成材料',
    linkHref: '/items/mechanic',
  },
  {
    key: 'BUFF',
    slug: 'buff',
    label: '战斗Buff',
    icon: Zap,
    color: 'text-amber-400',
    gradient: 'from-amber-500/25 via-slate-900/50 to-slate-950',
    description: '局内战斗异常状态、属性增减益与控制状态',
    linkHref: '/items/buff',
  },
  {
    key: 'DAMAGE_STAT',
    slug: 'damage-stat',
    label: '伤害词条',
    icon: Crosshair,
    color: 'text-amber-300',
    gradient: 'from-amber-500/25 via-rose-950/40 to-slate-950',
    description: '暴击率/暴伤/易伤/全体生效速查',
    linkHref: '/items/damage-stat',
  },
];
