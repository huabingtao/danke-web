"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Flame, Menu, X, BookOpen, Layers, Calculator, Info, Sparkles } from 'lucide-react';

interface TopNavBarProps {
  onNavigateTo?: (targetId: string) => void;
}

export default function TopNavBar({ onNavigateTo }: TopNavBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (targetId: string) => {
    setMobileMenuOpen(false);
    if (onNavigateTo) {
      onNavigateTo(targetId);
    } else {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0a0f1d]/85 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo & Title */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 p-[2px] shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-black tracking-wide text-white group-hover:text-orange-400 transition-colors">
              弹壳特攻队 Wiki & 攻略站
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:block">
              硬核图鉴百科 · 养成消耗精算 · 战术攻略
            </span>
          </div>
        </Link>

        {/* Desktop Main Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          <Link
            href="/"
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-bold text-slate-200 hover:text-white hover:bg-slate-800/60 transition-all"
          >
            <BookOpen className="w-4 h-4 text-orange-400" />
            <span>深度攻略</span>
          </Link>

          <Link
            href="/wiki"
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-bold text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 border border-orange-500/20 transition-all"
          >
            <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />
            <span>战术图鉴</span>
          </Link>

          <Link
            href="/items"
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-bold text-slate-200 hover:text-white hover:bg-slate-800/60 transition-all"
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>物品图鉴</span>
          </Link>

          <Link
            href="/calculator"
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-bold text-slate-200 hover:text-white hover:bg-slate-800/60 transition-all"
          >
            <Calculator className="w-4 h-4 text-cyan-400" />
            <span>养成消耗表</span>
          </Link>

          <button
            onClick={() => handleNavClick('footer-about')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-bold text-slate-200 hover:text-white hover:bg-slate-800/60 transition-all cursor-pointer"
          >
            <Info className="w-4 h-4 text-slate-400" />
            <span>关于</span>
          </button>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-900/90 border border-slate-700/60 text-slate-300 hover:text-white"
            aria-label="切换菜单"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0a0f1d]/95 backdrop-blur-2xl px-4 py-4 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-xl font-bold text-sm bg-slate-900/80 text-slate-100 hover:bg-orange-500/20 hover:text-orange-300"
          >
            <BookOpen className="w-4 h-4 text-orange-400" />
            <span>深度攻略门户</span>
          </Link>

          <Link
            href="/wiki"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-xl font-bold text-sm bg-orange-500/15 border border-orange-500/30 text-orange-300 hover:bg-orange-500/25"
          >
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span>战术图鉴 (特工/全量收藏品/载具)</span>
          </Link>

          <Link
            href="/items"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-xl font-bold text-sm bg-slate-900/80 text-slate-100 hover:bg-amber-500/20 hover:text-amber-300"
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>物品图鉴手册 (158+词条)</span>
          </Link>

          <Link
            href="/calculator"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-xl font-bold text-sm bg-slate-900/80 text-slate-100 hover:bg-cyan-500/20 hover:text-cyan-300"
          >
            <Calculator className="w-4 h-4 text-cyan-400" />
            <span>养成消耗与节点速查表</span>
          </Link>

          <button
            onClick={() => handleNavClick('footer-about')}
            className="w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-xl font-bold text-sm bg-slate-900/80 text-slate-100 hover:bg-slate-800 text-left"
          >
            <Info className="w-4 h-4 text-slate-400" />
            <span>关于本站与公众号</span>
          </button>
        </div>
      )}
    </header>
  );
}
