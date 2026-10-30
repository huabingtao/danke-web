"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Sparkles,
  BookOpen,
  Calculator,
  Shield,
  Swords,
  Award,
  Flame,
  Cpu,
  Compass,
  Zap,
  Package,
  ChevronRight,
  Layers,
} from 'lucide-react';
import TopNavBar from '@/components/TopNavBar';
import FooterSection from '@/components/FooterSection';
import {
  WikiEntryItem,
  HandbookGuideItem,
} from '@/lib/local-wiki-data';
import { filterWikiEntries } from '@/lib/wiki-helpers';
import WikiEntryCard from '@/components/wiki/WikiEntryCard';
import WikiEntryDetailModal from '@/components/wiki/WikiEntryDetailModal';
import WikiCategoryFilterBar from '@/components/wiki/WikiCategoryFilterBar';

interface WikiEncyclopediaClientProps {
  initialEntries: WikiEntryItem[];
  handbookGuides: HandbookGuideItem[];
}

const WIKI_CATEGORIES = [
  { key: 'ALL', label: '全部词条', icon: Layers },
  { key: 'AGENT', label: '特工', icon: Flame },
  { key: 'COLLECTIBLE', label: '收藏品', icon: Award },
  { key: 'EQUIPMENT', label: '装备', icon: Swords },
  { key: 'PET', label: '宠物', icon: Shield },
  { key: 'TECH_PART', label: '配件', icon: Cpu },
  { key: 'MOUNT', label: '载具', icon: Compass },
  { key: 'MECHANIC', label: '消耗品', icon: Package },
  { key: 'BUFF', label: '战斗Buff', icon: Zap },
] as const;

export default function WikiEncyclopediaClient({
  initialEntries,
  handbookGuides,
}: WikiEncyclopediaClientProps) {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEdition, setSelectedEdition] = useState<string>('ALL');
  const [quickFilter, setQuickFilter] = useState<string>('ALL');
  const [selectedEntry, setSelectedEntry] = useState<WikiEntryItem | null>(null);

  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat && WIKI_CATEGORIES.some((c) => c.key === cat)) {
      setActiveCategory(cat);
    }
  }, [searchParams]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setSelectedEdition('ALL');
    setQuickFilter('ALL');
  };

  const filteredEntries = useMemo(() => {
    return filterWikiEntries(initialEntries, {
      activeCategory,
      selectedEdition,
      quickFilter,
      searchQuery,
    });
  }, [
    initialEntries,
    activeCategory,
    selectedEdition,
    quickFilter,
    searchQuery,
  ]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: initialEntries.length };
    for (const item of initialEntries) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
    return counts;
  }, [initialEntries]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1d] text-slate-100 selection:bg-orange-500 selection:text-slate-950">
      <TopNavBar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10">
        {/* 1. Hero Header & Global Search */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-800/90 bg-gradient-to-br from-slate-900/95 via-[#111a2e]/95 to-slate-950 p-6 sm:p-10 shadow-2xl">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>弹壳呱呱 · 全量结构化 Wiki 数据库（已收录 {initialEntries.length} 词条）</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                《弹壳特攻队》百科图鉴与词条中心
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                涵盖 <span className="text-orange-400 font-semibold">SP/S特工、SS神器与神炼、1~10期红/金收藏品、S宠物与助战技能、双生配件、载具及局内Debuff乘区</span>，支持按暴击率/暴伤/期数秒级检索并与深度攻略双向联动。
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <Link
                href="/calculator"
                className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-orange-500/25 transition-all"
              >
                <Calculator className="w-4 h-4" />
                <span>前往养成消耗与节点速查表</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-bold text-xs transition-all"
              >
                <BookOpen className="w-3.5 h-3.5 text-orange-400" />
                <span>返回深度攻略门户</span>
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative z-10 mt-6">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索特工、SS神装、1-10期收藏品、暴击率、神火、裂伤、异宠核心..."
                className="w-full pl-12 pr-24 py-3.5 rounded-2xl bg-slate-950/90 border border-slate-700/80 focus:border-orange-500 focus:outline-none text-sm sm:text-base text-white placeholder-slate-500 shadow-inner transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 cursor-pointer"
                >
                  清除
                </button>
              )}
            </div>
          </div>
        </section>

        {/* 2. 《从入门到入土》五大必修体系课 */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-2 h-6 rounded-full bg-orange-500" />
              <h2 className="text-lg sm:text-xl font-black text-white">
                《从入门到入土》五大体系必修课
              </h2>
              <span className="hidden sm:inline-block text-xs text-slate-400">
                点击直接筛选对应图鉴或查阅消耗矩阵
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {handbookGuides.map((guide) => (
              <div
                key={guide.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-[#11192c]/90 hover:border-orange-500/40 p-4 transition-all group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r ${guide.accentColor} text-slate-950`}
                    >
                      {guide.chapter}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-white group-hover:text-orange-400 transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-xs font-semibold text-orange-300/90 line-clamp-1">
                    {guide.subtitle}
                  </p>
                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">
                    {guide.routeSummary}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-[11px]">
                  <button
                    onClick={() => handleCategoryChange(guide.wikiCategory)}
                    className="font-bold text-orange-400 hover:text-orange-300 cursor-pointer"
                  >
                    筛选图鉴 →
                  </button>
                  <Link
                    href={`/calculator?matrix=${guide.matrixCode}`}
                    className="font-bold text-cyan-400 hover:text-cyan-300"
                  >
                    消耗矩阵 →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. 一级分类导航 Tabs + 复用二级智能过滤器 */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {WIKI_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.key;
              const count = categoryCounts[cat.key] || 0;
              return (
                <button
                  key={cat.key}
                  onClick={() => handleCategoryChange(cat.key)}
                  className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-orange-500 text-slate-950 border-orange-400 shadow-lg shadow-orange-500/20'
                      : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      isActive
                        ? 'bg-slate-950/20 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <WikiCategoryFilterBar
            activeCategory={activeCategory}
            quickFilter={quickFilter}
            onQuickFilterChange={setQuickFilter}
            selectedEdition={selectedEdition}
            onEditionChange={setSelectedEdition}
          />
        </section>

        {/* 4. 百科词条卡片网格 */}
        <section className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              当前匹配到 <strong className="text-orange-400">{filteredEntries.length}</strong> 个百科词条（点击卡片查看星级/神铸节点详情）
            </span>
          </div>

          {filteredEntries.length === 0 ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-12 text-center space-y-3">
              <p className="text-base font-bold text-slate-300">
                未找到匹配的 Wiki 词条
              </p>
              <p className="text-xs text-slate-500">
                请尝试清除关键词或切换顶部分类标签
              </p>
              <button
                onClick={() => {
                  setActiveCategory('ALL');
                  setSelectedEdition('ALL');
                  setQuickFilter('ALL');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-orange-500 text-slate-950 text-xs font-bold cursor-pointer"
              >
                重置全部筛选
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredEntries.map((entry) => (
                <WikiEntryCard
                  key={entry.slug}
                  entry={entry}
                  onSelect={setSelectedEntry}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* 5. 词条详情抽屉 Modal */}
      <WikiEntryDetailModal
        selectedEntry={selectedEntry}
        onClose={() => setSelectedEntry(null)}
      />

      <FooterSection />
    </div>
  );
}
