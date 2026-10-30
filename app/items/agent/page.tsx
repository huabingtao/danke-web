import type { Metadata } from 'next';
import WikiCategoryPageClient from '@/components/wiki/WikiCategoryPageClient';
import { getNormalizedWikiEntries } from '@/lib/wiki-server';

export const metadata: Metadata = {
  title: '特工图鉴 | 弹壳特攻队 Wiki 知识库',
  description: '《弹壳特攻队》SP、S、普通特工全量图鉴与全体特工生效属性速查。',
};

export default async function AgentCategoryPage() {
  const entries = await getNormalizedWikiEntries();
  return <WikiCategoryPageClient categoryKey="AGENT" initialEntries={entries} />;
}

