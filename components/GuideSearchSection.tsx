"use client";

import { Search, X } from 'lucide-react';

interface GuideSearchSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function GuideSearchSection({
  searchQuery,
  onSearchChange,
}: GuideSearchSectionProps) {
  return (
    <section className="relative pt-6 sm:pt-8 pb-6 sm:pb-8">
      {/* Background Subtle Gradient Glow (Controlled height) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 max-w-2xl h-32 bg-orange-500/10 blur-[80px] pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4 sm:space-y-5">
        {/* Title and Subtitle */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            弹壳特攻队攻略
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            从新手入坑到养成提升，找到你需要的答案。
          </p>
        </div>

        {/* Search Input Box */}
        <div className="relative max-w-xl mx-auto">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 sm:w-5 sm:h-5 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="搜索攻略、玩法、装备名称……"
              className="w-full pl-11 pr-10 py-3 sm:py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 shadow-xl transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3.5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="清除搜索"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-left text-xs text-orange-400/90 mt-1.5 px-2">
              当前针对已收录攻略文章搜索：“{searchQuery}”
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
