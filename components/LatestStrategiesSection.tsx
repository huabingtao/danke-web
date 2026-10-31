"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, Calendar, Tag, Sparkles, FilterX, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { StrategyArticle } from '@/lib/local-strategies-data';

interface LatestStrategiesSectionProps {
  articles: StrategyArticle[];
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  searchQuery: string;
  onClearSearch: () => void;
  onSelectArticle?: (article: StrategyArticle) => void;
}

const CATEGORY_TABS = [
  { id: 'all', label: '全部' },
  { id: 'event', label: '活动精算' },
  { id: 'agent', label: '特工评测' },
  { id: 'resources', label: '装备养成' },
  { id: 'faq', label: '避坑指南' },
];

const PAGE_SIZE = 20;

export default function LatestStrategiesSection({
  articles,
  activeCategory,
  onCategoryChange,
  searchQuery,
  onClearSearch,
  onSelectArticle,
}: LatestStrategiesSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // 基础攻略集合（彻底筛除过滤掉每日提醒/日历与实机录像视频，保持攻略专区 100% 纯粹图文深度精算）
  const strategyOnlyArticles = articles.filter(
    (item) => {
      // Metadata-enabled Creator articles explicitly opt into the website channel.
      if (item.contentType) return true;
      return item.category !== 'reminder' &&
        item.category !== 'video' &&
        item.categoryLabel !== '每日日历' &&
        item.categoryLabel !== '提醒' &&
        item.tag !== '提醒' &&
        !item.title.includes('日历') &&
        !item.title.includes('每日事项') &&
        !item.title.includes('每日提醒');
    },
  );
  const dynamicCategoryTabs = Array.from(
    new Map(
      strategyOnlyArticles
        .filter((article) => article.contentType && !CATEGORY_TABS.some((tab) => tab.id === article.category))
        .map((article) => [article.category, article.categoryLabel] as const),
    ),
    ([id, label]) => ({ id, label }),
  );
  const categoryTabs = [...CATEGORY_TABS, ...dynamicCategoryTabs];

  // 综合过滤：分类 + 关键词搜索
  const filteredArticles = strategyOnlyArticles.filter((item) => {
    // 分类匹配
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    if (!matchesCategory) return false;

    // 搜索匹配 (标题、摘要、标签)
    if (!searchQuery.trim()) return true;
    const query = searchQuery.trim().toLowerCase();
    const inTitle = item.title.toLowerCase().includes(query);
    const inSummary = item.summary.toLowerCase().includes(query);
    const inTags = Array.isArray(item.tags) && item.tags.some((t) => t.toLowerCase().includes(query));
    return inTitle || inSummary || inTags;
  });

  // 当切换分类或搜索条件时，重置回第 1 页
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  const totalPages = Math.ceil(filteredArticles.length / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      const el = document.getElementById('latest-strategies');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleArticleClick = (article: StrategyArticle) => {
    // 优先进入网站内嵌的深度战术详情页进行全量阅读，杜绝外跳
    if (article.slug && onSelectArticle) {
      onSelectArticle(article);
    } else if (article.externalUrl) {
      window.open(article.externalUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const resetAllFilters = () => {
    onCategoryChange('all');
    onClearSearch();
    setCurrentPage(1);
  };

  // 生成智能页码列表（最多展示5个邻近页码及首末页）
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <section id="latest-strategies" className="mb-14 sm:mb-16 space-y-5">
      {/* 头部：标题、筛选 Tabs 与重置入口 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-2 border-b border-slate-800/80">
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-6 rounded-full bg-orange-500" />
          <h2 className="text-lg sm:text-xl font-black text-white tracking-wide">
            攻略文章
          </h2>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            共收录 {strategyOnlyArticles.length} 篇精选攻略
          </span>
        </div>

        {/* 分类筛选 Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
          {categoryTabs.map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onCategoryChange(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-orange-500 text-slate-950 font-black shadow-md shadow-orange-500/20'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            );
          })}

          {(activeCategory !== 'all' || searchQuery) && (
            <button
              onClick={resetAllFilters}
              className="text-xs text-slate-400 hover:text-orange-400 px-2 py-1.5 rounded-lg flex items-center space-x-1 shrink-0 ml-1 transition-colors cursor-pointer"
              title="重置筛选"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重置筛选</span>
            </button>
          )}
        </div>
      </div>

      {/* 攻略列表：紧凑图文卡片 (小封面 + 标题 + 摘要 + 分类 + 真实发布日期) */}
      {paginatedArticles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => handleArticleClick(article)}
                className="group p-3.5 sm:p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-orange-500/50 hover:bg-slate-800/40 transition-all duration-200 flex gap-3.5 sm:gap-4 items-center cursor-pointer"
              >
                {/* 小封面容器 (手机端限制宽度，优先保障标题可读性) */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                  {article.coverImage ? (
                    <Image
                      src={article.coverImage}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center text-slate-600">
                      <Sparkles className="w-6 h-6" />
                    </div>
                  )}
                  {/* 悬停微光遮罩 */}
                  <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/10 transition-colors pointer-events-none" />
                </div>

                {/* 右侧主文字内容 */}
                <div className="flex-1 min-w-0 flex flex-col justify-between h-full space-y-1.5">
                  {/* 顶部标签行：分类/Tag、适用版本 */}
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span className="px-2 py-0.5 rounded-md bg-orange-500/15 text-orange-400 text-[10px] font-bold border border-orange-500/30">
                      {(article.tag || article.categoryLabel).replace(/\([a-zA-Z-]+\)/g, '')}
                    </span>
                    {article.gameVersion && (
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-semibold border border-slate-700/60">
                        {article.gameVersion}
                      </span>
                    )}
                  </div>

                  {/* 标题 */}
                  <h3 className="text-xs sm:text-sm font-black text-slate-100 group-hover:text-orange-400 transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h3>

                  {/* 一句话介绍 */}
                  <p className="text-[11px] text-slate-400 line-clamp-1 leading-relaxed">
                    {article.summary}
                  </p>

                  {/* 底部信息：真实发布日期、更新时间与直达本地详情 */}
                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{article.publishedAt}</span>
                      {article.updatedAt && (
                        <span className="text-orange-400/80 hidden sm:inline ml-1">
                          (更新: {article.updatedAt})
                        </span>
                      )}
                    </span>

                    <span className="text-orange-400 font-bold inline-flex items-center space-x-0.5 group-hover:translate-x-0.5 transition-transform">
                      <span>阅读</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 战术硬核风格数字分页器 */}
          {totalPages > 1 && (
            <div className="pt-6 pb-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/60">
              <span className="text-xs text-slate-400">
                显示第 <span className="text-slate-200 font-bold">{startIndex + 1}</span> - <span className="text-slate-200 font-bold">{Math.min(startIndex + PAGE_SIZE, filteredArticles.length)}</span> 篇，共 <span className="text-orange-400 font-bold">{filteredArticles.length}</span> 篇攻略
              </span>

              <div className="flex items-center space-x-1.5">
                {/* 上一页 */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/80 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center space-x-1 cursor-pointer"
                  aria-label="上一页"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">上一页</span>
                </button>

                {/* 页码列表 */}
                {getPageNumbers().map((p, idx) => {
                  if (p === '...') {
                    return (
                      <span key={`ellipsis-${idx}`} className="px-2 text-slate-600 text-xs select-none">
                        ...
                      </span>
                    );
                  }
                  const isCurrent = p === currentPage;
                  return (
                    <button
                      key={`page-${p}`}
                      onClick={() => handlePageChange(p as number)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                        isCurrent
                          ? 'bg-orange-500 text-slate-950 font-black shadow-md shadow-orange-500/20'
                          : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}

                {/* 下一页 */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/80 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center space-x-1 cursor-pointer"
                  aria-label="下一页"
                >
                  <span className="hidden sm:inline">下一页</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        /* 清晰明确的空状态 */
        <div className="py-14 text-center rounded-3xl bg-slate-900/40 border border-slate-800/80 p-8 space-y-3">
          <FilterX className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">未找到相关攻略</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? `未找到与 “${searchQuery}” 匹配的文章内容，请尝试精简关键字。`
              : `当前分类下暂无已收录文章。`}
          </p>
          <button
            onClick={resetAllFilters}
            className="mt-2 inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重置筛选条件</span>
          </button>
        </div>
      )}
    </section>
  );
}
