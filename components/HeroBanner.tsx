"use client";

import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

interface HeroBannerProps {
  onSelectArticle?: (title: string) => void;
}

export default function HeroBanner({ onSelectArticle }: HeroBannerProps) {
  const handleClickCard = () => {
    onSelectArticle?.('维托尔测评 & 四周年全活动精算');
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden glass-panel border border-white/10 p-6 sm:p-8 lg:p-10 mb-8 group">
      {/* Background Graphic Accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-500/15 via-purple-500/10 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Info Column (Clean Placeholder & Title) */}
        <div className="max-w-xl space-y-3 text-left">
          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            维托尔战术测评 & 四周年全活动精算
          </h1>

          {/* Subtitle / Intro */}
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed pt-1">
            神火新特工技能机制深度拆解、爆发系数精算与神铸装备搭配全方案。同步更新一番赏/彩虹骰低成本拿保底策略。
          </p>
        </div>

        {/* Right Hero Visual Card - Clickable Cover Card */}
        <div 
          onClick={handleClickCard}
          className="relative w-full max-w-sm lg:max-w-md shrink-0 cursor-pointer"
        >
          <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden border border-orange-500/30 bg-zinc-900/90 shadow-2xl hover:border-orange-500/70 hover:shadow-orange-500/15 transition-all duration-300 group/card flex flex-col justify-between isolate [transform:translateZ(0)]">
            {/* Strategy Cover Image */}
            <Image
              src="/assets/strategy-cover-4th.png"
              alt="4周年攻略精算大图"
              fill
              className="object-cover group-hover/card:scale-105 transition-transform duration-500 rounded-3xl pointer-events-none"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent rounded-3xl pointer-events-none" />

            {/* Top Right Rank Badge */}
            <div className="relative z-10 flex items-center justify-end p-4">
              <span className="px-2.5 py-1 rounded-lg bg-orange-500 text-zinc-950 text-xs font-black shadow-md">
                TOP 1
              </span>
            </div>

            {/* Bottom Card Title & Click Action */}
            <div className="relative z-10 p-4 bg-zinc-950/80 backdrop-blur-md border-t border-white/10 flex justify-between items-center rounded-b-3xl">
              <h3 className="text-sm sm:text-base font-black text-white group-hover/card:text-orange-400 transition-colors">
                4周年一番赏阶梯性价比精算
              </h3>
              <span className="text-xs text-orange-400 font-bold flex items-center space-x-0.5 group-hover/card:translate-x-0.5 transition-transform shrink-0 ml-2">
                <span>查看</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
