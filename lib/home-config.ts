import { CalendarDays, PackageSearch, Calculator, Car, ShoppingCart, Waves, Diamond, LucideIcon } from 'lucide-react';

export interface HomeToolItem {
  id: string;
  name: string;
  desc?: string;
  badge?: string;
  hidden?: boolean;
  url: string;
  isExternal?: boolean;
  icon: LucideIcon;
  ratio: number;
  gradient: string;
}

export const HOME_TOOLS: HomeToolItem[] = [
  {
    id: 'danke-cxmj',
    name: '潮汐秘境',
    url: 'https://dankecxmj.guaguahub.cn/',
    isExternal: true,
    icon: Waves,
    ratio: 1,
    gradient: 'from-sky-500/25 via-blue-950/40 to-slate-950',
  },
  {
    id: 'danke-rank',
    name: '并列发车',
    url: 'https://dankerank.guaguahub.cn',
    isExternal: true,
    icon: Car,
    ratio: 1,
    gradient: 'from-amber-500/25 via-orange-950/40 to-slate-950',
  },
  {
    id: 'danke-market',
    name: '高价卖菜',
    url: 'https://dankemarket.guaguahub.cn',
    isExternal: true,
    icon: ShoppingCart,
    ratio: 1,
    gradient: 'from-emerald-500/25 via-teal-950/40 to-slate-950',
  },
  {
    id: 'calculator',
    name: '伤害计算器',
    badge: '建设中',
    url: '/damage-calculator',
    isExternal: false,
    icon: Calculator,
    ratio: 1,
    gradient: 'from-cyan-500/25 via-blue-950/40 to-slate-950',
  },
  { id: 'progression', name: '养成模拟', hidden: true, url: '/calculator', icon: Calculator, ratio: 1, gradient: 'from-cyan-500/25 via-slate-900/40 to-slate-950' },
  { id: 'events', name: '活动数据', badge: '建设中', url: '/events', icon: CalendarDays, ratio: 1, gradient: 'from-purple-500/25 via-indigo-950/40 to-slate-950' },
  { id: 'yields', name: '资源获取', url: '/yields', icon: PackageSearch, ratio: 1, gradient: 'from-amber-500/25 via-orange-950/40 to-slate-950' },
  { id: 'gem-values', name: '资源价值', url: '/gem-values', icon: Diamond, ratio: 1, gradient: 'from-emerald-500/20 via-cyan-950/40 to-slate-950' },
];
