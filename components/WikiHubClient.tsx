"use client";

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  Flame, 
  Star, 
  Shield, 
  Zap, 
  Trophy, 
  Car, 
  User, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Layers,
  ArrowLeft,
  Crosshair,
  BadgeCheck
} from 'lucide-react';
import { HEROES_DATA, HeroData } from '@/lib/data/heroes';
import { COLLECTIONS_DATA, CollectionItem } from '@/lib/data/collections';
import { VEHICLES_DATA, VehicleData } from '@/lib/data/vehicles';

type TabType = 'heroes' | 'collections' | 'vehicles';

export default function WikiHubClient() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('heroes');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [expandedHeroId, setExpandedHeroId] = useState<string | null>('vulcan');
  const [selectedPeriod, setSelectedPeriod] = useState<number | 'all'>('all');

  // Quick Filters
  const FILTER_PILLS = [
    { id: 'all', label: '全部词条', icon: Layers },
    { id: 'crit_rate', label: '⚡ 暴击率', icon: Zap },
    { id: 'crit_damage', label: '🔥 暴击伤害', icon: Flame },
    { id: 'vuln', label: '💥 独立易伤', icon: Crosshair },
    { id: 'all_hero', label: '🛡️ 全体生效', icon: Shield },
  ];

  useEffect(() => {
    const tag = searchParams.get('tag');
    if (tag && FILTER_PILLS.some((p) => p.id === tag)) {
      setSelectedTag(tag);
    }
    const tab = searchParams.get('tab');
    if (tab === 'heroes' || tab === 'collections' || tab === 'vehicles') {
      setActiveTab(tab as TabType);
    }
  }, [searchParams]);

  // Filtered Heroes
  const filteredHeroes = useMemo(() => {
    return HEROES_DATA.filter(hero => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        hero.name.toLowerCase().includes(q) || 
        hero.title.toLowerCase().includes(q) || 
        hero.description.toLowerCase().includes(q) ||
        hero.exclusiveSkill.name.toLowerCase().includes(q) ||
        hero.synergyInfo?.recommendRank.toLowerCase().includes(q);

      if (!matchSearch) return false;

      if (selectedTag === 'crit_rate') {
        return hero.keyStats.targetTags.some(t => t.includes('暴击率') || t.includes('暴击+'));
      }
      if (selectedTag === 'crit_damage') {
        return hero.keyStats.targetTags.some(t => t.includes('暴击伤害') || t.includes('暴伤'));
      }
      if (selectedTag === 'vuln') {
        return hero.keyStats.targetTags.some(t => t.includes('易伤') || t.includes('独立'));
      }
      if (selectedTag === 'all_hero') {
        return hero.stars.some(s => s.type === 'all');
      }
      return true;
    });
  }, [searchQuery, selectedTag]);

  // Filtered Collections
  const filteredCollections = useMemo(() => {
    return COLLECTIONS_DATA.filter(col => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        col.name.toLowerCase().includes(q) || 
        col.associatedEquip?.toLowerCase().includes(q) || 
        col.reviewTip.toLowerCase().includes(q) ||
        col.baseStats.toLowerCase().includes(q);

      if (!matchSearch) return false;

      if (selectedPeriod !== 'all' && col.period !== selectedPeriod) {
        return false;
      }

      if (selectedTag === 'crit_rate') {
        return col.categoryTag === 'crit_rate' || col.star3Bonus.includes('暴击率');
      }
      if (selectedTag === 'crit_damage') {
        return col.categoryTag === 'crit_damage' || col.star3Bonus.includes('暴击伤害');
      }
      if (selectedTag === 'vuln') {
        return col.categoryTag === 'skill_boost' || col.star3Bonus.includes('易伤');
      }
      return true;
    });
  }, [searchQuery, selectedTag, selectedPeriod]);

  // Filtered Vehicles
  const filteredVehicles = useMemo(() => {
    return VEHICLES_DATA.filter(veh => {
      const q = searchQuery.toLowerCase().trim();
      return !q || 
        veh.name.toLowerCase().includes(q) || 
        veh.description.toLowerCase().includes(q) || 
        veh.layoutTip.toLowerCase().includes(q);
    });
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-100 pb-24">
      {/* Top Header & Sticky Navigation */}
      <div className="sticky top-0 z-40 bg-[#0a0f1d]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors mr-3"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回首页</span>
            </Link>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
              <h1 className="text-base sm:text-lg font-black tracking-wide bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
                弹壳特工战术百科图鉴
              </h1>
            </div>
            <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-slate-800 text-orange-400 font-mono border border-slate-700/60">
              v5.3.1 词条真源
            </span>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索特工/收藏品/属性/装备..."
              className="w-full bg-slate-900/90 border border-slate-700/70 rounded-xl pl-9 pr-4 py-1.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500/80 focus:ring-1 focus:ring-orange-500/50 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
              >
                清空
              </button>
            )}
          </div>
        </div>

        {/* Tab Selector (Mobile Touch Friendly) */}
        <div className="max-w-6xl mx-auto mt-3 flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setActiveTab('heroes')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'heroes'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md shadow-orange-500/20'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>特工档案 ({HEROES_DATA.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('collections')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'collections'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md shadow-orange-500/20'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>收藏品天梯 ({COLLECTIONS_DATA.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('vehicles')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'vehicles'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md shadow-orange-500/20'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>载具 ({VEHICLES_DATA.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 space-y-4">
        {/* Quick Attribute Filter Bar */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-1 pb-2 border-b border-slate-800/60">
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
            {FILTER_PILLS.map((pill) => {
              const Icon = pill.icon;
              const isSelected = selectedTag === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => setSelectedTag(pill.id)}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800/80'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{pill.label}</span>
                </button>
              );
            })}
          </div>

          {/* Period selector for collections */}
          {activeTab === 'collections' && (
            <div className="flex items-center space-x-1 text-xs">
              <span className="text-slate-400 hidden sm:inline">期数：</span>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="bg-slate-900 border border-slate-700/80 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
              >
                <option value="all">全部期数</option>
                <option value="1">第 1 期 (永恒/破坏首饰)</option>
                <option value="2">第 2 期 (永恒甲/手套)</option>
                <option value="3">第 3 期 (混沌甲/破坏链)</option>
                <option value="4">第 4 期 (永恒火鞋)</option>
                <option value="6">第 6 期 (破坏风衣)</option>
                <option value="7">第 7 期 (混沌剑)</option>
                <option value="10">第 10 期 (星座黄道十二宫)</option>
                <option value="0">传奇红收藏品专区</option>
              </select>
            </div>
          )}
        </div>

        {/* --- TAB 1: HEROES (特工档案) --- */}
        {activeTab === 'heroes' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredHeroes.map((hero) => {
                const isExpanded = expandedHeroId === hero.id;
                const isSP = hero.tier === 'SP';
                const isS = hero.tier === 'S';

                return (
                  <div
                    key={hero.id}
                    className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isSP 
                        ? 'bg-gradient-to-b from-red-950/20 via-slate-900/80 to-slate-950/90 border-red-500/30 hover:border-red-500/60 shadow-lg shadow-red-950/20'
                        : isS
                        ? 'bg-gradient-to-b from-amber-950/15 via-slate-900/80 to-slate-950/90 border-amber-500/30 hover:border-amber-500/60'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Card Header */}
                    <div className="p-4 sm:p-5">
                      <div className="flex items-start space-x-3.5">
                        {/* Avatar */}
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl overflow-hidden bg-slate-950 border border-slate-700/80 flex items-center justify-center p-1">
                          <Image
                            src={hero.avatar}
                            alt={hero.name}
                            width={80}
                            height={80}
                            className="object-contain w-full h-full"
                          />
                          <span className={`absolute top-1 left-1 text-[10px] font-black px-1.5 py-0.2 rounded-md ${
                            isSP ? 'bg-red-600 text-white' : isS ? 'bg-amber-500 text-slate-950' : 'bg-slate-600 text-white'
                          }`}>
                            {hero.tier}
                          </span>
                        </div>

                        {/* Title & Stats */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <h2 className="text-base sm:text-lg font-black text-white truncate">
                                {hero.name}
                              </h2>
                              <span className="text-xs text-slate-400 font-medium">
                                · {hero.title}
                              </span>
                            </div>
                            {hero.synergyInfo && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                                {hero.synergyInfo.role}
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-300/90 mt-1 line-clamp-2 leading-relaxed">
                            {hero.description}
                          </p>

                          {/* Synergy Recommendation Pill */}
                          {hero.synergyInfo && (
                            <div className="mt-2.5 flex items-center space-x-1.5 text-[11px] text-amber-300 font-mono bg-amber-950/30 px-2.5 py-1 rounded-lg border border-amber-500/20">
                              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span className="font-bold">阵容定位：</span>
                              <span>{hero.synergyInfo.recommendRank}</span>
                              <span className="text-slate-400">({hero.synergyInfo.synergyCoreCost})</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Exclusive Skill Box */}
                      <div className="mt-3.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start space-x-2 text-xs">
                        <div className="w-5 h-5 rounded-lg bg-orange-500/20 flex items-center justify-center shrink-0 mt-0.5">
                          <Flame className="w-3 h-3 text-orange-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-200">{hero.exclusiveSkill.name}</span>
                            <span className="text-slate-500">➔ 超武：</span>
                            <span className="font-bold text-orange-400">{hero.exclusiveSkill.evolutionName}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                            {hero.exclusiveSkill.evolutionDesc}
                          </p>
                        </div>
                      </div>

                      {/* Tag Badges */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {hero.keyStats.targetTags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 font-medium border border-slate-700/50"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Expand / Collapse Button */}
                      <button
                        onClick={() => setExpandedHeroId(isExpanded ? null : hero.id)}
                        className="w-full mt-3.5 pt-2 border-t border-slate-800/60 flex items-center justify-center space-x-1 text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors"
                      >
                        <span>{isExpanded ? '收起完整星级词条' : '查看完整星级与觉醒属性'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Expanded Star Passives Drawer */}
                    {isExpanded && (
                      <div className="bg-slate-950/80 px-4 py-3.5 border-t border-slate-800/80 space-y-2 text-xs">
                        <div className="flex items-center justify-between pb-1 border-b border-slate-800/60 text-[11px] text-slate-400">
                          <span className="font-bold text-slate-300">星级节点</span>
                          <span>带 ⭐ 为核心质变或全体特工生效</span>
                        </div>
                        <div className="space-y-2">
                          {hero.stars.map((starItem, idx) => (
                            <div
                              key={idx}
                              className={`p-2 rounded-lg flex items-start space-x-2 text-[11px] leading-snug ${
                                starItem.isKey 
                                  ? 'bg-amber-500/10 border border-amber-500/30 text-amber-200' 
                                  : starItem.type === 'all'
                                  ? 'bg-blue-950/20 border border-blue-500/20 text-blue-200'
                                  : 'bg-slate-900/50 text-slate-300'
                              }`}
                            >
                              <span className={`font-mono font-bold px-1.5 py-0.5 rounded text-[10px] shrink-0 ${
                                starItem.star.includes('红') ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-300'
                              }`}>
                                {starItem.star}
                              </span>
                              <span className="flex-1">{starItem.desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- TAB 2: COLLECTIONS (收藏品天梯) --- */}
        {activeTab === 'collections' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredCollections.map((col) => {
                const isLegendary = col.tier === 'legendary';
                return (
                  <div
                    key={col.id}
                    className={`rounded-2xl p-4 border transition-all duration-300 relative flex flex-col justify-between ${
                      isLegendary
                        ? 'bg-gradient-to-b from-red-950/25 to-slate-900/90 border-red-500/40 shadow-md shadow-red-950/20'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      {/* Top Header info */}
                      <div className="flex items-start space-x-3">
                        <div className="w-14 h-14 shrink-0 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center p-1 relative">
                          <Image
                            src={col.image}
                            alt={col.name}
                            width={56}
                            height={56}
                            className="object-contain w-full h-full"
                          />
                          <span className="absolute -top-1.5 -right-1 text-[9px] font-black px-1.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                            {col.period === 0 ? '传说' : `第${col.period}期`}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black text-white truncate">{col.name}</h3>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                              {col.recommendationRank}
                            </span>
                          </div>
                          {col.associatedEquip && (
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              联动装备：<span className="text-slate-200 font-medium">{col.associatedEquip}</span>
                            </p>
                          )}
                          <p className="text-[11px] text-slate-400 font-mono">
                            {col.baseStats}
                          </p>
                        </div>
                      </div>

                      {/* Star 3 Core Benefit (The Most Important User Decision Metric) */}
                      <div className="mt-3 p-2 rounded-xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-300 flex items-center space-x-1">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span>红三星质变词条：</span>
                        </span>
                        <span className="font-mono font-black text-amber-300 text-xs">
                          {col.star3Bonus}
                        </span>
                      </div>

                      {/* Star 5 Bonus */}
                      <div className="mt-1.5 px-2 py-1 text-[11px] text-slate-400 bg-slate-950/40 rounded-lg">
                        <span className="text-slate-500">红五星效果：</span>
                        <span>{col.star5Bonus}</span>
                      </div>
                    </div>

                    {/* Pro Review Tip */}
                    <div className="mt-3 pt-2.5 border-t border-slate-800/60 text-[11px] text-slate-400 leading-snug">
                      <span className="text-orange-400 font-bold">💡 培养建议：</span>
                      <span>{col.reviewTip}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- TAB 3: VEHICLES (战术载具) --- */}
        {activeTab === 'vehicles' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVehicles.map((veh) => (
              <div
                key={veh.id}
                className="rounded-2xl p-5 bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 shrink-0 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center p-2 relative">
                      <Image
                        src={veh.image}
                        alt={veh.name}
                        width={80}
                        height={80}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-black text-white">{veh.name}</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-orange-400 border border-slate-700">
                          {veh.qualityBadge}
                        </span>
                      </div>
                      <p className="text-xs text-amber-400 font-mono mt-1 font-bold">
                        {veh.speed}
                      </p>
                      <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                        {veh.description}
                      </p>
                    </div>
                  </div>

                  {/* Vehicle Skills */}
                  <div className="mt-4 space-y-2">
                    {veh.coreSkills.map((skill, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs flex items-start space-x-2"
                      >
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 shrink-0">
                          {skill.unlockedAt}
                        </span>
                        <div className="flex-1">
                          <span className="font-bold text-slate-200 mr-1.5">{skill.title}:</span>
                          <span className="text-slate-400 text-[11px]">{skill.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Practical Layout Advice */}
                <div className="mt-4 pt-3 border-t border-slate-800/60 text-xs text-slate-300 leading-snug bg-amber-950/20 p-2.5 rounded-xl border border-amber-500/20">
                  <span className="font-bold text-amber-400">🏁 实战摆放与搭配指南：</span>
                  <span className="text-[11px] text-slate-300 block mt-0.5">{veh.layoutTip}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
