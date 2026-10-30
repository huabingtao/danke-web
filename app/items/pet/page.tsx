import type { Metadata } from 'next';
import WikiCategoryPageClient from '@/components/wiki/WikiCategoryPageClient';
import { getNormalizedWikiEntries } from '@/lib/wiki-server';

export const metadata: Metadata = {
  title: '宠物图鉴 | 弹壳特攻队 Wiki 知识库',
  description: '《弹壳特攻队》S级与普通战术宠物图鉴，包含幽暗之灵、加肥喵等天赋技能、觉醒星级与助战技能池全览。',
};

export default async function PetCategoryPage() {
  const entries = await getNormalizedWikiEntries();
  return <WikiCategoryPageClient categoryKey="PET" initialEntries={entries} />;
}

