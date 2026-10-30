import type { Metadata } from 'next';
import WikiCategoryPageClient from '@/components/wiki/WikiCategoryPageClient';
import { getNormalizedWikiEntries } from '@/lib/wiki-server';

export const metadata: Metadata = {
  title: '消耗品图鉴 | 弹壳特攻队 Wiki 知识库',
  description: '《弹壳特攻队》核心、钥匙、碎片、宝箱、石头、图纸与材料图鉴。',
};

export default async function MechanicCategoryPage() {
  const entries = await getNormalizedWikiEntries();
  return <WikiCategoryPageClient categoryKey="MECHANIC" initialEntries={entries} />;
}

