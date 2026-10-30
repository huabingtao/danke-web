import { Suspense } from 'react';
import type { Metadata } from 'next';
import WikiHubClient from '@/components/WikiHubClient';

export const metadata: Metadata = {
  title: '伤害词条图鉴 | 弹壳特攻队 Wiki 知识库',
  description: '《弹壳特攻队》暴击率、暴击伤害、独立易伤与全体生效属性速查。',
};

export default function DamageStatCategoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0f1d] p-8 text-center text-slate-400">加载伤害词条中...</div>}>
      <WikiHubClient />
    </Suspense>
  );
}

