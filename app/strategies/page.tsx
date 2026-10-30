import { Suspense } from 'react';
import type { Metadata } from 'next';
import StrategyLibraryClient from '@/components/StrategyLibraryClient';
import { loadStrategies } from '@/lib/strategy-loader';

export const metadata: Metadata = {
  title: '战术攻略库 | 弹壳特攻队 Wiki 知识库',
  description: '《弹壳特攻队》全量战术攻略库：活动精算、特工评测、装备神炼、高频问答与版本爆料。',
};

export default async function StrategiesPage() {
  const articles = await loadStrategies();

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0f1d] p-8 text-center text-slate-400">加载攻略库中...</div>}>
      <StrategyLibraryClient initialArticles={articles} />
    </Suspense>
  );
}

