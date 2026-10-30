import { Calculator, Car, ShoppingCart, Waves, LucideIcon } from 'lucide-react';

export interface HomeToolItem {
  id: string;
  name: string;
  desc?: string;
  badge?: string;
  url: string;
  isExternal?: boolean;
  icon: LucideIcon;
  ratio: number;
  gradient: string;
}

export const HOME_TOOLS: HomeToolItem[] = [
  {
    id: 'danke-cxmj',
    name: '潮汐秘境助手',
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
    name: '弹壳伤害计算器',
    url: '/calculator',
    isExternal: false,
    icon: Calculator,
    ratio: 1,
    gradient: 'from-cyan-500/25 via-blue-950/40 to-slate-950',
  },
];
