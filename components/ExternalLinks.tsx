"use client";

import { useState, useRef } from 'react';
import { ExternalLink, Calculator, Smartphone, Gift, Star, Shield, ChevronRight, ChevronLeft } from 'lucide-react';

interface EcoLink {
  id: string;
  title: string;
  tag: string;
  desc: string;
  icon: any;
  actionText: string;
  linkUrl: string;
  type: 'calc' | 'miniapp' | 'gift';
}

const ECO_LINKS: EcoLink[] = [
  {
    id: 'calculator',
    title: '弹壳伤害计算器 (Web版)',
    tag: '第三方硬核精算',
    desc: '专业级单发倍率、暴伤期望与技能冷却收益测算模型，方便高阶玩家配装极限拉满。',
    icon: Calculator,
    actionText: '打开计算器',
    linkUrl: 'https://survivorio-calculator.example.com',
    type: 'calc',
  },
  {
    id: 'miniapp',
    title: '弹壳小工具 (微信小程序)',
    tag: '手机端高频推荐',
    desc: '微信扫码即用，集成装备图鉴对照、神铸属性查询、每日提醒与快速查阅功能。',
    icon: Smartphone,
    actionText: '扫码使用',
    linkUrl: '#',
    type: 'miniapp',
  },
  {
    id: 'official-gift',
    title: '官方礼包码兑换中心',
    tag: '官方直达通道',
    desc: '官方正版兑换入口，输入游戏内玩家 ID 与兑换码即可秒到邮件，安全无风险。',
    icon: Gift,
    actionText: '直达官方入口',
    linkUrl: 'https://gift.survivorio.com',
    type: 'gift',
  },
];

export default function ExternalLinks() {
  const [showToast, setShowToast] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleSeeMore = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <section id="ecosystem" className="mb-16 space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-6 rounded-full bg-purple-500" />
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
            生态外链
          </h2>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSeeMore}
            className="text-xs font-bold text-slate-400 hover:text-purple-400 px-3 py-1.5 rounded-xl hover:bg-slate-800/60 transition-all flex items-center space-x-1 cursor-pointer"
          >
            <span>查看更多</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <div className="hidden sm:flex items-center space-x-1">
            <button
              onClick={() => handleScroll('left')}
              className="w-8 h-8 rounded-xl bg-slate-800/80 border border-slate-700/70 hover:border-purple-500/50 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
              title="向左滚动"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="w-8 h-8 rounded-xl bg-slate-800/80 border border-slate-700/70 hover:border-purple-500/50 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
              title="向右滚动"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Single Row Horizontal Scrollable Container (100% hidden scrollbar) */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto no-scrollbar scroll-smooth gap-4 pb-2 pt-1"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {ECO_LINKS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="w-80 sm:w-96 shrink-0 glass-card glass-card-hover rounded-3xl p-5 flex flex-col justify-between border border-slate-700/55 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-[#0e172a] border border-slate-700/70 flex items-center justify-center text-purple-400 group-hover:scale-105 group-hover:border-purple-500/60 transition-all shadow-md">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    {item.tag}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-purple-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-700/50 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                  <Shield className="w-3 h-3 text-emerald-400" />
                  <span>已校验安全无广告</span>
                </span>
                <a
                  href={item.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-purple-500/15 hover:bg-purple-500 text-purple-300 hover:text-slate-950 text-xs font-bold rounded-xl border border-purple-500/30 hover:border-transparent transition-all flex items-center space-x-1"
                >
                  <span>{item.actionText}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toast Notice */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-2xl glass-panel border border-purple-500/40 text-xs font-bold text-purple-300 shadow-2xl animate-in fade-in slide-in-from-bottom-3">
          🔗 更多第三方高阶工具精选收集中...
        </div>
      )}
    </section>
  );
}
