"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ShoppingBag, Users, BarChart3, ArrowUpRight, Activity, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';

interface ToolItem {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  status: string;
  statusColor: string;
  icon: any;
  href: string;
  metrics: { label: string; value: string }[];
  tags: string[];
}

const TOOLS: ToolItem[] = [
  {
    id: 'market',
    title: '双人农场 · 卖菜看板',
    subtitle: '实时蔬菜价格聚合与高价报警',
    desc: '汇总全网玩家与公会蔬菜收购行情，智能预测涨跌趋势，助你把握最佳出售时机，轻松刷满金币收益。',
    status: '运行中 · 实时同步',
    statusColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    icon: ShoppingBag,
    href: '/yields',
    metrics: [
      { label: '今日最高价', value: '725 币' },
      { label: '行情更新', value: '2分钟前' },
    ],
    tags: ['行情监控', '高价预警', '公会互助'],
  },
  {
    id: 'rank',
    title: '并列发车大厅',
    subtitle: '双人副本高效组队与一键拼车',
    desc: '专为高阶玩家打造的双人并列发车匹配系统，精准筛选特工装备门槛与伤害阶梯，告别翻车与挂机队友。',
    status: '活跃中 · 快速上车',
    statusColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    icon: Users,
    href: '/events',
    metrics: [
      { label: '当前车队', value: '38 组' },
      { label: '平均匹配', value: '12 秒' },
    ],
    tags: ['双人副本', '门槛筛选', '战术语音'],
  },
  {
    id: 'yields',
    title: '月度收益精算看板',
    subtitle: '个人资产与月度产出全景追踪',
    desc: '清晰归集每日巡逻、活动兑换、主线掉落与通行证奖励，直观呈现钻石、金币、图纸与S级核心增长曲线。',
    status: '数据中心已对接',
    statusColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    icon: BarChart3,
    href: '/yields',
    metrics: [
      { label: '月均钻石', value: '45,000+' },
      { label: 'S级核心', value: '12+ 枚' },
    ],
    tags: ['资产追踪', '收益统计', '精算模型'],
  },
];

export default function ToolCards() {
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
    <section id="tools" className="mb-14 sm:mb-16 space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-6 rounded-full bg-blue-500" />
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
            工具大厅
          </h2>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSeeMore}
            className="text-xs font-bold text-slate-400 hover:text-orange-400 px-3 py-1.5 rounded-xl hover:bg-slate-800/60 transition-all flex items-center space-x-1 cursor-pointer"
          >
            <span>查看更多</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <div className="hidden sm:flex items-center space-x-1">
            <button
              onClick={() => handleScroll('left')}
              className="w-8 h-8 rounded-xl bg-slate-800/80 border border-slate-700/70 hover:border-orange-500/50 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
              title="向左滚动"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="w-8 h-8 rounded-xl bg-slate-800/80 border border-slate-700/70 hover:border-orange-500/50 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
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
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              className="w-80 sm:w-96 shrink-0 glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between border border-slate-700/55 relative overflow-hidden group"
            >
              <div className="space-y-4">
                {/* Status & Icon */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#0e172a] border border-slate-700/70 flex items-center justify-center text-orange-400 group-hover:scale-110 group-hover:border-orange-500/60 transition-all duration-300 shadow-md">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${tool.statusColor}`}>
                    {tool.status}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h3 className="text-lg font-black text-white group-hover:text-orange-400 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs font-medium text-orange-400 mt-0.5">
                    {tool.subtitle}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {tool.desc}
                </p>

                {/* Live Metrics */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-[#0b1329]/90 border border-slate-700/60 shadow-inner">
                  {tool.metrics.map((m, i) => (
                    <div key={i}>
                      <span className="text-[10px] text-slate-400">{m.label}</span>
                      <p className="text-xs font-mono font-black text-slate-100 mt-0.5">{m.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-4 border-t border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  {tool.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className="text-[10px] text-slate-300 bg-slate-800/80 border border-slate-700/50 px-2 py-0.5 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href={tool.href}
                  className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-zinc-950 text-xs font-black rounded-xl border border-blue-500/20 hover:border-transparent transition-all flex items-center space-x-1"
                >
                  <span>立即进入</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toast Notice */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-2xl glass-panel border border-blue-500/40 text-xs font-bold text-blue-300 shadow-2xl animate-in fade-in slide-in-from-bottom-3">
          🛠️ 更多自研工具（伤害排位榜、每日待办日历）即将上线...
        </div>
      )}
    </section>
  );
}
