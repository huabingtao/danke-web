import type { Metadata } from 'next';
import WikiCategoryPageClient from '@/components/wiki/WikiCategoryPageClient';
import { getNormalizedWikiEntries } from '@/lib/wiki-server';

export const metadata: Metadata = {
  title: '装备图鉴 | 弹壳特攻队 Wiki 知识库',
  description: '《弹壳特攻队》SS创世神装合成顺位、神炼节点与S级装备图鉴。',
};

export default async function EquipmentCategoryPage() {
  const entries = await getNormalizedWikiEntries();
  return <WikiCategoryPageClient categoryKey="EQUIPMENT" initialEntries={entries} />;
}

