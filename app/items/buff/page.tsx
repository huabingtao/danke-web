import type { Metadata } from 'next';
import WikiCategoryPageClient from '@/components/wiki/WikiCategoryPageClient';
import { getNormalizedWikiEntries } from '@/lib/wiki-server';

export const metadata: Metadata = {
  title: '战斗Buff图鉴 | 弹壳特攻队 Wiki 知识库',
  description: '《弹壳特攻队》局内战斗异常状态、属性增减益与控制状态图鉴。',
};

export default async function BuffCategoryPage() {
  const entries = await getNormalizedWikiEntries();
  return <WikiCategoryPageClient categoryKey="BUFF" initialEntries={entries} />;
}

