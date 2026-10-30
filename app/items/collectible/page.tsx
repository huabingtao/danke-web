import type { Metadata } from 'next';
import WikiCategoryPageClient from '@/components/wiki/WikiCategoryPageClient';
import { getNormalizedWikiEntries } from '@/lib/wiki-server';

export const metadata: Metadata = {
  title: '收藏品图鉴 | 弹壳特攻队 Wiki 知识库',
  description: '《弹壳特攻队》1~10期红/金收藏品暴击率与暴伤词条图鉴。',
};

export default async function CollectibleCategoryPage() {
  const entries = await getNormalizedWikiEntries();
  return <WikiCategoryPageClient categoryKey="COLLECTIBLE" initialEntries={entries} />;
}

