import type { Metadata } from 'next';
import GemValuesClient from '@/components/GemValuesClient';
import ReturnHome from '@/components/ReturnHome';

export const metadata: Metadata = { title: '道具价值 | 弹壳攻略站', description: '按核心、装备、特工、宠物等分类查看弹壳特攻队道具的钻石参考单价。' };

export default function GemValuesPage() {
  return (
    <main className="site-container min-w-0 pb-8 pt-6 sm:pt-8">
      <ReturnHome />
      <GemValuesClient />
    </main>
  );
}
