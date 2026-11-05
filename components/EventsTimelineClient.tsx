'use client';

import React, { useState, useMemo } from 'react';
import { Calendar, Sparkles, ShieldAlert, Award, Clock, Search, Layers, ChevronRight, Zap, Target, Gift } from 'lucide-react';
import eventsData from '@/lib/data/events.json';

type EventItem = typeof eventsData.events[0];

export default function EventsTimelineClient() {
  const [activeTab, setActiveTab] = useState<'events' | 'unlocks' | 'seasons'>('events');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'upcoming'>('all');

  // Filter events
  const filteredEvents = useMemo(() => {
    return eventsData.events.filter((ev) => {
      const matchSearch =
        ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.typeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.rewards.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchSearch) return false;
      if (statusFilter === 'active') return ev.badge === '进行中' || ev.badge === '即将上线';
      if (statusFilter === 'upcoming') return ev.badge === '即将上线' || ev.badge === '重点前瞻' || ev.badge === '特大庆典' || ev.badge === '下旬接力';
      return true;
    });
  }, [searchQuery, statusFilter]);

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner Header */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#0d1527]/90 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
              基准版本：v5.3.1 官方解密数据源 · 基准时间：2026年11月
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              活动前瞻与赛季轮转中心
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              基于官方解包数据表全量解密，提早获知 2026 年 11 月限时活动排期、双十一狂欢返利、异世宠物上线时间点及 2026–2027 长期轮转赛季周期，助力特工提前规划资源与攻略方案。
            </p>
          </div>

          <div className="shrink-0 flex flex-row md:flex-col gap-3">
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/80 px-4 py-3 text-center min-w-[130px]">
              <div className="text-xs text-slate-400">已解析运营活动</div>
              <div className="text-2xl font-black text-amber-400 tabular-nums">5 场</div>
            </div>
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/80 px-4 py-3 text-center min-w-[130px]">
              <div className="text-xs text-slate-400">长期赛季预设</div>
              <div className="text-2xl font-black text-blue-400 tabular-nums">2027~2028</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tab Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <button
            type="button"
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'events'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>限时运营活动</span>
            <span className="rounded-full bg-blue-950 px-2 py-0.5 text-xs text-blue-300">
              {eventsData.events.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('unlocks')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'unlocks'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>重大系统解密</span>
            <span className="rounded-full bg-purple-950 px-2 py-0.5 text-xs text-purple-300">
              11.10
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('seasons')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'seasons'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>2026-2027 赛季周期</span>
            <span className="rounded-full bg-amber-950 px-2 py-0.5 text-xs text-amber-300">
              7项
            </span>
          </button>
        </div>

        {activeTab === 'events' && (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="搜索活动、代币或奖励..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/80 pl-9 pr-3 py-1.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              aria-label="筛选活动状态"
              className="rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">全部档期</option>
              <option value="upcoming">未开/前瞻</option>
              <option value="active">重点排期</option>
            </select>
          </div>
        )}
      </div>

      {/* Tab 1: 限时运营活动时间轴 */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {filteredEvents.map((ev) => (
              <div
                key={ev.id}
                className="rounded-2xl border border-slate-800/90 bg-[#101828]/95 p-6 hover:border-blue-500/40 transition-all duration-200 shadow-lg space-y-5"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className={`rounded-md border px-2.5 py-0.5 text-xs font-bold ${ev.badgeColor}`}>
                        {ev.badge}
                      </span>
                      <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs font-mono text-slate-400">
                        玩法：{ev.typeName}
                      </span>
                      <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs font-mono text-slate-400">
                        ID: {ev.id}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white pt-1">{ev.title}</h2>
                    <p className="text-xs sm:text-sm text-slate-400">{ev.subtitle}</p>
                  </div>

                  <div className="rounded-xl border border-slate-700/60 bg-slate-900/70 p-3 sm:text-right shrink-0">
                    <div className="flex items-center sm:justify-end gap-1.5 text-xs text-blue-400 font-semibold mb-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>运营排期</span>
                    </div>
                    <div className="text-sm font-medium text-slate-200 tabular-nums">
                      {ev.startTime.slice(0, 10)} 至 {ev.endTime.slice(0, 10)}
                    </div>
                  </div>
                </div>

                {/* Tokens and Mechanics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                      <Zap className="h-3.5 w-3.5 text-amber-400" />
                      <span>活动专属代币与道具</span>
                    </div>
                    <div className="space-y-2">
                      {ev.tokens.map((token, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs">
                          <span className="rounded bg-amber-500/10 px-2 py-0.5 font-bold text-amber-300 shrink-0">
                            {token.name}
                          </span>
                          <span className="text-slate-400">{token.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                      <Gift className="h-3.5 w-3.5 text-emerald-400" />
                      <span>核心奖励池一览</span>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {ev.rewards.map((reward, idx) => (
                        <span
                          key={idx}
                          className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300"
                        >
                          {reward}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Strategy and Tactics Alert */}
                <div className="rounded-xl border border-blue-500/20 bg-blue-950/20 p-4 flex items-start gap-3">
                  <Target className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs sm:text-sm">
                    <span className="font-bold text-blue-300">攻略制作与囤货建议：</span>
                    <p className="text-slate-300 leading-relaxed">{ev.tactics}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: 重大版本更新爆料 (11.10 异世宠物与红收藏品) */}
      {activeTab === 'unlocks' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-slate-900/70 to-slate-900/80 p-6 sm:p-8 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-500/20 px-3 py-1 text-xs font-bold text-purple-300">
              <Sparkles className="h-3.5 w-3.5" />
              重大系统解锁时间：2026-11-10 00:00:00 (FunctionCfg Row 68)
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              全新系统【异世宠物】与红阶收藏品解密
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              根据官方静态配置表 `FunctionCfgTime.csv` 与 `Language.csv` 精确对照，游戏于 11 月 10 日开放“异世宠物”助战体系，并同步解锁 3 款全新的红阶传奇收藏品。
            </p>
          </div>

          {/* Feature 1: 异世宠物 */}
          <div className="rounded-2xl border border-slate-800 bg-[#101828] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-400" />
                异世宠物助战体系 (Otherworld Pet)
              </h3>
              <span className="text-xs font-mono text-purple-400 bg-purple-500/10 border border-purple-500/30 px-2.5 py-1 rounded-lg">
                解锁门槛：4种宠物觉醒至5星
              </span>
            </div>

            <p className="text-sm text-slate-300">
              {eventsData.systemUnlocks.features[0]?.mechanics}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {'coreItems' in eventsData.systemUnlocks.features[0] &&
                (eventsData.systemUnlocks.features[0].coreItems as Array<{ name: string; desc: string }>).map((item, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
                    <div className="text-sm font-bold text-purple-300">{item.name}</div>
                    <div className="text-xs text-slate-400">{item.desc}</div>
                  </div>
                ))}
            </div>
          </div>

          {/* Feature 2: 3款全新红阶收藏品 */}
          <div className="rounded-2xl border border-slate-800 bg-[#101828] p-6 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-amber-400" />
                3 款全新红色传奇收藏品同步解密
              </h3>
              <p className="text-xs text-slate-400 mt-1">解锁时间戳 1794240000（2026-11-10 00:00:00）</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {'items' in eventsData.systemUnlocks.features[1] &&
                (eventsData.systemUnlocks.features[1].items as Array<{ id: string; name: string; quality: string; desc: string; buff: string }>).map((col) => (
                  <div
                    key={col.id}
                    className="rounded-xl border border-amber-500/30 bg-gradient-to-b from-amber-950/20 to-slate-900/80 p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-red-500/20 border border-red-500/40 px-2 py-0.5 text-[11px] font-bold text-red-300">
                        {col.quality}
                      </span>
                      <span className="text-xs font-mono text-slate-400">ID: {col.id}</span>
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">{col.name}</h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{col.desc}</p>
                    </div>
                    <div className="rounded-lg bg-slate-900/90 p-3 text-xs text-amber-200 border border-amber-500/20">
                      <div className="font-semibold text-slate-300 mb-0.5">词缀特权：</div>
                      {col.buff}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: 2026-2027 长期赛季轮转 */}
      {activeTab === 'seasons' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-[#0d1527] p-6">
            <h2 className="text-xl font-bold text-white mb-2">2026–2027 长期周期与赛季排期全景</h2>
            <p className="text-sm text-slate-300">
              《弹壳特攻队》底层大量赛季与商店系统以固定周期预置在底表中（部分排期已预设至 2027 年秋及 2028 年）。以下是各玩法当前及后续结转节点：
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {eventsData.recurringSeasons.map((season) => (
              <div
                key={season.id}
                className="rounded-2xl border border-slate-800 bg-[#101828] p-5 space-y-4 hover:border-amber-500/40 transition-colors"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
                    {season.name}
                  </h3>
                  <span className="rounded-md bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-xs font-semibold text-amber-300">
                    {season.cycle}
                  </span>
                </div>

                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-400">当前阶段：</span>
                    <span className="text-slate-200 font-medium text-right">{season.current}</span>
                  </div>

                  {'currentEnd' in season && (
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-400">当期结转时间：</span>
                      <span className="text-amber-400 font-semibold tabular-nums text-right">{season.currentEnd}</span>
                    </div>
                  )}

                  {'nextStart' in season && (
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-400">下期开始时间：</span>
                      <span className="text-emerald-400 font-semibold tabular-nums text-right">{season.nextStart}</span>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-400">官方预设覆盖：</span>
                    <span className="text-blue-400 font-mono text-right">{season.futureCoverage}</span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-300">
                  {season.summary}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
