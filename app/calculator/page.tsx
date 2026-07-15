import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '弹壳特攻队战力与伤害计算器 | 弹壳特攻队攻略中心',
  description: '输入您的攻击力、暴击率、装备系数和配件类型，模拟计算《弹壳特攻队》特工的技能秒伤与局内爆发。',
};

export default function CalculatorPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6">
      <div className="border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md rounded-3xl p-8 text-center space-y-4 hover:border-amber-500/20 transition-all duration-300">
        <h1 className="text-3xl font-extrabold text-zinc-100 sm:text-4xl">
          特工面板伤害计算器
        </h1>
        <p className="text-zinc-400 max-w-lg mx-auto">
          输入您的特工战力面板参数，本工具将自动结合技能属性（Stats JSON 数据）模拟伤害公式，计算局内各类武器与配件的实战 DPS 期望值。
        </p>
        <div className="inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold bg-amber-950/20 text-amber-400 border border-amber-500/20">
          ⏳ 功能模块开发中，敬请期待...
        </div>
      </div>
    </div>
  );
}
