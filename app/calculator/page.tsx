import type { Metadata } from 'next';
import ProgressionCalculatorClient from '@/components/ProgressionCalculatorClient';
import { fetchProgressionMatrices } from '@/lib/api';
import { LOCAL_PROGRESSION_MATRICES } from '@/lib/local-wiki-data';

export const metadata: Metadata = {
  title: '养成消耗与节点速查器 | 弹壳特攻队 Wiki 知识库',
  description:
    '《弹壳特攻队》五大养成消耗与优先级矩阵：SS装备合成顺位与神炼核心五阶段表、543/741/840/844特工核心节点、11~162异宠核心槽位解锁表、1~10期收藏品暴击/红藏优先级及核心差额速算器。',
};

export default async function CalculatorPage() {
  let matrices = LOCAL_PROGRESSION_MATRICES;
  try {
    const remote = await fetchProgressionMatrices();
    if (remote && remote.length > 0) {
      matrices = remote;
    }
  } catch {
    matrices = LOCAL_PROGRESSION_MATRICES;
  }

  return <ProgressionCalculatorClient initialMatrices={matrices} />;
}
