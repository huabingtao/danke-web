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

        {/* 4. Wiki 百科图鉴与核心工具快捷模块 */}
        <HomeToolsSection
          availableTools={[
            {
              id: 'wiki-encyclopedia',
              name: '📚 全量百科图鉴中心 (158+词条)',
              desc: '查询 SP/S特工、SS神装、1-10期红/金收藏品暴击率与暴伤词条、S宠物幽暗之灵及双生配件图鉴。',
              sourceLabel: 'Wiki 核心',
              url: '/items',
            },
            {
              id: 'wiki-progression-calculator',
              name: '🧮 五大养成消耗与节点速查器',
              desc: 'SS神炼5阶段核心表、543/741/840/844特工核心、21/50/90/150异宠核心槽位与阶段差额计算器。',
              sourceLabel: '精算矩阵',
              url: '/calculator',
            },
            {
              id: 'danke-rank',
              name: '🚗 并列发车大厅 & 计时器',
              desc: '活动组队并列毫秒级倒计时与班次预约锁定工具。',
              sourceLabel: '实时工具',
              url: 'https://dankerank.guaguahub.cn',
              isExternal: true,
            },
            {
              id: 'danke-market',
              name: '🛒 欢乐牧场高价卖菜看板',
              desc: '多人并发自主填报与高价卖菜实时匹配看板。',
              sourceLabel: '活动看板',
              url: 'https://dankemarket.guaguahub.cn',
              isExternal: true,
            },
          ]}
        />

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
