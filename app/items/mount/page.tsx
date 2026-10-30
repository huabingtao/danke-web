import type { Metadata } from 'next';
import WikiCategoryPageClient from '@/components/wiki/WikiCategoryPageClient';
import { getNormalizedWikiEntries } from '@/lib/wiki-server';

export const metadata: Metadata = {
  title: '载具图鉴 | 弹壳特攻队 Wiki 知识库',
  description: '《弹壳特攻队》载具图鉴。',
};

export default async function MountCategoryPage() {
  const entries = await getNormalizedWikiEntries();
  return <WikiCategoryPageClient categoryKey="MOUNT" initialEntries={entries} />;
}

