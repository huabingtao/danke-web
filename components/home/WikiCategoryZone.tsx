"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ZoneHeader from './ZoneHeader';
import { WIKI_CATEGORIES, WikiCategoryKey } from '@/lib/wiki-categories';

export interface CategorySummaryItem {
  key: WikiCategoryKey;
  count: number;
  sampleIcons: string[];
}

interface WikiCategoryZoneProps {
  categoriesData: CategorySummaryItem[];
}

const DAMAGE_STAT_TILES = [
  { label: '暴击率', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  { label: '暴伤加成', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
  { label: '独立易伤', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
  { label: '全体生效', color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' },
];

export default function WikiCategoryZone({ categoriesData }: WikiCategoryZoneProps) {
  return (
    <section className="space-y-3">
      <ZoneHeader
        id="zone-wiki"
        title="图鉴分类"
        viewAllText="进入物品图鉴"
        viewAllHref="/items"
      />

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {WIKI_CATEGORIES.map((catDef) => {
          const isDamageStat = catDef.key === 'DAMAGE_STAT';
          const data = categoriesData.find((d) => d.key === catDef.key);
          const sampleIcons = data?.sampleIcons ?? [];
          const targetHref = catDef.linkHref || `/items?cat=${catDef.key}`;

          return (
            <Link
              key={catDef.key}
              href={targetHref}
              className="block focus:outline-none"
              aria-label={`${catDef.label}图鉴`}
            >
              <div
                className={`group relative w-full aspect-square rounded-3xl bg-gradient-to-br ${catDef.gradient} p-4 sm:p-5 flex flex-col justify-between border border-slate-800 hover:border-orange-500/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-orange-500/10 cursor-pointer overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500`}
              >
                {/* Header: 仅保留小标题，去除左侧不准确图标与右侧条数，与下方内容留出 5px 间隔 */}
                <div className="flex items-center mb-[5px] shrink-0">
                  <span className={`text-xs sm:text-sm font-bold ${catDef.color}`}>
                    {catDef.label}
                  </span>
                </div>

                {/* Center Content: 2x2 Grid，与外层边框及底栏保持合理间距 */}
                {isDamageStat ? (
                  <div className="flex-1 min-h-0 grid grid-cols-2 grid-rows-2 gap-2.5 sm:gap-3 p-2.5 sm:p-3 mb-2.5 bg-slate-950/45 rounded-2xl border border-slate-800/50">
                    {DAMAGE_STAT_TILES.map((stat, idx) => (
                      <div
                        key={idx}
                        className={`rounded-xl border flex flex-col items-center justify-center p-1 group-hover:scale-105 transition-transform ${stat.color}`}
                      >
                        <span className="text-xs sm:text-sm font-extrabold tracking-tight">
                          {stat.label}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 min-h-0 grid grid-cols-2 grid-rows-2 gap-2.5 sm:gap-3 p-2.5 sm:p-3 mb-2.5 bg-slate-950/45 rounded-2xl border border-slate-800/50">
                    {sampleIcons.slice(0, 4).map((iconUrl, idx) => (
                      <div
                        key={idx}
                        className="relative rounded-xl bg-slate-900/80 border border-slate-700/40 overflow-hidden flex items-center justify-center p-1"
                      >
                        {iconUrl ? (
                          <Image
                            src={iconUrl}
                            alt=""
                            fill
                            sizes="(max-width: 640px) 25vw, 100px"
                            className="object-contain p-1.5 group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : null}
                      </div>
                    ))}
                    {sampleIcons.length < 4 &&
                      Array.from({ length: 4 - sampleIcons.length }).map((_, idx) => (
                        <div
                          key={`empty-${idx}`}
                          className="rounded-xl bg-slate-900/40 border border-dashed border-slate-800 flex items-center justify-center"
                        />
                      ))}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60 font-semibold shrink-0">
                  <span className="line-clamp-1 pr-1 text-slate-400">
                    {catDef.description}
                  </span>
                  <span className="text-orange-400 shrink-0 flex items-center font-bold group-hover:translate-x-0.5 transition-transform">
                    <span>{isDamageStat ? '速查' : '进入'}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
