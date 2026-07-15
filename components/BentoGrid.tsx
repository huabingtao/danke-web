'use client';

import { useState } from 'react';
import Link from 'next/link';

interface BentoGridProps {
  isAdmin: boolean;
}

export default function BentoGrid({ isAdmin }: BentoGridProps) {
  const [screenshotMode, setScreenshotMode] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<'3:4' | '16:9'>('3:4');

  // Sample data to show inside the Monthly Yield Card A
  const mockYield = {
    month: '2026年7月',
    stats: [
      { name: 'S级军备钥匙', amount: 19, unit: '把', desc: '环比上月 +5%', color: 'text-orange-400' },
      { name: '游戏核心宝石', amount: 3800, unit: '颗', desc: '累计挑战与活动产出', color: 'text-amber-400' },
      { name: '随机杰出装备', amount: 1, unit: '件', desc: '周年庆特定兑换', color: 'text-emerald-400' },
      { name: '精良配件箱', amount: 4, unit: '个', desc: '周常任务产出', color: 'text-blue-400' },
    ],
  };

  // Sample stats for the Calculator Card B
  const mockCalc = {
    title: '战力评估面板',
    atk: '125,400',
    crit: '45.8%',
    dps: '12.45M',
  };

  if (screenshotMode) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4 transition-all duration-500 animate-fadeIn">
        {/* Aspect Ratio Selector */}
        <div className="mb-4 flex space-x-2 relative z-10 bg-zinc-900/80 p-1.5 rounded-full border border-zinc-800 backdrop-blur">
          <button
            onClick={() => setAspectRatio('3:4')}
            className={`px-4 py-1 rounded-full text-xs font-semibold transition-all ${
              aspectRatio === '3:4' ? 'bg-orange-500 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            3:4 (小红书/竖屏)
          </button>
          <button
            onClick={() => setAspectRatio('16:9')}
            className={`px-4 py-1 rounded-full text-xs font-semibold transition-all ${
              aspectRatio === '16:9' ? 'bg-orange-500 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            16:9 (微信公众号/横屏)
          </button>
        </div>

        {/* Shutter Watermarked Yield Card */}
        <div
          className={`relative border-2 border-orange-500/50 bg-zinc-950 p-8 rounded-2xl flex flex-col justify-between shadow-[0_0_50px_rgba(249,115,22,0.15)] transition-all duration-300 ${
            aspectRatio === '3:4' ? 'w-full max-w-[420px] aspect-[3/4]' : 'w-full max-w-[760px] aspect-[16/9]'
          }`}
        >
          {/* Subtle Cyber Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:24px_24px] opacity-10 rounded-2xl" />

          {/* Header */}
          <div className="relative z-10 flex justify-between items-center border-b border-zinc-800/80 pb-4">
            <div>
              <p className="text-xs text-orange-500 font-bold tracking-widest uppercase">TACTICAL REPORT</p>
              <h2 className="text-xl font-black text-white">{mockYield.month} 收益明细</h2>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">CODE: GUAGUA-7</span>
          </div>

          {/* Body stats */}
          <div className="relative z-10 my-auto py-4 space-y-4">
            {mockYield.stats.map((item, index) => (
              <div key={index} className="flex justify-between items-center border-b border-zinc-900/60 pb-2">
                <span className="text-sm text-zinc-400 font-medium">{item.name}</span>
                <div className="text-right">
                  <span className={`text-xl font-extrabold ${item.color}`}>{item.amount}</span>
                  <span className="text-xs text-zinc-500 ml-1">{item.unit}</span>
                  <p className="text-[10px] text-zinc-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Watermark */}
          <div className="relative z-10 flex justify-between items-end border-t border-zinc-800/80 pt-4 text-zinc-500">
            <div>
              <p className="text-[10px] font-bold text-orange-500/80 tracking-wider">呱呱弹壳空间</p>
              <p className="text-[8px] text-zinc-600">SUIVIVOR.IO TACTICAL STATS</p>
            </div>
            <div className="text-right text-[8px] text-zinc-600 font-mono">
              BY 弹壳呱呱
            </div>
          </div>
        </div>

        {/* Exit Button */}
        <button
          onClick={() => setScreenshotMode(false)}
          className="mt-6 px-6 py-2 bg-zinc-900 text-zinc-300 hover:text-white rounded-full text-xs font-bold border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer"
        >
          退出截图模式
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[200px] pt-8">
      {/* Card 1: Large col-span-2 - Yields Dashboard Preview */}
      <div className="md:col-span-2 md:row-span-1 border border-zinc-800/85 bg-zinc-900/40 backdrop-blur-md rounded-3xl p-6 flex flex-col justify-between hover:border-orange-500/30 transition-all duration-300 group">
        <div className="flex justify-between items-start">
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/30 text-emerald-400 border border-emerald-500/20">
              数据中心已对接
            </span>
            <h2 className="text-2xl font-black text-white mt-2 group-hover:text-orange-400 transition-colors">月度收益明细</h2>
          </div>
          <Link href="/yields" className="text-xs text-zinc-400 hover:text-white flex items-center">
            查看详情 →
          </Link>
        </div>

        {/* Dynamic preview rows */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2 border-t border-zinc-800/50 mt-4 pt-4">
          {mockYield.stats.slice(0, 4).map((stat, i) => (
            <div key={i} className="space-y-1">
              <p className="text-[10px] text-zinc-500 truncate">{stat.name}</p>
              <div className="flex items-baseline space-x-0.5">
                <span className={`text-2xl font-extrabold ${stat.color}`}>{stat.amount}</span>
                <span className="text-[10px] text-zinc-600">{stat.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card 2: Tall row-span-2 - Calculator Preview */}
      <div className="md:col-span-1 md:row-span-2 border border-zinc-800/85 bg-zinc-900/40 backdrop-blur-md rounded-3xl p-6 flex flex-col justify-between hover:border-amber-500/40 hover:scale-[1.01] transition-all duration-300 group relative overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

        <div className="space-y-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/30 text-amber-400 border border-amber-500/20">
            核心算法预留
          </span>
          <h2 className="text-2xl font-black text-white group-hover:text-amber-400 transition-colors">{mockCalc.title}</h2>
          <p className="text-zinc-500 text-xs">通过导入特工技能系数与装备面板数据，评估单发、周期及爆发输出极值。</p>
        </div>

        {/* Display calculated metrics */}
        <div className="bg-zinc-950/60 rounded-2xl p-4 border border-zinc-900 space-y-3 my-4">
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-500">基础攻击力</span>
            <span className="font-mono text-zinc-300 font-bold">{mockCalc.atk}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-500">综合暴击率</span>
            <span className="font-mono text-zinc-300 font-bold">{mockCalc.crit}</span>
          </div>
          <div className="border-t border-zinc-900 pt-2 flex justify-between items-center text-xs">
            <span className="text-orange-400 font-semibold">测算秒伤期望</span>
            <span className="font-mono text-amber-400 font-extrabold text-sm">{mockCalc.dps}</span>
          </div>
        </div>

        <Link href="/calculator" className="w-full py-2.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-center rounded-xl text-xs font-bold hover:bg-amber-500 hover:text-black transition-all">
          进入伤害计算器
        </Link>
      </div>

      {/* Card 3: Standard - Items Wiki Link */}
      <div className="border border-zinc-800/85 bg-zinc-900/40 backdrop-blur-md rounded-3xl p-6 flex flex-col justify-between hover:border-blue-500/30 transition-all duration-300 group">
        <div>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-950/30 text-blue-400 border border-blue-500/20">
            WIKI 百科
          </span>
          <h3 className="text-xl font-bold text-white mt-2 group-hover:text-blue-400 transition-colors">物品百科图鉴</h3>
          <p className="text-zinc-500 text-xs mt-1">S级装备与配件全套属性数据库。</p>
        </div>
        <Link href="/items" className="text-xs text-blue-400 hover:text-blue-300 font-semibold mt-4">
          探索图鉴 →
        </Link>
      </div>

      {/* Card 4: Standard - Events Timeline Link */}
      <div className="border border-zinc-800/85 bg-zinc-900/40 backdrop-blur-md rounded-3xl p-6 flex flex-col justify-between hover:border-purple-500/30 transition-all duration-300 group">
        <div>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-950/30 text-purple-400 border border-purple-500/20">
            TIMELINE
          </span>
          <h3 className="text-xl font-bold text-white mt-2 group-hover:text-purple-400 transition-colors">活动时间轴</h3>
          <p className="text-zinc-500 text-xs mt-1">限时活动与任务最高兑换收益归集。</p>
        </div>
        <Link href="/events" className="text-xs text-purple-400 hover:text-purple-300 font-semibold mt-4">
          查看活动 →
        </Link>
      </div>

      {/* Card 5: Admin Screenshot widget */}
      <div className="border border-zinc-800/85 bg-zinc-900/40 backdrop-blur-md rounded-3xl p-6 flex flex-col justify-between hover:border-orange-500/30 transition-all duration-300 group relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-orange-950/30 text-orange-400 border border-orange-500/20">
              BLOGGER TOOL
            </span>
            <h3 className="text-xl font-bold text-white mt-2">自媒体截图</h3>
          </div>
          {/* Vector camera shutter icon */}
          <svg className="w-8 h-8 text-zinc-700 group-hover:text-orange-500/50 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>

        {isAdmin ? (
          <button
            onClick={() => setScreenshotMode(true)}
            className="w-full py-2 bg-orange-500 text-zinc-950 rounded-xl text-xs font-bold hover:bg-orange-400 transition-all cursor-pointer"
          >
            开启相机截图模式
          </button>
        ) : (
          <div className="text-[10px] text-zinc-500 leading-relaxed">
            截图模式是属于博主 **弹壳呱呱** 的专属面板。普通用户可向博主申请开通后台权限。
          </div>
        )}
      </div>
    </div>
  );
}
