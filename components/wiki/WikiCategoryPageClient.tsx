"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ArrowLeft, Layers } from 'lucide-react';
import TopNavBar from '@/components/TopNavBar';
import FooterSection from '@/components/FooterSection';
import { WikiEntryItem } from '@/lib/local-wiki-data';
import { WIKI_CATEGORIES, WikiCategoryKey } from '@/lib/wiki-categories';
import { filterWikiEntries } from '@/lib/wiki-helpers';
import WikiEntryCard from './WikiEntryCard';
import WikiEntryDetailModal from './WikiEntryDetailModal';
import WikiCategoryFilterBar from './WikiCategoryFilterBar';

interface WikiCategoryPageClientProps {
  categoryKey: Exclude<WikiCategoryKey, 'DAMAGE_STAT'>;
  initialEntries: WikiEntryItem[];
}

export default function WikiCategoryPageClient({
  categoryKey,
  initialEntries,
}: WikiCategoryPageClientProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEdition, setSelectedEdition] = useState<string>('ALL');
  const [quickFilter, setQuickFilter] = useState<string>('ALL');
  const [selectedEntry, setSelectedEntry] = useState<WikiEntryItem | null>(null);

  const catDef =
    WIKI_CATEGORIES.find((c) => c.key === categoryKey) || WIKI_CATEGORIES[0];

  const filteredEntries = useMemo(() => {
    return filterWikiEntries(initialEntries, {
      activeCategory: categoryKey,
      selectedEdition,
      quickFilter,
      searchQuery,
    });
  }, [initialEntries, categoryKey, selectedEdition, quickFilter, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1d] text-slate-100 selection:bg-orange-500 selection:text-slate-950">
      <TopNavBar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
        {/* 1. Category Header & Search */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-800/90 bg-gradient-to-br from-slate-900/95 via-[#111a2e]/95 to-slate-950 p-6 sm:p-8 shadow-2xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Link
                  href="/"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-400 hover:text-orange-400 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>返回首页</span>
                </Link>
                <span className="text-slate-700">/</span>
                <span className="text-xs font-bold text-orange-400">
                  {catDef.label}图鉴
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {catDef.label}图鉴
              </h1>
              {catDef.description && (
                <p className="text-xs sm:text-sm text-slate-300">
                  {catDef.description}
                </p>
              )}
            </div>
          </div>

          {/* Search Input */}
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`在${catDef.label}图鉴中搜索名称、属性或词条...`}
              className="w-full pl-12 pr-20 py-3 rounded-2xl bg-slate-950/90 border border-slate-700/80 focus:border-orange-500 focus:outline-none text-sm text-white placeholder-slate-500 shadow-inner transition-all"
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
        </section>

        {/* 2. Reusable Secondary Filter Bar */}
        <WikiCategoryFilterBar
          activeCategory={categoryKey}
          quickFilter={quickFilter}
          onQuickFilterChange={setQuickFilter}
          selectedEdition={selectedEdition}
          onEditionChange={setSelectedEdition}
        />

        {/* 3. Reusable Entry Cards Grid */}
        <section className="space-y-4">
          {filteredEntries.length === 0 ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-12 text-center space-y-3">
              <p className="text-base font-bold text-slate-300">
                未找到匹配的{catDef.label}词条
              </p>
              <button
                onClick={() => {
                  setSelectedEdition('ALL');
                  setQuickFilter('ALL');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-orange-500 text-slate-950 text-xs font-bold cursor-pointer"
              >
                重置筛选
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

      {/* 4. Reusable Detail Modal */}
      <WikiEntryDetailModal
        selectedEntry={selectedEntry}
        onClose={() => setSelectedEntry(null)}
      />

      <FooterSection />
    </div>
  );
}

