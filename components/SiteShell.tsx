"use client";
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowUp } from 'lucide-react';
import TopNavBar from './TopNavBar';
import FooterSection from './FooterSection';
import MobileTabBar from './MobileTabBar';
import AdSlot from './AdSlot';
import WechatTip from './WechatTip';
export default function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return <div className="relative z-10 flex min-h-screen flex-col pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0"><TopNavBar /><div className="flex-1">{children}</div>{pathname !== '/' && <AdSlot slot="page-bottom" className="site-container mt-8" />}<FooterSection width="wide" /><MobileTabBar /><WechatTip /><button type="button" aria-label="返回顶部" title="返回顶部" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} className="fixed bottom-24 right-4 z-30 rounded-xl border border-slate-700 bg-slate-900/90 p-3 text-orange-400 md:bottom-6"><ArrowUp className="h-5 w-5" /></button></div>;
}
