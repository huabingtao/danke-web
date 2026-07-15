import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '限时活动时间轴 | 弹壳特攻队攻略中心',
  description: '追踪《弹壳特攻队》最新及往期活动持续时间、兑换奖励物品与最大化资源收益攻略。',
};

export default function EventsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6">
      <div className="border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md rounded-3xl p-8 text-center space-y-4 hover:border-purple-500/20 transition-all duration-300">
        <h1 className="text-3xl font-extrabold text-zinc-100 sm:text-4xl">
          游戏限时活动时间轴
        </h1>
        <p className="text-zinc-400 max-w-lg mx-auto">
          在这里，您可以追踪游戏内正在进行和已结束的节日/庆典活动时间轴，点击可查看活动的任务列表以及最优兑换路线图。
        </p>
        <div className="inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold bg-purple-950/20 text-purple-400 border border-purple-500/20">
          ⏳ 功能模块开发中，敬请期待...
        </div>
      </div>
    </div>
  );
}
