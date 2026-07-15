import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '物品属性百科图鉴 | 弹壳特攻队攻略中心',
  description: '查询《弹壳特攻队》中S级武器、杰出装备及精良配件的属性数值、合成公式和技能加成。',
};

export default function ItemsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6">
      <div className="border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md rounded-3xl p-8 text-center space-y-4 hover:border-blue-500/20 transition-all duration-300">
        <h1 className="text-3xl font-extrabold text-zinc-100 sm:text-4xl">
          游戏物品百科图鉴
        </h1>
        <p className="text-zinc-400 max-w-lg mx-auto">
          在这里，您可以快速浏览弹壳特攻队里所有武器和装备的详细属性，包含技能加成、基础伤害系数等，为您的伤害计算提供准确参数。
        </p>
        <div className="inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold bg-blue-950/20 text-blue-400 border border-blue-500/20">
          ⏳ 功能模块开发中，敬请期待...
        </div>
      </div>
    </div>
  );
}
