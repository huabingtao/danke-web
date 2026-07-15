import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '月度资产产出明细 | 弹壳特攻队攻略中心',
  description: '统计《弹壳特攻队》每月在日常挑战、周常箱子和限时活动中获得的宝石、S钥匙与装备产出数据。',
};

export default function YieldsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6">
      <div className="border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md rounded-3xl p-8 text-center space-y-4 hover:border-orange-500/20 transition-all duration-300">
        <h1 className="text-3xl font-extrabold text-zinc-100 sm:text-4xl">
          资产产出统计看板
        </h1>
        <p className="text-zinc-400 max-w-lg mx-auto">
          在这里，您可以选择特定的年份与月份，系统将自动汇总当月的物品产出，并支持针对公众号、小红书排版的“自媒体截图优化模式”。
        </p>
        <div className="inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold bg-orange-950/20 text-orange-400 border border-orange-500/20">
          ⏳ 功能模块开发中，敬请期待...
        </div>
      </div>
    </div>
  );
}
