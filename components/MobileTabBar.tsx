"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Sparkles, Calculator } from 'lucide-react';

export default function MobileTabBar() {
  const pathname = usePathname();

  const NAV_ITEMS = [
    { label: '首页', href: '/', icon: Home },
    { label: '攻略库', href: '/strategies', icon: BookOpen },
    { label: '图鉴', href: '/items', icon: Sparkles },
    { label: '工具', href: '/calculator', icon: Calculator },
  ];

  return (
    <nav
      aria-label="移动端快捷导航"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0f1d]/95 backdrop-blur-2xl border-t border-slate-800/80 px-2 py-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom,0px))]"
    >
      <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
                isActive
                  ? 'text-orange-400 font-bold bg-orange-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-orange-400' : 'text-slate-400'}`} />
                {item.href === '/items' && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
