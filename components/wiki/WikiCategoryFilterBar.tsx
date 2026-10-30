"use client";

import React from 'react';
import { Filter } from 'lucide-react';
import { COLLECTIBLE_EDITIONS } from '@/lib/wiki-helpers';

interface WikiCategoryFilterBarProps {
  activeCategory: string;
  quickFilter: string;
  onQuickFilterChange: (filter: string) => void;
  selectedEdition?: string;
  onEditionChange?: (edition: string) => void;
}

export default function WikiCategoryFilterBar({
  activeCategory,
  quickFilter,
  onQuickFilterChange,
  selectedEdition = 'ALL',
  onEditionChange,
}: WikiCategoryFilterBarProps) {
  if (activeCategory === 'AGENT') {
    const agentFilters = [
      {
        key: 'ALL',
        label: '全部特工',
        activeClass: 'bg-orange-500 text-slate-950 border-orange-400',
      },
      {
        key: 'AGENT_SP',
        label: 'SP',
        activeClass: 'bg-red-600 text-white border-red-500',
      },
      {
        key: 'AGENT_S',
        label: 'S',
        activeClass: 'bg-amber-400 text-slate-950 border-amber-300',
      },
      {
        key: 'AGENT_NORMAL',
        label: '普通',
        activeClass: 'bg-blue-500 text-white border-blue-400',
      },
    ];

    return (
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-orange-500/25 bg-slate-900/80 p-3.5">
        <span className="text-xs font-bold text-orange-400 inline-flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5" /> 特工分类:
        </span>
        {agentFilters.map((flt) => (
          <button
            key={flt.key}
            onClick={() => onQuickFilterChange(flt.key)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${quickFilter === flt.key
                ? flt.activeClass
                : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-orange-500/40'
              }`}
          >
            {flt.label}
          </button>
        ))}
      </div>
    );
  }

  if (activeCategory === 'COLLECTIBLE') {
    return (
      <div className="rounded-2xl border border-amber-500/25 bg-slate-900/80 p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: 'ALL', label: '全部' },
            { key: 'CRIT_RATE', label: '暴击率' },
            { key: 'CRIT_DMG', label: '暴击伤害' },
          ].map((flt) => (
            <button
              key={flt.key}
              onClick={() => onQuickFilterChange(flt.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${quickFilter === flt.key
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-amber-500/40'
                }`}
            >
              {flt.label}
            </button>
          ))}
        </div>

        {onEditionChange && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/80">
            {COLLECTIBLE_EDITIONS.map((ed) => (
              <button
                key={ed}
                onClick={() => onEditionChange(ed)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${selectedEdition === ed
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/50'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800/60'
                  }`}
              >
                {ed === 'ALL' ? '全部' : ed}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (activeCategory === 'EQUIPMENT') {
    return (
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-blue-500/25 bg-slate-900/80 p-3.5">
        {[
          { key: 'ALL', label: '全部装备' },
          { key: 'SS_EQUIP', label: 'SS装备' },
          { key: 'S_EQUIP', label: 'S装备' },
        ].map((flt) => (
          <button
            key={flt.key}
            onClick={() => onQuickFilterChange(flt.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${quickFilter === flt.key
                ? 'bg-blue-500 text-slate-950 border-blue-400'
                : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-blue-500/40'
              }`}
          >
            {flt.label}
          </button>
        ))}
      </div>
    );
  }

  if (activeCategory === 'PET') {
    return (
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-emerald-500/25 bg-slate-900/80 p-3.5">
        {[
          { key: 'ALL', label: '全部宠物' },
          { key: 'S_PET', label: 'S级宠物' },
          { key: 'NORMAL_PET', label: '普通宠物' },
        ].map((flt) => (
          <button
            key={flt.key}
            onClick={() => onQuickFilterChange(flt.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${quickFilter === flt.key
                ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-emerald-500/40'
              }`}
          >
            {flt.label}
          </button>
        ))}
      </div>
    );
  }

  if (activeCategory === 'MECHANIC') {
    const mechanicFilters = [
      { key: 'ALL', label: '全部' },
      { key: '核心', label: '核心' },
      { key: '钥匙', label: '钥匙' },
      { key: '碎片', label: '碎片' },
      { key: '宝箱', label: '宝箱' },
      { key: '图纸', label: '图纸' },
      { key: '材料', label: '材料' },
    ];

    return (
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-blue-500/25 bg-slate-900/80 p-3.5">
        <span className="text-xs font-bold text-blue-400 inline-flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5" /> 物品分类:
        </span>
        {mechanicFilters.map((flt) => (
          <button
            key={flt.key}
            onClick={() => onQuickFilterChange(flt.key)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
              quickFilter === flt.key
                ? 'bg-blue-500 text-slate-950 border-blue-400'
                : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-blue-500/40'
            }`}
          >
            {flt.label}
          </button>
        ))}
      </div>
    );
  }

  return null;
}

