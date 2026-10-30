"use client";

import React from 'react';
import { WikiEntryItem } from '@/lib/local-wiki-data';
import {
  AGENT_CLASS_STYLES,
  RARITY_STYLES,
  getAgentAllHeroBuffTags,
  getAgentClass,
} from '@/lib/wiki-helpers';

interface WikiEntryCardProps {
  entry: WikiEntryItem;
  onSelect: (entry: WikiEntryItem) => void;
}

export default function WikiEntryCard({ entry, onSelect }: WikiEntryCardProps) {
  const isAgent = entry.category === 'AGENT';
  const isCollectible = entry.category === 'COLLECTIBLE';
  const isEquipment = entry.category === 'EQUIPMENT';
  const isPet = entry.category === 'PET';
  const isTechPart = entry.category === 'TECH_PART';
  const isMount = entry.category === 'MOUNT';

  const isPetSkill =
    isPet &&
    (entry.subcategory === '宠物助战技能' ||
      entry.subcategory === '助战技能' ||
      entry.tags.includes('助战技能'));
  const isPetS =
    isPet &&
    !isPetSkill &&
    (entry.subcategory === 'S级宠物' ||
      entry.subcategory === 'S级' ||
      entry.rarity === 'S');

  const agentClass = isAgent ? getAgentClass(entry) : null;
  const style =
    isAgent && agentClass
      ? AGENT_CLASS_STYLES[agentClass]
      : isPet
      ? isPetSkill
        ? RARITY_STYLES.PET_SKILL
        : isPetS
        ? RARITY_STYLES.PET_S
        : RARITY_STYLES.PET_NORMAL
      : RARITY_STYLES[entry.rarity] || RARITY_STYLES.COMMON;

  const badgeLabel =
    isAgent && agentClass
      ? style.label
      : isEquipment
      ? entry.rarity === 'SS' || entry.subcategory === 'SS'
        ? 'SS'
        : 'S'
      : isPet
      ? isPetSkill
        ? '助战技能'
        : isPetS
        ? 'S级'
        : '普通'
      : entry.edition || entry.subcategory || style.label;

  const displayTags = isAgent
    ? getAgentAllHeroBuffTags(entry)
    : isTechPart || isMount
    ? entry.tags
    : entry.tags.slice(0, 3);

  return (
    <div
      onClick={() => onSelect(entry)}
      className={`group relative rounded-2xl border ${style.border} bg-gradient-to-b ${style.glow} p-4 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-lg cursor-pointer`}
    >
      <div>
        {/* Top Header: Icon + Name on left, Tag/Badge on top right */}
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="relative w-14 h-14 rounded-2xl bg-slate-950/90 border border-slate-700/80 flex items-center justify-center p-1.5 shrink-0 overflow-hidden shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={entry.icon}
                alt={entry.name}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-200"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/wiki-assets/占位图.png';
                }}
              />
            </div>

            <div className="min-w-0">
              <h3 className="text-base font-black text-white truncate group-hover:text-orange-400 transition-colors">
                {entry.name}
              </h3>
            </div>
          </div>

          {/* Right badge (所有分类卡片仅保留品级/分类Tag，彻底移除冗余T0文字；配件与载具分类删除右上角标签) */}
          {!isTechPart && !isMount && (
            <div className="shrink-0 flex items-center gap-1 pt-0.5">
              <span
                className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${style.badge}`}
              >
                {badgeLabel}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tags Preview (所有分类统一仅保留特性标签，彻底移除卡片左下角文字与右下角「查看节点」按钮) */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {displayTags.map((tag, idx) => {
            const isEquipSS =
              isEquipment &&
              (tag === 'SS' || tag === 'SS神器' || tag === 'SS装备');
            const isEquipS =
              isEquipment &&
              (tag === 'S' || tag === 'S级装备' || tag === 'S装备');
            const isTagPetS =
              isPet &&
              (tag === 'S级' || tag === 'S级宠物' || tag === 'S');
            const isTagPetNormal =
              isPet &&
              (tag === '普通' || tag === '普通宠物');
            const tagStyle = isEquipSS
              ? 'bg-gradient-to-r from-rose-500 via-amber-400 to-cyan-400 text-slate-950 font-black border-transparent'
              : isEquipS
              ? 'bg-[#00b4ff] text-slate-950 font-black border-transparent'
              : isTagPetS
              ? 'bg-gradient-to-r from-slate-200 via-indigo-200 to-pink-200 text-slate-950 font-black border-white/80'
              : isTagPetNormal
              ? 'bg-blue-500 text-white font-bold border-transparent'
              : isTechPart || isMount
              ? tag === '毒伤'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                : tag === '冰缓'
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 font-bold'
                : tag === '裂伤'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold'
                : tag === '衰弱'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-bold'
                : tag === '易伤'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                : tag === '首领伤害'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                : tag === '重伤'
                ? 'bg-red-500/20 text-red-300 border-red-500/40 font-bold'
                : tag === '流血'
                ? 'bg-pink-500/20 text-pink-300 border-pink-500/40 font-bold'
                : tag === '护盾增伤'
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 font-bold'
                : tag === '暴击伤害'
                ? 'bg-orange-500/20 text-orange-300 border-orange-500/40 font-bold'
                : tag === '技能伤害'
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-bold'
                : tag === '减速'
                ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 font-bold'
                : tag === '引燃'
                ? 'bg-amber-600/20 text-amber-400 border-amber-600/40 font-bold'
                : 'bg-slate-950/80 border-slate-800 text-slate-300'
              : 'bg-slate-950/80 border-slate-800 text-slate-300';
            return (
              <span
                key={idx}
                className={`text-[10px] px-2 py-0.5 rounded-md border ${tagStyle}`}
              >
                {tag}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

