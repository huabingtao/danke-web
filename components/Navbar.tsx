'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: '首页', path: '/' },
    { name: '月度产出', path: '/yields' },
    { name: '物品百科', path: '/items' },
    { name: '活动时间轴', path: '/events' },
    { name: '伤害计算器', path: '/calculator' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/75 border-b border-zinc-900/80 backdrop-blur-md text-zinc-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center w-full justify-between md:justify-start">
            <div className="flex-shrink-0">
              <Link href="/" className="font-extrabold text-lg text-orange-500 tracking-wider hover:text-orange-400 transition-colors">
                弹壳呱呱 · 战术中心
              </Link>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden md:block md:ml-10">
              <div className="flex items-baseline space-x-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                        isActive
                          ? 'bg-orange-500/10 text-orange-400 border-orange-500/25 shadow-[0_0_15px_rgba(249,115,22,0.05)]'
                          : 'text-zinc-400 border-transparent hover:text-orange-300 hover:bg-zinc-900/60'
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile menu (horizontal scrolling on top right) */}
          <div className="md:hidden flex items-center space-x-1.5 overflow-x-auto py-2 max-w-[60%] scrollbar-none">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                    isActive
                      ? 'bg-orange-500/10 text-orange-400 border-orange-500/25'
                      : 'text-zinc-400 border-transparent hover:text-orange-300 hover:bg-zinc-900/60'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
