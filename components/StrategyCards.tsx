"use client";

import { useState, useRef, useEffect } from 'react';
import { BookOpen, Flame, Eye, Clock, Tag, ChevronRight, ChevronLeft, ShieldCheck, Zap } from 'lucide-react';
import { fetchStrategies } from '@/lib/api';

interface StrategyItem {
  id: string;
  title: string;
  category: 'event' | 'boss' | 'resources' | 'faq' | string;
  categoryLabel: string;
  badge?: string;
  summary: string;
  readTime: string;
  views: string;
  date: string;
  highlights: string[];
}

const FALLBACK_STRATEGIES: StrategyItem[] = [
  {
    id: 's1',
    title: '【4周年庆】一番赏/彩虹骰阶梯消耗精算与低成本拿保底策略',
    category: 'event',
    categoryLabel: '活动精算',
    badge: 'HOT',
    summary: '详细解析 4 周年庆一番赏每日免费抽奖上限、彩虹矿石兑换优先级与微氪党/零氪党最佳止损节点。',
    readTime: '6 分钟',
    views: '1.8w',
    date: '09-06',
    highlights: ['免费资源拉满', '彩虹骰保底', 'SS核心顺位'],
  },
  {
    id: 's2',
    title: '【回响之战】狂暴机械主脑 & 毒雾暴君 极限刷分走位与技能搭配',
    category: 'boss',
    categoryLabel: '回响 Boss',
    badge: '必备',
    summary: '针对本周回响之战两个高难度 Boss 的弹幕死角、开局前 60 秒技能抓取优先级及特工无伤卡位教学。',
    readTime: '5 分钟',
    views: '1.2w',
    date: '09-05',
    highlights: ['无人机+足球', '贴脸输出时隙', '伤害放大技巧'],
  },
  {
    id: 's3',
    title: '【资源全景】日常体力/金币/图纸/钻石全渠道高效收割路线图',
    category: 'resources',
    categoryLabel: '资源速刷',
    summary: '盘点每日 30 分钟日常速刷顺序、公会商店兑换权重、巡逻收益卡点与章节金币最大化关卡推荐。',
    readTime: '8 分钟',
    views: '9.5k',
    date: '09-04',
    highlights: ['第4章金币法', '巡逻快速收益', '每周公会币'],
  },
  {
    id: 's4',
    title: '【高频避坑 FAQ】神铸进阶/配件共鸣/宠物洗练新手必须知道的 10 件事',
    category: 'faq',
    categoryLabel: '避坑指南',
    summary: '解答“红武升神铸先升哪件”、“红色配件先共鸣哪个”、“异宠核心如何分配”等玩家最常踩坑的十个问题。',
    readTime: '7 分钟',
    views: '1.5w',
    date: '09-03',
    highlights: ['神铸优先梯队', '共鸣芯片精算', '宠物被动配队'],
  },
  {
    id: 's5',
    title: '【区域行动】第 24 期全词缀限制挑战完美三星通关详解',
    category: 'boss',
    categoryLabel: '区域行动',
    summary: '拆解全屏减速、精英怪移速+100% 词缀下的特工与特技搭配，手残党也能轻松抄作业通关。',
    readTime: '5 分钟',
    views: '8.1k',
    date: '09-02',
    highlights: ['守卫者击退流', '减速力场抗压', '血量安全阈值'],
  },
  {
    id: 's6',
    title: '【公会战深度】每周深渊探索 Boss 阶段性机制与高分攻略',
    category: 'event',
    categoryLabel: '公会探索',
    summary: '公会管理与核心打手必看：深渊探索行动力分配公式、Boss 易伤阶段输出节奏与公会排行奖励最大化。',
    readTime: '6 分钟',
    views: '6.7k',
    date: '08-30',
    highlights: ['行动力卡点', 'Boss易伤循环', '全员补刀协调'],
  },
];

export default function StrategyCards() {
  const [strategies, setStrategies] = useState<StrategyItem[]>(FALLBACK_STRATEGIES);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showToast, setShowToast] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchStrategies().then((data) => {
      if (data && data.length > 0) {
        setStrategies(data);
      }
    });
  }, []);

  const categories = [
    { id: 'all', label: '全部精选' },
    { id: 'event', label: '活动精算' },
    { id: 'boss', label: '回响Boss' },
    { id: 'resources', label: '资源速刷' },
    { id: 'faq', label: '避坑FAQ' },
  ];

  const filteredStrategies = activeCategory === 'all'
    ? strategies
    : strategies.filter((item: StrategyItem) => item.category === activeCategory);

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
    <section id="strategies" className="mb-14 sm:mb-16 space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-6 rounded-full bg-amber-500" />
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
            攻略文章
          </h2>
        </div>

        {/* Categories + Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-2 overflow-x-auto no-scrollbar">
          {/* Category Tabs */}
          <div className="flex items-center space-x-1 bg-[#0b1329]/90 p-1 rounded-2xl border border-slate-700/60 shadow-inner">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/30 font-black'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Right See More + Scroll Buttons */}
          <div className="flex items-center space-x-1.5 shrink-0">
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
        {filteredStrategies.map((item) => (
          <div
            key={item.id}
            className="w-80 sm:w-96 shrink-0 glass-card glass-card-hover rounded-3xl p-5 flex flex-col justify-between group cursor-pointer border border-slate-700/55"
          >
            <div className="space-y-3">
              {/* Category & Stats Bar */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30">
                  {item.categoryLabel}
                </span>
                <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{item.readTime}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{item.views}</span>
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-2 leading-snug">
                {item.title}
              </h3>

              {/* Summary */}
              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {item.summary}
              </p>

              {/* Highlight Badges */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {item.highlights.map((h, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-[#0e1628] border border-slate-700/60 text-slate-300"
                  >
                    #{h}
                  </span>
                ))}
              </div>
            </div>

            {/* Card Footer */}
            <div className="pt-4 mt-4 border-t border-slate-700/50 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px]">发布时间: {item.date}</span>
              <span className="text-orange-400 group-hover:translate-x-1 transition-transform flex items-center space-x-0.5 font-bold">
                <span>阅读全文</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Toast Notice */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-2xl glass-panel border border-amber-500/40 text-xs font-bold text-amber-300 shadow-2xl animate-in fade-in slide-in-from-bottom-3">
          📚 全库 50+ 篇往期精选深度攻略同步整理中...
        </div>
      )}
    </section>
  );
}
