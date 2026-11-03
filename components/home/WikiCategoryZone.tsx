"use client";

import Image from 'next/image';
import HomeCardLink from './HomeCardLink';
import { useHomeExpanded } from '@/lib/home-view-state';
import { BookOpen, ChevronDown } from 'lucide-react';
import ZoneHeader from './ZoneHeader';
import ConstructionOverlay from './ConstructionOverlay';
import { WIKI_CATEGORIES, WikiCategoryKey } from '@/lib/wiki-categories';

export interface CategorySummaryItem {
  key: WikiCategoryKey;
  count: number;
  sampleIcons: string[];
}

interface WikiCategoryZoneProps {
  categoriesData: CategorySummaryItem[];
}

export default function WikiCategoryZone({ categoriesData }: WikiCategoryZoneProps) {
  const { expanded, toggle: toggleExpanded } = useHomeExpanded();
  const categories = [
    { key: 'STRATEGIES', label: '攻略', href: '/strategies', icon: BookOpen, color: 'text-orange-400', gradient: 'from-orange-500/25 via-amber-950/40 to-slate-950' },
    ...WIKI_CATEGORIES.filter((category) => category.key !== 'DAMAGE_STAT').map((category) => ({
      key: category.key, label: category.label, href: category.linkHref || `/items?cat=${category.key}`,
      icon: category.icon, color: category.color, gradient: category.gradient,
    })),
  ];
  const visibleCategories = expanded ? categories : categories.slice(0, 4);

  return (
    <section className="space-y-3">
      <ZoneHeader id="zone-wiki" title="游戏资料" />
      <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {visibleCategories.map((category) => {
          const sampleIcons = (categoriesData.find((data) => data.key === category.key)?.sampleIcons ?? []).filter(Boolean).slice(0, 4);
          const Icon = category.icon;
          const enlargedPreview = sampleIcons.length > 0;
          return (
            <HomeCardLink key={category.key} href={category.href}
              label={category.key === 'STRATEGIES' ? '攻略' : `${category.label}图鉴`}
              disabledReason={category.key === 'STRATEGIES' ? '建设中，暂不可用' : undefined}
              className="group block rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
              <div className={`relative flex aspect-square w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br ${category.gradient} p-4 shadow-lg transition-all duration-300 sm:p-5 ${category.key !== 'STRATEGIES' ? 'hover:border-orange-500/50 hover:shadow-orange-500/10' : ''}`}>
                {category.key === 'STRATEGIES' && <ConstructionOverlay />}
                <div className={`flex w-full flex-col items-center justify-center gap-4 text-center ${enlargedPreview ? 'sm:h-full sm:min-h-0 sm:gap-4' : 'sm:gap-5'}`}>
                  {/* Compact screens use one large, legible category image. */}
                  <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-slate-700/60 bg-slate-900/90 shadow-xl sm:hidden">
                    {sampleIcons[0] ? (
                      <Image src={sampleIcons[0]} alt="" fill sizes="64px" className="object-contain p-2" />
                    ) : <Icon className={`h-8 w-8 ${category.color}`} />}
                  </div>
                  {/* Wider cards retain the existing image overview. */}
                  {sampleIcons.length > 0 ? (
                    <div className={`hidden w-full grid-cols-2 grid-rows-2 gap-2 rounded-2xl border border-slate-800/50 bg-slate-950/45 p-2 sm:grid ${enlargedPreview ? 'min-h-0 flex-1' : 'h-28 max-w-48'}`}>
                      {sampleIcons.map((src, index) => (
                        <div key={`${src}-${index}`} className="relative min-h-0 overflow-hidden rounded-xl border border-slate-700/40 bg-slate-900/80">
                          <Image src={src} alt="" fill sizes={enlargedPreview ? '(min-width: 1600px) 170px, (min-width: 1024px) 12vw, 16vw' : '80px'} className={enlargedPreview ? 'object-contain p-[8%]' : 'object-contain p-1.5'} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="hidden h-24 w-24 items-center justify-center rounded-3xl border border-slate-700/60 bg-slate-900/90 shadow-xl sm:flex">
                      <Icon className={`h-12 w-12 ${category.color}`} />
                    </div>
                  )}
                  <h3 className={`shrink-0 line-clamp-1 px-1 text-base font-black text-white transition-colors sm:text-lg ${category.key !== 'STRATEGIES' ? 'group-hover:text-orange-400' : ''}`}>{category.label}</h3>
                </div>
              </div>
            </HomeCardLink>
          );
        })}
      </div>
      {categories.length > 4 && (
        <button type="button" onClick={toggleExpanded} aria-expanded={expanded}
          className="mx-auto flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/70 px-5 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:border-orange-500/50 hover:text-orange-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
          {expanded ? '收起分类' : `展开全部分类（${categories.length}类）`}
          <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      )}
    </section>
  );
}
