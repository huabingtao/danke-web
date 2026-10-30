"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TopNavBar from '@/components/TopNavBar';
import GuideSearchSection from '@/components/GuideSearchSection';
import LatestStrategiesSection from '@/components/LatestStrategiesSection';
import FooterSection from '@/components/FooterSection';
import { StrategyArticle } from '@/lib/local-strategies-data';
import { ArrowUp } from 'lucide-react';

interface StrategyLibraryClientProps {
  initialArticles: StrategyArticle[];
}

export default function StrategyLibraryClient({ initialArticles }: StrategyLibraryClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '');
  const [activeCategory, setActiveCategory] = useState(() => searchParams.get('cat') || 'all');
  const [articles] = useState<StrategyArticle[]>(initialArticles);

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

  // Pure textual strategies (filter out video & reminder)
  const strategyArticles = articles.filter(
    (a) => a.category !== 'video' && a.category !== 'reminder'
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1d] text-slate-100 selection:bg-orange-500 selection:text-slate-950">
      <TopNavBar width="wide" />

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search & Header */}
        <GuideSearchSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Full Strategies Listing */}
        <LatestStrategiesSection
          articles={strategyArticles}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
          onSelectArticle={handleArticleClick}
        />
      </main>

      <FooterSection width="wide" />

      {/* Back to top */}
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
