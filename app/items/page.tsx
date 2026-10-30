import { Suspense } from 'react';
import type { Metadata } from 'next';
import WikiEncyclopediaClient from '@/components/WikiEncyclopediaClient';
import { LOCAL_HANDBOOK_GUIDES } from '@/lib/local-wiki-data';
import { getNormalizedWikiEntries } from '@/lib/wiki-server';

export const metadata: Metadata = {
  title: '百科图鉴中心 | 弹壳特攻队 Wiki 知识库',
  description:
    '《弹壳特攻队》全量结构化百科图鉴：查询 SP/S特工档案、SS神装合成与神炼节点、1~10期暴击率/暴伤收藏品、S宠物幽暗之灵与助战技能、双生配件谐振、载具零件与局内Debuff词条。',
};

export default async function ItemsPage() {
  const entries = await getNormalizedWikiEntries();

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0f1d] p-8 text-center text-slate-400">加载图鉴中...</div>}>
      <WikiEncyclopediaClient
        initialEntries={entries}
        handbookGuides={LOCAL_HANDBOOK_GUIDES}
      />
    </Suspense>
  );
}
