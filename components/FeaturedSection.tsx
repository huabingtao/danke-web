"use client";

import Image from 'next/image';
import { ExternalLink, ArrowRight, ShieldCheck, Flame, BookMarked, Sparkles } from 'lucide-react';
import { FEATURED_STRATEGY, MUST_READ_STRATEGIES, StrategyArticle } from '@/lib/local-strategies-data';

interface FeaturedSectionProps {
  featuredArticle?: StrategyArticle;
  mustReadArticles?: StrategyArticle[];
  onSelectArticle?: (article: StrategyArticle) => void;
}

export default function FeaturedSection({
  featuredArticle,
  mustReadArticles,
  onSelectArticle,
}: FeaturedSectionProps) {
  const featured = featuredArticle || FEATURED_STRATEGY;
  const mustReads = mustReadArticles && mustReadArticles.length > 0 ? mustReadArticles : MUST_READ_STRATEGIES;

  const handleCardClick = (article: StrategyArticle) => {
    if (article.slug) {
      onSelectArticle?.(article);
    } else if (article.externalUrl) {
      window.open(article.externalUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className="mb-10 sm:mb-12">
      {/* 桌面端左右两列布局 (左7:右5)，移动端自适应上下堆叠 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
        {/* 左侧：本期重点攻略（单篇手动指定，较宽，不做轮播） */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="flex items-center space-x-2 mb-2.5">
            <Flame className="w-4 h-4 text-orange-400" />
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
              置顶
            </h2>
          </div>

          <div
            onClick={() => handleCardClick(featured)}
            className="flex-1 group relative rounded-3xl overflow-hidden bg-slate-900/80 border border-slate-700/80 hover:border-orange-500/60 shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
          >
            {/* 封面图片容器 (控制高度，避免挤占内容) */}
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/10] bg-slate-950 overflow-hidden">
              {featured.coverImage ? (
                <Image
                  src={featured.coverImage}
                  alt={featured.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-slate-900 via-orange-950/40 to-slate-900 flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-orange-400/40" />
                </div>
              )}

              {/* 蒙层渐变 */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* 顶部标签 */}
              <div className="absolute top-3.5 left-3.5 flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-xl bg-orange-500 text-slate-950 text-xs font-black shadow-md">
                  {featured.categoryLabel}
                </span>
                {featured.gameVersion && (
                  <span className="px-2 py-0.5 rounded-lg bg-slate-900/90 text-slate-300 text-[11px] font-semibold border border-slate-700 backdrop-blur-md">
                    版本 {featured.gameVersion}
                  </span>
                )}
              </div>
            </div>

            {/* 底部信息区 */}
            <div className="p-5 sm:p-6 space-y-3 bg-gradient-to-b from-slate-950/80 to-slate-900">
              <h3 className="text-base sm:text-xl font-black text-white group-hover:text-orange-400 transition-colors leading-snug line-clamp-2">
                {featured.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
                {featured.summary}
              </p>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center space-x-3">
                  <span>发布：{featured.publishedAt}</span>
                  {featured.updatedAt && (
                    <span className="text-orange-400/80 hidden sm:inline">
                      更新：{featured.updatedAt}
                    </span>
                  )}
                </div>

                <span className="inline-flex items-center space-x-1 text-orange-400 font-bold group-hover:translate-x-1 transition-transform">
                  <span>阅读全文</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：攻略精选（4篇核心推荐，紧凑排布） */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="flex items-center space-x-2 mb-2.5">
            <BookMarked className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
              攻略精选
            </h2>
          </div>

          <div className="flex-1 flex flex-col justify-between space-y-2.5">
            {mustReads.map((article) => (
              <div
                key={article.id}
                onClick={() => handleCardClick(article)}
                className="group p-3 sm:p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/50 transition-all duration-200 cursor-pointer overflow-hidden"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-bold text-amber-400/90 shrink-0">
                      {article.tags && article.tags[0] ? article.tags[0] : '攻略精选'}
                    </span>
                    {article.gameVersion && (
                      <span className="text-[10px] text-slate-500 hidden sm:inline">
                        · {article.gameVersion}
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-amber-300 transition-colors truncate">
                    {article.title}
                  </h4>

                  <p className="text-[11px] text-slate-400 truncate hidden sm:block leading-relaxed">
                    {article.summary ? article.summary.replace(/[\r\n\t]+/g, ' ').trim() : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
