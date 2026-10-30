"use client";

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Menu, Hammer, Sparkles, Zap, Flame, Shield } from 'lucide-react';
import { WikiEntryItem } from '@/lib/local-wiki-data';
import {
  AGENT_CLASS_STYLES,
  RARITY_STYLES,
  getAgentAllHeroBuffTags,
  getAgentClass,
} from '@/lib/wiki-helpers';

interface WikiEntryDetailModalProps {
  selectedEntry: WikiEntryItem | null;
  onClose: () => void;
}

function formatSkillEffect(text: string) {
  const parts = text.split(/(\+?\d+(?:\.\d+)?%?s?)/g);
  return parts.map((part, index) => {
    if (/^\+?\d+(?:\.\d+)?(?:%|s)?$/.test(part) && /\d/.test(part)) {
      return (
        <span key={index} className="text-[#4ade80] font-bold">
          {part}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

const TECH_TAG_STYLES: Record<string, string> = {
  毒伤: 'text-emerald-400 bg-emerald-950/80 border-emerald-800/80',
  冰缓: 'text-cyan-300 bg-cyan-950/80 border-cyan-800/80',
  裂伤: 'text-rose-400 bg-rose-950/80 border-rose-800/80',
  衰弱: 'text-purple-300 bg-purple-950/80 border-purple-800/80',
  易伤: 'text-amber-300 bg-amber-950/80 border-amber-800/80',
  重伤: 'text-red-400 bg-red-950/80 border-red-800/80',
  流血: 'text-red-300 bg-rose-950/80 border-rose-800/80',
  护盾增伤: 'text-blue-300 bg-blue-950/80 border-blue-800/80',
  暴击伤害: 'text-orange-300 bg-orange-950/80 border-orange-800/80',
  技能伤害: 'text-indigo-300 bg-indigo-950/80 border-indigo-800/80',
  首领伤害: 'text-amber-300 bg-amber-950/80 border-amber-800/80',
  减速: 'text-teal-300 bg-teal-950/80 border-teal-800/80',
  引燃: 'text-amber-400 bg-amber-950/80 border-amber-700/80',
};

function getQualityDotClass(quality: string) {
  switch (quality) {
    case '2':
      return 'bg-lime-400 border border-lime-300 shadow-sm shadow-lime-500/50';
    case '3':
      return 'bg-sky-400 border border-sky-300 shadow-sm shadow-sky-500/50';
    case '4':
      return 'bg-purple-500 border border-purple-400 shadow-sm shadow-purple-500/50';
    case '5':
    case '7':
      return 'bg-amber-400 border border-amber-300 shadow-sm shadow-amber-500/50';
    case '6':
    case '11':
      return 'bg-rose-500 border border-rose-400 shadow-sm shadow-rose-500/50';
    case '16':
    case 'rainbow':
    case 'SS':
    default:
      return 'bg-gradient-to-r from-rose-500 via-amber-400 to-cyan-400 border border-white/60 shadow-sm shadow-cyan-500/50';
  }
}

export default function WikiEntryDetailModal({
  selectedEntry,
  onClose,
}: WikiEntryDetailModalProps) {
  const [equipTab, setEquipTab] = useState<'info' | 'godforge' | 'chaos' | 'refine'>('info');
  const [techTab, setTechTab] = useState<'info' | 'harmony' | 'overload'>('info');
  const [petTab, setPetTab] = useState<'talent' | 'support'>('talent');

  useEffect(() => {
    setEquipTab('info');
    setTechTab('info');
    setPetTab('talent');
  }, [selectedEntry?.slug]);

  if (!selectedEntry) return null;

  const isAgent = selectedEntry.category === 'AGENT';
  const isCollectible = selectedEntry.category === 'COLLECTIBLE';
  const isEquipment = selectedEntry.category === 'EQUIPMENT';
  const isPet = selectedEntry.category === 'PET';
  const isTechPart = selectedEntry.category === 'TECH_PART';
  const isMount = selectedEntry.category === 'MOUNT';
  const isMechanic = selectedEntry.category === 'MECHANIC';

  const isPetSkill =
    isPet &&
    (selectedEntry.subcategory === '宠物助战技能' ||
      selectedEntry.subcategory === '助战技能' ||
      selectedEntry.tags.includes('助战技能'));
  const isPetS =
    isPet &&
    !isPetSkill &&
    (selectedEntry.subcategory === 'S级宠物' ||
      selectedEntry.subcategory === 'S级' ||
      selectedEntry.rarity === 'S');

  const agentClass = isAgent ? getAgentClass(selectedEntry) : null;
  const style =
    isAgent && agentClass
      ? AGENT_CLASS_STYLES[agentClass]
      : isPet
        ? isPetSkill
          ? RARITY_STYLES.PET_SKILL
          : isPetS
            ? RARITY_STYLES.PET_S
            : RARITY_STYLES.PET_NORMAL
        : RARITY_STYLES[selectedEntry.rarity] || RARITY_STYLES.COMMON;

  const badgeLabel =
    isAgent && agentClass
      ? style.label
      : isEquipment
        ? selectedEntry.rarity === 'SS' || selectedEntry.subcategory === 'SS'
          ? 'SS'
          : 'S'
        : isPet
          ? isPetSkill
            ? '助战技能'
            : isPetS
              ? 'S级'
              : '普通'
          : selectedEntry.edition ||
          selectedEntry.subcategory ||
          selectedEntry.rarity;

  const displayTags = isAgent
    ? getAgentAllHeroBuffTags(selectedEntry)
    : selectedEntry.tags;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-3xl border border-slate-700 bg-[#0f172a] p-5 sm:p-6 space-y-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="关闭详情"
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-500 cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3.5 pr-12">
          <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-700 p-1.5 flex items-center justify-center shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedEntry.icon}
              alt={selectedEntry.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.onerror = null;
                target.src = '/wiki-assets/占位图.png';
              }}
            />
          </div>
          <div className="space-y-1">
            {!isTechPart && !isMount && !isMechanic && (
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${style.badge}`}
                >
                  {badgeLabel}
                </span>
              </div>
            )}
            <h2 className="text-xl font-black text-white">
              {selectedEntry.name}
            </h2>
            {selectedEntry.attributes.synergy && (
              <p className="text-[11px] text-amber-300 font-semibold">
                🔗 {selectedEntry.attributes.synergy}
              </p>
            )}
          </div>
        </div>

        {/* 配件专属实机截图风格顶部状态栏 */}
        {isTechPart && (
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-black">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-950/70 border border-sky-800/60 text-sky-300 shadow-sm">
              <span className="text-sm">🗡️</span>
              <span className="text-[11px] text-slate-400">攻击</span>
              <span className="text-white text-sm">6500</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-950/70 border border-rose-800/60 text-rose-300 shadow-sm">
              <span className="text-sm">❤️</span>
              <span className="text-[11px] text-slate-400">生命</span>
              <span className="text-white text-sm">26000</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-950/70 border border-purple-800/60 text-purple-300 shadow-sm">
              <span className="text-[11px] text-slate-400">配件类型</span>
              <span className="text-purple-200">双生</span>
              <span className="w-4 h-4 rounded-full bg-purple-600/90 text-[10px] flex items-center justify-center text-white font-bold ml-0.5">✦</span>
            </div>
            {selectedEntry.attributes.slot && (
              <div className="text-[11px] text-slate-400 ml-auto hidden sm:block">
                {selectedEntry.attributes.slot}
              </div>
            )}
          </div>
        )}

        {/* Summary (非收藏品、非装备、非宠物、非配件展示简介) */}
        {!isCollectible && !isEquipment && !isPet && !isTechPart && selectedEntry.summary && (
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3.5 text-xs text-slate-200 leading-relaxed">
            {selectedEntry.summary}
          </div>
        )}

        {/* 配件专属 3-Tab 切换界面 (品质技能/谐振/过载) */}
        {isTechPart && selectedEntry.attributes.techTabs ? (
          <div className="space-y-3 rounded-2xl bg-slate-950/70 border border-slate-800 p-4">
            {/* Tab Bar Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base sm:text-lg font-black text-white tracking-wide">
                {techTab === 'info' && '品质技能'}
                {techTab === 'harmony' && '谐振属性 (共54阶)'}
                {techTab === 'overload' && '过载属性 (共18级)'}
              </h3>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setTechTab('info')}
                  title="品质技能"
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${techTab === 'info'
                      ? 'bg-rose-600 text-white ring-2 ring-amber-300 ring-offset-2 ring-offset-slate-900 shadow-md shadow-rose-900/50 scale-105'
                      : 'bg-rose-950/60 text-rose-300/70 hover:bg-rose-800/80 hover:text-white'
                    }`}
                >
                  <Menu className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setTechTab('harmony')}
                  title="谐振"
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${techTab === 'harmony'
                      ? 'bg-amber-600 text-white ring-2 ring-amber-300 ring-offset-2 ring-offset-slate-900 shadow-md shadow-amber-900/50 scale-105'
                      : 'bg-amber-950/60 text-amber-300/70 hover:bg-amber-800/80 hover:text-white'
                    }`}
                >
                  <Zap className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setTechTab('overload')}
                  title="过载"
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${techTab === 'overload'
                      ? 'bg-sky-600 text-white ring-2 ring-amber-300 ring-offset-2 ring-offset-slate-900 shadow-md shadow-sky-900/50 scale-105'
                      : 'bg-sky-950/60 text-sky-300/70 hover:bg-sky-800/80 hover:text-white'
                    }`}
                >
                  <Flame className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tab 1: 品质技能 (5档) */}
            {techTab === 'info' && (
              <div className="space-y-2.5 max-h-[46vh] overflow-y-auto pr-1">
                {selectedEntry.attributes.techTabs.qualitySkills.map((qs, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/90"
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full shrink-0 mt-0.5 ${getQualityDotClass(
                        qs.quality.toString(),
                      )}`}
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white">
                          {qs.label}
                        </span>
                      </div>
                      <div className="text-xs text-slate-200 leading-relaxed space-y-1">
                        {qs.effect.split('\n').map((line, lIdx) => (
                          <p key={lIdx}>{formatSkillEffect(line)}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: 谐振 (54阶) */}
            {techTab === 'harmony' && (
              <div className="space-y-1.5 max-h-[46vh] overflow-y-auto pr-1">
                {selectedEntry.attributes.techTabs.harmony.map((item, idx) => {
                  const isKey = item.grade % 6 === 0;
                  return (
                    <div
                      key={idx}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-colors ${isKey
                          ? 'bg-amber-500/10 border-amber-500/40'
                          : 'bg-slate-900/50 border-slate-800/80'
                        }`}
                    >
                      <span
                        className={`text-[11px] font-black shrink-0 px-2 py-0.5 rounded ${isKey
                            ? 'bg-amber-500/30 text-amber-200 border border-amber-400/50'
                            : 'bg-slate-800 text-slate-300'
                          }`}
                      >
                        第{item.grade}阶 ({item.reqLevel})
                      </span>
                      <div className="text-xs text-slate-200 leading-snug flex-1">
                        {formatSkillEffect(item.desc)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tab 3: 过载 (18级) */}
            {techTab === 'overload' && (
              <div className="space-y-1.5 max-h-[46vh] overflow-y-auto pr-1">
                {selectedEntry.attributes.techTabs.overload.map((item, idx) => {
                  const isKey =
                    item.level === 6 ||
                    item.level === 12 ||
                    item.level === 15 ||
                    item.level === 18;
                  return (
                    <div
                      key={idx}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-colors ${isKey
                          ? 'bg-sky-500/10 border-sky-500/40'
                          : 'bg-slate-900/50 border-slate-800/80'
                        }`}
                    >
                      <span
                        className={`text-[11px] font-black shrink-0 px-2 py-0.5 rounded ${isKey
                            ? 'bg-sky-500/30 text-sky-200 border border-sky-400/50'
                            : 'bg-slate-800 text-slate-300'
                          }`}
                      >
                        Lv.{item.level} ({item.reqLevel})
                      </span>
                      <div className="text-xs text-slate-200 leading-snug flex-1">
                        {formatSkillEffect(item.desc)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : isEquipment ? (
          <div className="space-y-3 rounded-2xl bg-slate-950/70 border border-slate-800 p-4">
            {/* Tab Bar Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base sm:text-lg font-black text-white tracking-wide">
                {equipTab === 'info' && '品质技能'}
                {equipTab === 'godforge' && '神铸属性'}
                {equipTab === 'chaos' && '混沌融合'}
                {equipTab === 'refine' && '异星神炼'}
              </h3>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setEquipTab('info')}
                  title="简介 (品质技能)"
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${equipTab === 'info'
                      ? 'bg-rose-600 text-white ring-2 ring-amber-300 ring-offset-2 ring-offset-slate-900 shadow-md shadow-rose-900/50 scale-105'
                      : 'bg-rose-950/60 text-rose-300/70 hover:bg-rose-800/80 hover:text-white'
                    }`}
                >
                  <Menu className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setEquipTab('godforge')}
                  title="神铸属性"
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${equipTab === 'godforge'
                      ? 'bg-amber-600 text-white ring-2 ring-amber-300 ring-offset-2 ring-offset-slate-900 shadow-md shadow-amber-900/50 scale-105'
                      : 'bg-amber-950/60 text-amber-300/70 hover:bg-amber-800/80 hover:text-white'
                    }`}
                >
                  <Hammer className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setEquipTab('chaos')}
                  title="混沌融合"
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${equipTab === 'chaos'
                      ? 'bg-purple-600 text-white ring-2 ring-amber-300 ring-offset-2 ring-offset-slate-900 shadow-md shadow-purple-900/50 scale-105'
                      : 'bg-purple-950/60 text-purple-300/70 hover:bg-purple-800/80 hover:text-white'
                    }`}
                >
                  <Sparkles className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setEquipTab('refine')}
                  title="异星神炼"
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${equipTab === 'refine'
                      ? 'bg-sky-600 text-white ring-2 ring-amber-300 ring-offset-2 ring-offset-slate-900 shadow-md shadow-sky-900/50 scale-105'
                      : 'bg-sky-950/60 text-sky-300/70 hover:bg-sky-800/80 hover:text-white'
                    }`}
                >
                  <Zap className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-2 pt-1 max-h-[46vh] overflow-y-auto pr-1">
              {/* 1. 品质技能 */}
              {equipTab === 'info' && (
                <div className="space-y-2">
                  {selectedEntry.attributes.equipTabs?.qualitySkills?.map((skill, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/80 transition-colors"
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full shrink-0 mt-1 ${getQualityDotClass(
                          skill.quality
                        )}`}
                      />
                      <div className="text-xs text-white leading-relaxed font-medium">
                        {formatSkillEffect(skill.effect)}
                      </div>
                    </div>
                  ))}
                  {(!selectedEntry.attributes.equipTabs?.qualitySkills ||
                    selectedEntry.attributes.equipTabs.qualitySkills.length === 0) && (
                      <p className="text-xs text-slate-400 text-center py-4">暂无品质技能信息</p>
                    )}
                </div>
              )}

              {/* 2. 神铸属性 */}
              {equipTab === 'godforge' && (
                <div className="space-y-2">
                  {selectedEntry.attributes.equipTabs?.godforge?.map((gf, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border transition-colors ${gf.isKeyNode
                          ? 'bg-amber-500/10 border-amber-500/40'
                          : 'bg-slate-900/70 border-slate-800/80'
                        }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <span
                            className={`text-[11px] font-black shrink-0 px-2 py-0.5 rounded-md ${gf.stage.includes('永恒')
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : gf.stage.includes('破坏')
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                  : 'bg-slate-800 text-slate-200 border border-slate-700'
                              }`}
                          >
                            {gf.stage}
                          </span>
                          <div className="text-xs text-white leading-relaxed font-medium pt-0.5">
                            {formatSkillEffect(gf.effect)}
                          </div>
                        </div>
                        {gf.isKeyNode && (
                          <span title="关键节点" className="text-xs shrink-0 select-none">
                            🌟
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {(!selectedEntry.attributes.equipTabs?.godforge ||
                    selectedEntry.attributes.equipTabs.godforge.length === 0) && (
                      <p className="text-xs text-slate-400 text-center py-4">暂无神铸属性</p>
                    )}
                </div>
              )}

              {/* 3. 混沌融合 */}
              {equipTab === 'chaos' && (
                <div className="space-y-2">
                  {selectedEntry.attributes.equipTabs?.chaosFusion &&
                    selectedEntry.attributes.equipTabs.chaosFusion.length > 0 ? (
                    selectedEntry.attributes.equipTabs.chaosFusion.map((cf, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-start gap-2.5"
                      >
                        <span className="text-[11px] font-black shrink-0 px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/40">
                          {cf.stage}
                        </span>
                        <div className="text-xs text-white leading-relaxed font-medium pt-0.5">
                          {formatSkillEffect(cf.effect)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-6 text-center text-xs text-slate-400 space-y-1.5">
                      <p className="text-sm font-bold text-slate-200">暂无混沌融合系统</p>
                      <p className="text-[11px] text-slate-500">
                        混沌融合系统仅限 SS 级神器开放混沌融合共鸣
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* 4. 异星神炼 */}
              {equipTab === 'refine' && (
                <div className="space-y-2">
                  {selectedEntry.attributes.equipTabs?.alienRefinement &&
                    selectedEntry.attributes.equipTabs.alienRefinement.length > 0 ? (
                    selectedEntry.attributes.equipTabs.alienRefinement.map((rf, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-start gap-2.5"
                      >
                        <span className="text-[11px] font-black shrink-0 px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/40">
                          {rf.stage}
                        </span>
                        <div className="text-xs text-white leading-relaxed font-medium pt-0.5">
                          {formatSkillEffect(rf.effect)}
                        </div>
                      </div>
                    ))
                  ) : selectedEntry.name.includes('冰霜战靴') ? (
                    <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-6 text-center text-xs text-slate-400 space-y-1.5">
                      <p className="text-sm font-bold text-slate-200">
                        当前版本暂未开放冰霜战靴异星神炼
                      </p>
                      <p className="text-[11px] text-slate-500">
                        游戏当前版本解包数据中暂未包含冰霜战靴的神炼词条
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-6 text-center text-xs text-slate-400 space-y-1.5">
                      <p className="text-sm font-bold text-slate-200">暂无异星神炼系统</p>
                      <p className="text-[11px] text-slate-500">
                        异星神炼系统仅限 SS 级神器开放
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : isPet && selectedEntry.attributes.petDetail ? (
          /* 宠物专属详情展示：Tab 1 天赋与觉醒星级 / Tab 2 助战与技能池 */
          <div className="space-y-3.5">
            {/* 顶部 Tab 切换器 */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white">详细信息</span>
                <span className="text-xs text-slate-400 font-medium">
                  （{petTab === 'talent' ? '天赋与觉醒星级' : isPetS ? '异宠助战与洗练池' : '助战与出战技能池'}）
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setPetTab('talent')}
                  title="天赋与觉醒星级"
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${petTab === 'talent'
                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-300 ring-offset-2 ring-offset-slate-900 shadow-md shadow-emerald-900/50 scale-105'
                      : 'bg-emerald-950/60 text-emerald-300/70 hover:bg-emerald-800/80 hover:text-white'
                    }`}
                >
                  <Sparkles className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPetTab('support')}
                  title="助战与技能池"
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${petTab === 'support'
                      ? 'bg-amber-600 text-white ring-2 ring-amber-300 ring-offset-2 ring-offset-slate-900 shadow-md shadow-amber-900/50 scale-105'
                      : 'bg-amber-950/60 text-amber-300/70 hover:bg-amber-800/80 hover:text-white'
                    }`}
                >
                  <Shield className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tab 1: 天赋与觉醒星级 */}
            {petTab === 'talent' && (
              <div className="space-y-3.5 max-h-[48vh] overflow-y-auto pr-1">
                {/* 1. 天赋技能卡片区 */}
                {selectedEntry.attributes.petDetail.innateSkills &&
                  selectedEntry.attributes.petDetail.innateSkills.length > 0 && (
                    <div className="space-y-2">
                      {selectedEntry.attributes.petDetail.innateSkills.map(
                        (skill, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-900/90 border border-slate-800/90"
                          >
                            <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-700/80 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={skill.icon}
                                alt={skill.name}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  const target = e.currentTarget as HTMLImageElement;
                                  target.onerror = null;
                                  target.src = '/wiki-assets/占位图.png';
                                }}
                              />
                            </div>
                            <div className="text-xs text-white leading-relaxed font-medium">
                              <span className="font-bold text-white">
                                {skill.name}：
                              </span>
                              <span>{formatSkillEffect(skill.description)}</span>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  )}

                <div className="border-t border-slate-800/80 my-2" />

                {/* 2. 觉醒星级词条卡片区 */}
                {selectedEntry.attributes.petDetail.awakeningStars &&
                  selectedEntry.attributes.petDetail.awakeningStars.length > 0 && (
                    <div className="space-y-2.5">
                      {selectedEntry.attributes.petDetail.awakeningStars.map(
                        (starItem, sIdx) => {
                          const isYellow = starItem.tier === 'yellow';
                          return (
                            <div
                              key={sIdx}
                              className={`rounded-2xl p-3.5 space-y-1.5 border transition-colors ${isYellow
                                  ? 'bg-slate-900/80 border-slate-800'
                                  : 'bg-rose-950/20 border-rose-900/40'
                                }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: starItem.star }).map(
                                    (_, starIndex) => (
                                      <span
                                        key={starIndex}
                                        className={`text-sm ${isYellow
                                            ? 'text-amber-400'
                                            : 'text-rose-400'
                                          }`}
                                      >
                                        {isYellow ? '⭐' : '🌟'}
                                      </span>
                                    ),
                                  )}
                                </div>
                                <span
                                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isYellow
                                      ? 'bg-amber-400/10 text-amber-300 border border-amber-400/20'
                                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                    }`}
                                >
                                  {isYellow
                                    ? `黄${starItem.star}星`
                                    : `红${starItem.star}星`}
                                </span>
                              </div>

                              <div className="space-y-1 pt-0.5">
                                {starItem.lines.map((line, lIdx) => {
                                  const isSlotUpgrade =
                                    line.includes('助战技能上限提升') ||
                                    line.includes('出战技能槽位品质提升');
                                  return isSlotUpgrade ? (
                                    <p
                                      key={lIdx}
                                      className="text-xs text-slate-400 font-normal leading-relaxed"
                                    >
                                      {line}
                                    </p>
                                  ) : (
                                    <div
                                      key={lIdx}
                                      className="text-xs text-slate-200 leading-relaxed font-medium"
                                    >
                                      {formatSkillEffect(line)}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        },
                      )}
                    </div>
                  )}
              </div>
            )}

            {/* Tab 2: 助战与技能池 */}
            {petTab === 'support' && (
              <div className="space-y-3 max-h-[48vh] overflow-y-auto pr-1">
                {/* 如果是 S 级宠物：展示 13 项异宠助战/洗练被动技能 */}
                {isPetS ? (
                  <div className="space-y-2.5">
                    <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200/90 leading-relaxed">
                      💡 <span className="font-bold text-indigo-100">异宠洗练池说明：</span>
                      S级异宠在助战与洗练系统中可随机洗练出以下13种被动词条，数值随词条洗练品质在低阶与满阶之间浮动。
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedEntry.attributes.petDetail.passives?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-700/80 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.icon}
                              alt={item.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                const target = e.currentTarget as HTMLImageElement;
                                target.onerror = null;
                                target.src = '/wiki-assets/占位图.png';
                              }}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-bold text-white truncate">
                                {item.name}
                              </span>
                              {item.tierRange && (
                                <span className="text-[10px] font-mono font-bold text-indigo-300 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-800/60 shrink-0">
                                  {item.tierRange}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* 普通宠物：展示助战特技池 + 出战专属被动 */
                  <div className="space-y-3.5">
                    {/* 1. 助战特技池 */}
                    {selectedEntry.attributes.petDetail.supportSkills &&
                      selectedEntry.attributes.petDetail.supportSkills.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-amber-400">
                              🛡️ 助战特技（助战及出战位生效）
                            </span>
                          </div>
                          <div className="space-y-2">
                            {selectedEntry.attributes.petDetail.supportSkills.map(
                              (sSkill, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800"
                                >
                                  <div className="w-10 h-10 rounded-lg bg-slate-950 border border-amber-600/50 p-1 flex items-center justify-center shrink-0 overflow-hidden mt-0.5">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={sSkill.icon}
                                      alt={sSkill.name}
                                      className="w-full h-full object-contain"
                                      onError={(e) => {
                                        const target = e.currentTarget as HTMLImageElement;
                                        target.onerror = null;
                                        target.src = '/wiki-assets/占位图.png';
                                      }}
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-bold text-white">
                                        {sSkill.name}
                                      </span>
                                      <span className="text-[10px] font-black text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/60">
                                        助战
                                      </span>
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed mt-1">
                                      {formatSkillEffect(sSkill.description)}
                                    </p>
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                    {/* 2. 出战专属被动 */}
                    {selectedEntry.attributes.petDetail.passives &&
                      selectedEntry.attributes.petDetail.passives.length > 0 && (
                        <div className="space-y-2 pt-1 border-t border-slate-800/80">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-emerald-400">
                              ⚡ 专属出战被动（品质晋升解锁）
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {selectedEntry.attributes.petDetail.passives.map(
                              (pSkill, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800/90"
                                >
                                  <div className="w-9 h-9 rounded-lg bg-slate-950 border border-slate-700/80 p-0.5 flex items-center justify-center shrink-0 overflow-hidden mt-0.5">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={pSkill.icon}
                                      alt={pSkill.name}
                                      className="w-full h-full object-contain"
                                      onError={(e) => {
                                        const target = e.currentTarget as HTMLImageElement;
                                        target.onerror = null;
                                        target.src = '/wiki-assets/占位图.png';
                                      }}
                                    />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <span className="text-xs font-bold text-white block truncate">
                                      {pSkill.name}
                                    </span>
                                    <p className="text-[11px] text-slate-300 leading-snug mt-0.5 line-clamp-2">
                                      {formatSkillEffect(pSkill.description)}
                                    </p>
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* 非装备、非宠物、非配件条目 (特工 / 收藏品 / 技能等) 详细信息 */
          !isTechPart &&
          !isMechanic &&
          selectedEntry.attributes.milestones &&
          selectedEntry.attributes.milestones.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>详细信息</span>
              </h3>
              <div className="space-y-1.5 max-h-[46vh] overflow-y-auto pr-1">
                {selectedEntry.attributes.milestones.map((ms, idx) => (
                  <div
                    key={idx}
                    className={`rounded-xl px-3 py-2 border transition-colors ${ms.isKeyNode
                        ? 'bg-orange-500/12 border-orange-500/45'
                        : 'bg-slate-900/60 border-slate-800/90'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-baseline gap-2 min-w-0">
                        <span
                          className={`text-[11px] font-black shrink-0 ${ms.isKeyNode ? 'text-orange-300' : 'text-white'
                            }`}
                        >
                          {ms.stage}
                        </span>
                        <div
                          className={`text-[11px] leading-snug ${ms.isKeyNode
                              ? 'text-amber-100 font-semibold'
                              : 'text-slate-300'
                            }`}
                        >
                          {formatSkillEffect(ms.effect)}
                        </div>
                      </div>
                      {ms.isKeyNode && (
                        <span
                          title="关键节点"
                          className="text-xs shrink-0 select-none"
                        >
                          🌟
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {/* Tags */}
        <div className="rounded-xl bg-slate-950/80 border border-slate-800/80 p-3 text-[11px]">
          <div className="flex flex-wrap gap-1.5">
            {displayTags.map((t, i) => {
              const customStyle = isTechPart || isMount ? TECH_TAG_STYLES[t] : undefined;
              return (
                <span
                  key={i}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${customStyle || 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                >
                  {t}
                </span>
              );
            })}
          </div>
        </div>

        {/* Bottom Close Action */}
        <div className="flex items-center justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-7 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-sm cursor-pointer transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
