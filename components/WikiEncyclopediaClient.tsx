"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
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
  X,
  ChevronRight,
  Filter,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import TopNavBar from '@/components/TopNavBar';
import FooterSection from '@/components/FooterSection';
import {
  WikiEntryItem,
  HandbookGuideItem,
} from '@/lib/local-wiki-data';

interface WikiEncyclopediaClientProps {
  initialEntries: WikiEntryItem[];
  handbookGuides: HandbookGuideItem[];
}

const WIKI_CATEGORIES = [
  { key: 'ALL', label: '全部词条', icon: Layers },
  { key: 'AGENT', label: '特工档案', icon: Flame },
  { key: 'EQUIPMENT', label: '装备与神器', icon: Swords },
  { key: 'COLLECTIBLE', label: '收藏品 (1-10期)', icon: Award },
  { key: 'PET', label: '战术宠物', icon: Shield },
  { key: 'TECH_PART', label: '科技配件', icon: Cpu },
  { key: 'MOUNT', label: '战术载具', icon: Compass },
  { key: 'MECHANIC', label: '状态与通货', icon: Zap },
] as const;

const COLLECTIBLE_EDITIONS = [
  'ALL',
  '第1期',
  '第2期',
  '第3期',
  '第4期',
  '第5期',
  '第6期',
  '第7期',
  '第8期',
  '第9期',
  '第10期',
];

const RARITY_STYLES: Record<
  string,
  { badge: string; border: string; glow: string; label: string }
> = {
  SS: {
    badge: 'bg-gradient-to-r from-rose-500 via-orange-500 to-amber-400 text-slate-950',
    border: 'border-orange-500/40 hover:border-orange-400',
    glow: 'from-orange-500/15 via-slate-900/90 to-slate-950',
    label: 'SS 神话',
  },
  SP: {
    badge: 'bg-gradient-to-r from-red-500 via-amber-500 to-yellow-300 text-slate-950',
    border: 'border-red-500/40 hover:border-amber-400',
    glow: 'from-red-500/15 via-slate-900/90 to-slate-950',
    label: 'SP 限定',
  },
  LEGENDARY: {
    badge: 'bg-gradient-to-r from-red-600 to-rose-400 text-white',
    border: 'border-rose-500/40 hover:border-rose-400',
    glow: 'from-rose-500/15 via-slate-900/90 to-slate-950',
    label: '传奇红品',
  },
  S: {
    badge: 'bg-gradient-to-r from-purple-500 to-indigo-400 text-white',
    border: 'border-purple-500/40 hover:border-purple-400',
    glow: 'from-purple-500/15 via-slate-900/90 to-slate-950',
    label: 'S 杰出',
  },
  EPIC: {
    badge: 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950',
    border: 'border-amber-500/35 hover:border-amber-400',
    glow: 'from-amber-500/15 via-slate-900/90 to-slate-950',
    label: '史诗金品',
  },
  COMMON: {
    badge: 'bg-slate-700 text-slate-200',
    border: 'border-slate-700 hover:border-slate-500',
    glow: 'from-slate-800/40 via-slate-900/90 to-slate-950',
    label: '基础常驻',
  },
};

export default function WikiEncyclopediaClient({
  initialEntries,
  handbookGuides,
}: WikiEncyclopediaClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEdition, setSelectedEdition] = useState<string>('ALL');
  const [quickFilter, setQuickFilter] = useState<string>('ALL');
  const [selectedEntry, setSelectedEntry] = useState<WikiEntryItem | null>(null);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setSelectedEdition('ALL');
    setQuickFilter('ALL');
  };

  const filteredEntries = useMemo(() => {
    return initialEntries.filter((item) => {
      if (activeCategory !== 'ALL' && item.category !== activeCategory) {
        return false;
      }

      if (
        activeCategory === 'COLLECTIBLE' &&
        selectedEdition !== 'ALL' &&
        item.edition !== selectedEdition
      ) {
        return false;
      }

      if (quickFilter !== 'ALL') {
        if (quickFilter === 'CRIT_RATE') {
          const isEpicCritRate =
            item.subcategory === '史诗收藏品' &&
            item.tags.some((t) => t.includes('暴击率 +5%') || t === '暴击率');
          const isLegCritRate = item.subcategory === '传奇收藏品';
          if (!isEpicCritRate && !isLegCritRate) return false;
        } else if (quickFilter === 'EPIC_CRIT_RATE') {
          if (
            item.subcategory !== '史诗收藏品' ||
            !item.tags.some((t) => t.includes('暴击率'))
          ) {
            return false;
          }
        } else if (quickFilter === 'EPIC_CRIT_DMG') {
          if (
            item.subcategory !== '史诗收藏品' ||
            !item.tags.some((t) => t.includes('暴击伤害'))
          ) {
            return false;
          }
        } else if (quickFilter === 'MUST_BUILD_RED') {
          if (
            item.subcategory !== '传奇收藏品' ||
            !item.tags.some((t) => t.includes('必做') || t.includes('T0'))
          ) {
            return false;
          }
        } else if (quickFilter === 'ATK_2000') {
          if (!item.tags.some((t) => t.includes('+2000攻击'))) {
            return false;
          }
        } else if (quickFilter === 'SS_EQUIP') {
          if (item.subcategory !== 'SS神器') return false;
        } else if (quickFilter === 'S_EQUIP') {
          if (item.subcategory !== 'S级装备') return false;
        } else if (quickFilter === 'PET_SKILL') {
          if (item.subcategory !== '宠物助战技能') return false;
        } else if (quickFilter === 'S_PET') {
          if (item.subcategory !== 'S级宠物') return false;
        }
      }

      if (searchQuery.trim()) {
        const kw = searchQuery.trim().toLowerCase();
        const matchName = item.name.toLowerCase().includes(kw);
        const matchSummary = item.summary.toLowerCase().includes(kw);
        const matchSub = (item.subcategory || '').toLowerCase().includes(kw);
        const matchEdition = (item.edition || '').toLowerCase().includes(kw);
        const matchTags = item.tags.some((t) => t.toLowerCase().includes(kw));
        return matchName || matchSummary || matchSub || matchEdition || matchTags;
      }

      return true;
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
                涵盖 <span className="text-orange-400 font-semibold">SP/S特工、SS神器与神炼、1~10期红/金收藏品、S宠物与助战技能、双生配件、战术载具及局内Debuff乘区</span>，支持按暴击率/暴伤/期数秒级检索并与深度攻略双向联动。
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

        {/* 3. 一级分类导航 Tabs + 二级智能过滤器 */}
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

          {/* 收藏品专属二级筛选：红3暴击率 / 红3暴伤 / 6大必做红藏 / 1-10期 */}
          {activeCategory === 'COLLECTIBLE' && (
            <div className="rounded-2xl border border-amber-500/25 bg-slate-900/80 p-4 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-amber-400 inline-flex items-center gap-1 mr-1">
                  <Filter className="w-3.5 h-3.5" /> 词条特性筛选:
                </span>
                {[
                  { key: 'ALL', label: '全部收藏品' },
                  { key: 'EPIC_CRIT_RATE', label: '🔥 红3暴击率+5% (金藏)' },
                  { key: 'EPIC_CRIT_DMG', label: '💥 红3暴伤+5% (金藏)' },
                  { key: 'MUST_BUILD_RED', label: '👑 6大必做与核心红藏' },
                  { key: 'ATK_2000', label: '⚔️ 满星+2000攻击面板' },
                ].map((flt) => (
                  <button
                    key={flt.key}
                    onClick={() => setQuickFilter(flt.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      quickFilter === flt.key
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-amber-500/40'
                    }`}
                  >
                    {flt.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/80">
                <span className="text-xs font-bold text-slate-400 mr-1">
                  按期数筛选:
                </span>
                {COLLECTIBLE_EDITIONS.map((ed) => (
                  <button
                    key={ed}
                    onClick={() => setSelectedEdition(ed)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectedEdition === ed
                        ? 'bg-orange-500/20 text-orange-300 border border-orange-500/50'
                        : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800/60'
                    }`}
                  >
                    {ed === 'ALL' ? '全部期数' : ed}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 装备专属二级筛选 */}
          {activeCategory === 'EQUIPMENT' && (
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-blue-500/25 bg-slate-900/80 p-3.5">
              <span className="text-xs font-bold text-blue-400 inline-flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5" /> 装备筛选:
              </span>
              {[
                { key: 'ALL', label: '全部装备' },
                { key: 'SS_EQUIP', label: '⚡ SS级神器 (6件)' },
                { key: 'S_EQUIP', label: '🛡️ S级杰出神装' },
              ].map((flt) => (
                <button
                  key={flt.key}
                  onClick={() => setQuickFilter(flt.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    quickFilter === flt.key
                      ? 'bg-blue-500 text-slate-950 border-blue-400'
                      : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-blue-500/40'
                  }`}
                >
                  {flt.label}
                </button>
              ))}
            </div>
          )}

          {/* 宠物专属二级筛选 */}
          {activeCategory === 'PET' && (
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-emerald-500/25 bg-slate-900/80 p-3.5">
              <span className="text-xs font-bold text-emerald-400 inline-flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5" /> 宠物模块筛选:
              </span>
              {[
                { key: 'ALL', label: '全部宠物与技能' },
                { key: 'S_PET', label: '🐾 S级宠物 (7只)' },
                { key: 'PET_SKILL', label: '✨ 助战技能梯队 (T0~T3)' },
              ].map((flt) => (
                <button
                  key={flt.key}
                  onClick={() => setQuickFilter(flt.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    quickFilter === flt.key
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-emerald-500/40'
                  }`}
                >
                  {flt.label}
                </button>
              ))}
            </div>
          )}
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
              {filteredEntries.map((entry) => {
                const style = RARITY_STYLES[entry.rarity] || RARITY_STYLES.COMMON;
                return (
                  <div
                    key={entry.slug}
                    onClick={() => setSelectedEntry(entry)}
                    className={`group relative rounded-2xl border ${style.border} bg-gradient-to-b ${style.glow} p-4 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-lg cursor-pointer`}
                  >
                    <div>
                      {/* Top Header: Icon + Name + Rarity Badge */}
                      <div className="flex items-start space-x-3.5">
                        <div className="relative w-14 h-14 rounded-2xl bg-slate-950/90 border border-slate-700/80 flex items-center justify-center p-1.5 shrink-0 overflow-hidden shadow-inner">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={entry.icon}
                            alt={entry.name}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-200"
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              target.onerror = null;
                              target.src = '/wiki-assets/占位图.png';
                            }}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span
                              className={`text-[10px] font-black px-2 py-0.5 rounded-full ${style.badge}`}
                            >
                              {entry.edition || entry.subcategory || style.label}
                            </span>
                            {entry.tier && (
                              <span className="text-[10px] font-bold text-orange-300 truncate">
                                {entry.tier}
                              </span>
                            )}
                          </div>
                          <h3 className="text-base font-black text-white mt-1.5 truncate group-hover:text-orange-400 transition-colors">
                            {entry.name}
                          </h3>
                        </div>
                      </div>

                      {/* Summary */}
                      <p className="text-xs text-slate-300 leading-relaxed mt-3 line-clamp-3">
                        {entry.summary}
                      </p>
                    </div>

                    {/* Tags & Key Node Preview */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {entry.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-800 text-slate-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>{entry.attributes.slot || entry.subcategory}</span>
                        <span className="text-orange-400 font-bold group-hover:translate-x-0.5 transition-transform">
                          查看节点 →
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* 5. 词条详情抽屉 Modal */}
      {selectedEntry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setSelectedEntry(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-3xl border border-slate-700 bg-[#0f172a] p-6 sm:p-8 space-y-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedEntry(null)}
              aria-label="关闭详情"
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-2xl bg-slate-950 border border-slate-700 p-2 flex items-center justify-center shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedEntry.icon}
                  alt={selectedEntry.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/wiki-assets/占位图.png';
                  }}
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                      (RARITY_STYLES[selectedEntry.rarity] || RARITY_STYLES.COMMON)
                        .badge
                    }`}
                  >
                    {selectedEntry.edition ||
                      selectedEntry.subcategory ||
                      selectedEntry.rarity}
                  </span>
                  {selectedEntry.tier && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40">
                      {selectedEntry.tier}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-black text-white">
                  {selectedEntry.name}
                </h2>
                {selectedEntry.attributes.synergy && (
                  <p className="text-xs text-amber-300 font-semibold">
                    🔗 {selectedEntry.attributes.synergy}
                  </p>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 text-sm text-slate-200 leading-relaxed">
              {selectedEntry.summary}
            </div>

            {/* Milestones / Star & Forge Progression */}
            {selectedEntry.attributes.milestones &&
              selectedEntry.attributes.milestones.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>星级 / 神铸 / 觉醒关键质变节点</span>
                  </h3>
                  <div className="space-y-2.5">
                    {selectedEntry.attributes.milestones.map((ms, idx) => (
                      <div
                        key={idx}
                        className={`rounded-2xl p-3.5 border ${
                          ms.isKeyNode
                            ? 'bg-orange-500/10 border-orange-500/40'
                            : 'bg-slate-900/60 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-black text-white">
                            {ms.stage}
                          </span>
                          {ms.isKeyNode && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500 text-slate-950">
                              🌟 关键质变点
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {ms.effect}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Acquisition & Tags */}
            <div className="rounded-2xl bg-slate-950/80 border border-slate-800/80 p-4 space-y-2 text-xs">
              {selectedEntry.attributes.acquisition && (
                <div className="flex items-start gap-2">
                  <span className="text-slate-400 shrink-0 font-bold">
                    获取途径:
                  </span>
                  <span className="text-slate-200">
                    {selectedEntry.attributes.acquisition}
                  </span>
                </div>
              )}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedEntry.tags.map((t, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Action Links */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/calculator"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>查看养成消耗矩阵</span>
                </Link>
                {selectedEntry.relatedArticleSlugs?.[0] && (
                  <Link
                    href={`/strategies/${selectedEntry.relatedArticleSlugs[0]}`}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/40 text-orange-300 text-xs font-bold transition-all"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>阅读关联深度攻略</span>
                  </Link>
                )}
              </div>

              <button
                onClick={() => setSelectedEntry(null)}
                className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      <FooterSection />
    </div>
  );
}
