"use client";

import { useState } from 'react';
import { Search, Bell, Sparkles } from 'lucide-react';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const hotKeywords = [
    { label: '测试1', query: '测试1' },
    { label: '测试2', query: '测试2' },
    { label: '测试3', query: '测试3' },
    { label: '测试4', query: '测试4' },
  ];

  return (
    <header className="w-full glass-panel rounded-3xl p-4 sm:p-5 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Left / Center: Search Input */}
      <div className="w-full md:w-auto md:flex-1 max-w-2xl">
        <div className="relative group">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-orange-400 transition-colors" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              onSearch?.(e.target.value);
            }}
            placeholder="搜索活动攻略、特工天赋、装备搭配、回响打法..."
            className="w-full pl-11 pr-4 py-2.5 bg-[#0b1329]/90 border border-slate-700/70 rounded-2xl text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all shadow-inner"
          />
        </div>

        {/* Hot Search Tags */}
        <div className="flex items-center space-x-2 mt-2.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] text-slate-400 shrink-0 font-medium">大家都在搜:</span>
          {hotKeywords.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSearchTerm(item.query);
                onSearch?.(item.query);
              }}
              className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800/80 hover:bg-orange-500/20 text-slate-300 hover:text-orange-300 border border-slate-700/60 hover:border-orange-500/40 transition-all shrink-0 cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Right: Notification Bell */}
      <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
        {/* Notification Bell */}
        <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-slate-800/70 border border-slate-700/70 text-slate-300 hover:text-white hover:border-orange-500/50 transition-all cursor-pointer relative shadow-sm">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-orange-500 absolute top-2.5 right-2.5 animate-ping" />
          <span className="w-2 h-2 rounded-full bg-orange-500 absolute top-2.5 right-2.5" />
        </div>
      </div>
    </header>
  );
}
