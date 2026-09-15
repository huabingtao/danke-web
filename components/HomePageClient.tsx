"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TopNavBar from '@/components/TopNavBar';
import GuideSearchSection from '@/components/GuideSearchSection';
import FeaturedSection from '@/components/FeaturedSection';
import HomeToolsSection from '@/components/HomeToolsSection';
import LatestStrategiesSection from '@/components/LatestStrategiesSection';
import FooterSection from '@/components/FooterSection';
import { StrategyArticle } from '@/lib/local-strategies-data';
import { ArrowUp } from 'lucide-react';

interface HomePageClientProps {
  initialArticles: StrategyArticle[];
}

export default function HomePageClient({ initialArticles }: HomePageClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [articles] = useState<StrategyArticle[]>(initialArticles);

  const scrollToSection = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleArticleClick = (article: StrategyArticle) => {
    if (article.slug) {
      router.push(`/strategies/${article.slug}`);
    } else if (article.externalUrl) {
      window.open(article.externalUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // 纯图文深度攻略（彻底剔除视频与日历）
  const strategyArticles = articles.filter(
    (a) => a.category !== 'video' && a.category !== 'reminder'
  );

  // 1. 置顶重磅攻略（优先置顶月殇护手神炼或最新深度图文攻略，杜绝日历与视频抢占置顶）
  const featuredArticle =
    strategyArticles.find((a) => a.slug === 'pub-20260911-2247486319') ||
    strategyArticles[0] ||
    articles[0];

  // 2. 新手必读：4篇用户指定的高价值核心次要攻略
  const MUST_READ_SLUGS = [
    'pub-20260831-2247486070', // 高频问答第一弹
    'pub-20260910-1000000149', // S特工伊狑
    'pub-20260818-2247485796', // S宠物培养全指南
    'pub-20260912-1000000157', // 高频问答第二弹
  ];
  const mustReadArticles = MUST_READ_SLUGS.map((slug) =>
    strategyArticles.find((a) => a.slug === slug)
  ).filter(Boolean) as StrategyArticle[];

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1d] text-slate-100 selection:bg-orange-500 selection:text-slate-950">
      {/* 1. 顶部紧凑导航 */}
      <TopNavBar onNavigateTo={scrollToSection} />

      {/* 主体内容容器 */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2. 页面引导与搜索区 */}
        <GuideSearchSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* 3. 本期重点攻略与新玩家必读 */}
        <FeaturedSection
          featuredArticle={featuredArticle}
          mustReadArticles={mustReadArticles}
          onSelectArticle={handleArticleClick}
        />

        {/* [预留插槽] 常用工具模块 */}
        <HomeToolsSection availableTools={[]} />

        {/* 4. 最新深度攻略列表（纯图文精算，已完全剥离日历与视频） */}
        <LatestStrategiesSection
          articles={strategyArticles}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
          onSelectArticle={handleArticleClick}
        />
      </main>

      {/* 5. 结构化页脚 */}
      <FooterSection />

      {/* 返回顶部浮动按钮 */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 w-11 h-11 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-orange-400 hover:text-white hover:bg-orange-500 hover:border-transparent flex items-center justify-center transition-all duration-300 shadow-2xl cursor-pointer z-40 group"
        title="返回顶部"
        aria-label="返回顶部"
      >
        <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
      </button>
    </div>
  );
}
