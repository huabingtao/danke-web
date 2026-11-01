"use client";
import ReturnHome from '@/components/ReturnHome';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import GuideSearchSection from '@/components/GuideSearchSection';
import LatestStrategiesSection from '@/components/LatestStrategiesSection';
import { StrategyArticle } from '@/lib/local-strategies-data';

interface StrategyLibraryClientProps {
  initialArticles: StrategyArticle[];
}

export default function StrategyLibraryClient({ initialArticles }: StrategyLibraryClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '');
  const [activeCategory, setActiveCategory] = useState(() => searchParams.get('cat') || 'all');
  const [articles] = useState<StrategyArticle[]>(initialArticles);


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
    <div className="flex flex-col bg-[#0a0f1d] text-slate-100 selection:bg-orange-500 selection:text-slate-950">


      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <ReturnHome />
        {initialArticles.length === 0 ? (
          <section className="mx-auto mt-0 mb-8 w-full rounded-3xl border border-slate-800 bg-slate-900/60 p-10 text-center">
            <h1 className="text-2xl font-black text-white">攻略内容建设中</h1>


          </section>
        ) : (
          <>
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
          </>
        )}
      </main>



      {/* Back to top */}

    </div>
  );
}
