"use client";

import TopNavBar from '@/components/TopNavBar';
import FooterSection from '@/components/FooterSection';
import ToolZone from '@/components/home/ToolZone';
import WikiCategoryZone, { CategorySummaryItem } from '@/components/home/WikiCategoryZone';
import { ArrowUp } from 'lucide-react';

interface HomePageClientProps {
  categoriesData: CategorySummaryItem[];
}

export default function HomePageClient({ categoriesData }: HomePageClientProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1d] text-slate-100 selection:bg-orange-500 selection:text-slate-950">
      {/* 1. Top Navigation Bar */}
      <TopNavBar width="wide" />

      {/* 2. Main Content: Core Functional Zones (Uniform Box Sizing) */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7 pb-12 space-y-8 sm:space-y-12">
        {/* Zone 1: 弹壳工具 */}
        <ToolZone />

        {/* Zone 2: 图鉴分类 (含伤害词条) */}
        <WikiCategoryZone categoriesData={categoriesData} />
      </main>

      {/* 3. Footer */}
      <FooterSection width="wide" />

      {/* 4. Floating Back to Top Button */}
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
