"use client";

import { useHomeScrollRestoration } from '@/lib/home-view-state';
import AdSlot from '@/components/AdSlot';
import ToolZone from '@/components/home/ToolZone';
import WikiCategoryZone, { CategorySummaryItem } from '@/components/home/WikiCategoryZone';

interface HomePageClientProps {
  categoriesData: CategorySummaryItem[];
}

export default function HomePageClient({ categoriesData }: HomePageClientProps) {
  const ready = useHomeScrollRestoration();

  return (
    <div className="flex flex-col bg-[#0a0f1d] text-slate-100 selection:bg-orange-500 selection:text-slate-950">
      {/* 1. Top Navigation Bar */}


      {/* 2. Main Content: Core Functional Zones (Uniform Box Sizing) */}
      <main style={{ visibility: ready ? 'visible' : 'hidden' }} className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7 pb-12 space-y-8 sm:space-y-12">
        {/* Zone 1: 弹壳工具 */}
        <ToolZone />
        <AdSlot slot="home-between-sections" />

        {/* Zone 2: 图鉴分类 (含伤害词条) */}
        <WikiCategoryZone categoriesData={categoriesData} />
      </main>

      {/* 3. Footer */}


      {/* 4. Floating Back to Top Button */}

    </div>
  );
}
