import type { Metadata } from 'next';
import WikiEncyclopediaClient from '@/components/WikiEncyclopediaClient';
import { fetchWikiEntries } from '@/lib/api';
import {
  LOCAL_WIKI_ENTRIES,
  LOCAL_HANDBOOK_GUIDES,
} from '@/lib/local-wiki-data';

export const metadata: Metadata = {
  title: '百科图鉴中心 | 弹壳特攻队 Wiki 知识库',
  description:
    '《弹壳特攻队》全量结构化百科图鉴：查询 SP/S特工档案、SS神装合成与神炼节点、1~10期暴击率/暴伤收藏品、S宠物幽暗之灵与助战技能、双生配件谐振、载具零件与局内Debuff词条。',
};

export default async function ItemsPage() {
  let entries = LOCAL_WIKI_ENTRIES;
  try {
    const remote = await fetchWikiEntries();
    if (remote && remote.length > 0) {
      entries = remote;
    }
  } catch {
    entries = LOCAL_WIKI_ENTRIES;
  }

  return (
    <WikiEncyclopediaClient
      initialEntries={entries}
      handbookGuides={LOCAL_HANDBOOK_GUIDES}
    />
  );
}
