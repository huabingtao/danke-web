import type { Metadata } from 'next';
import WikiCategoryPageClient from '@/components/wiki/WikiCategoryPageClient';
import { getNormalizedWikiEntries } from '@/lib/wiki-server';

export const metadata: Metadata = {
  title: '配件图鉴 | 弹壳特攻队 Wiki 知识库',
  description: '《弹壳特攻队》配件图鉴。',
};

export default async function TechPartCategoryPage() {
  const entries = await getNormalizedWikiEntries();
  return <WikiCategoryPageClient categoryKey="TECH_PART" initialEntries={entries} />;
}

