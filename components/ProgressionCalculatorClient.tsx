"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calculator,
  BookOpen,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Layers,
  Swords,
  Flame,
  Shield,
  Award,
  Cpu,
} from 'lucide-react';
import TopNavBar from '@/components/TopNavBar';
import FooterSection from '@/components/FooterSection';
import { ProgressionMatrixItem } from '@/lib/local-wiki-data';

interface ProgressionCalculatorClientProps {
  initialMatrices: ProgressionMatrixItem[];
}

interface CoreStepTrack {
  id: string;
  name: string;
  unit: string;
  icon: string;
  steps: { label: string; cumulative: number; benefit: string }[];
}

const CORE_CALCULATOR_TRACKS: CoreStepTrack[] = [
  {
    id: 'xeno-forge',
    name: 'SS三部位神炼（衣/武/手）',
    unit: '神炼核心',
    icon: '/wiki-assets/道具/神炼核心.png',
    steps: [
      { label: '未开启神炼（0级）', cumulative: 0, benefit: '需先将目标装备升至永恒4+破坏4' },
      { label: '阶段1：衣2 / 武2 / 手2', cumulative: 6, benefit: '三部位全部激活神炼2，大幅降低触发门槛' },
      { label: '阶段2：衣2 / 武3 / 手3', cumulative: 10, benefit: '优先拉高双绝枪与月殇护手输出乘区' },
      { label: '阶段3：衣2 / 武5 / 手5 🔥', cumulative: 22, benefit: '武器与手套神炼词条大成，性价比极高' },
      { label: '阶段4：衣5 / 武5 / 手5', cumulative: 30, benefit: '衣服补齐神炼5，三部位齐平' },
      { label: '阶段5：衣6 / 武6 / 手6 👑', cumulative: 42, benefit: '三部位神炼6满级毕业形态' },
    ],
  },
  {
    id: 'pet-core',
    name: '异宠核心助战槽位与觉醒',
    unit: '异宠核心',
    icon: '/wiki-assets/道具/异宠核心.png',
    steps: [
      { label: '初始解锁S宠（第1、2槽）', cumulative: 0, benefit: '4只同类型普通宠5黄星即可开启' },
      { label: '入门节点（11核觉醒过渡）', cumulative: 11, benefit: '主力幽暗之灵初步觉醒提升共鸣率' },
      { label: '质变节点一：开启第3助战槽 🌟', cumulative: 21, benefit: '解锁第3助战槽，配齐共鸣伤害+共鸣增幅+守护' },
      { label: '质变节点二：开启第4助战槽 🔥', cumulative: 50, benefit: '解锁第4助战槽，3只5红星同名S宠达100%共鸣率' },
      { label: '进阶节点三：开启第5助战槽', cumulative: 90, benefit: '解锁第5助战槽，补齐毒/衰/冰异常增伤' },
      { label: '终极节点四：开启第6助战槽 👑', cumulative: 150, benefit: '解锁全部6个助战槽位，吃满独立共鸣伤害' },
    ],
  },
  {
    id: 'agent-core',
    name: 'S特工协同红星路线（543~844）',
    unit: '特工觉醒核心',
    icon: '/wiki-assets/道具/特工觉醒核心.png',
    steps: [
      { label: '开荒期（塔洛西娅未觉醒）', cumulative: 0, benefit: '120 S碎片解锁塔洛西娅过渡' },
      { label: '543 节点（中红5+左红3+右红4）🌟', cumulative: 54, benefit: '凑满协同12星，左位凛音全程不断毒' },
      { label: '741 节点（中维托尔红7+左红1+右红4）🔥', cumulative: 112, benefit: '开启3个连携技能槽位，爆发大幅跃升' },
      { label: '840 节点（中维托尔红8+左金6+右红4）', cumulative: 141, benefit: '开启4个连携技能槽位，凛音金6不觉醒放左位' },
      { label: '844 顶配（中伊狑红8+左红4+右红4）👑', cumulative: 156, benefit: '召唤第1助战宠上场，配红5河豚或超武挂毒' },
    ],
  },
];

const MATRIX_ICONS: Record<string, any> = {
  EQUIPMENT: Swords,
  AGENT: Flame,
  PET: Shield,
  COLLECTIBLE: Award,
  TECH_PART: Cpu,
};

export default function ProgressionCalculatorClient({
  initialMatrices,
}: ProgressionCalculatorClientProps) {
  const [activeCode, setActiveCode] = useState<string>(
    initialMatrices[0]?.code || 'ss-equip-synthesis-and-forge',
  );
  const [selectedTrackId, setSelectedTrackId] = useState<string>(
    CORE_CALCULATOR_TRACKS[0].id,
  );
  const [fromStepIdx, setFromStepIdx] = useState<number>(0);
  const [toStepIdx, setToStepIdx] = useState<number>(3);

  const activeMatrix = useMemo(
    () =>
      initialMatrices.find((m) => m.code === activeCode) || initialMatrices[0],
    [initialMatrices, activeCode],
  );

  const activeTrack = useMemo(
    () =>
      CORE_CALCULATOR_TRACKS.find((t) => t.id === selectedTrackId) ||
      CORE_CALCULATOR_TRACKS[0],
    [selectedTrackId],
  );

  const safeFromIdx = Math.min(fromStepIdx, activeTrack.steps.length - 1);
  const safeToIdx = Math.max(
    safeFromIdx,
    Math.min(toStepIdx, activeTrack.steps.length - 1),
  );
  const neededCores =
    activeTrack.steps[safeToIdx].cumulative -
    activeTrack.steps[safeFromIdx].cumulative;

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1d] text-slate-100 selection:bg-orange-500 selection:text-slate-950">
      <TopNavBar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10">
        {/* 1. Hero Header */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-800/90 bg-gradient-to-br from-slate-900/95 via-[#111a2e]/95 to-slate-950 p-6 sm:p-10 shadow-2xl">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
                <Calculator className="w-3.5 h-3.5" />
                <span>弹壳呱呱 · 养成消耗与最佳停手节点精算中心</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                五大核心养成矩阵 & 阶段差额速算器
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                将散落在数十篇攻略中的 <span className="text-orange-400 font-semibold">SS合成与神炼顺位、543/741/840/844特工核心、11~162异宠核心槽位、1~10期暴击/红藏优先级、双生配件与载具洗练</span> 濃縮为标准对照表。
              </p>
            </div>

            <div className="flex flex-wrap gap-3 shrink-0">
              <Link
                href="/items"
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-orange-500/25 transition-all"
              >
                <Layers className="w-4 h-4" />
                <span>浏览 158+ 百科图鉴词条</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 2. 模块 A：核心材料阶段差额速算器 */}
        <section className="rounded-3xl border border-orange-500/30 bg-[#11192c]/95 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2.5">
              <Calculator className="w-5 h-5 text-orange-400" />
              <h2 className="text-lg sm:text-xl font-black text-white">
                核心材料阶段差额速算器
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {CORE_CALCULATOR_TRACKS.map((track) => (
                <button
                  key={track.id}
                  onClick={() => {
                    setSelectedTrackId(track.id);
                    setFromStepIdx(0);
                    setToStepIdx(Math.min(2, track.steps.length - 1));
                  }}
                  className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    selectedTrackId === track.id
                      ? 'bg-orange-500 text-slate-950 border-orange-400'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-orange-500/40'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={track.icon}
                    alt={track.unit}
                    className="w-4 h-4 object-contain"
                  />
                  <span>{track.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* 起点选择 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400">
                当前所处节点（已达成）:
              </label>
              <select
                value={safeFromIdx}
                onChange={(e) => {
                  const nextFrom = Number(e.target.value);
                  setFromStepIdx(nextFrom);
                  if (toStepIdx < nextFrom) setToStepIdx(nextFrom);
                }}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-sm font-bold text-white focus:border-orange-500 focus:outline-none"
              >
                {activeTrack.steps.map((st, idx) => (
                  <option key={idx} value={idx}>
                    {st.label}（累计 {st.cumulative} {activeTrack.unit}）
                  </option>
                ))}
              </select>
            </div>

            {/* 目标选择 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-orange-400">
                目标冲刺节点:
              </label>
              <select
                value={safeToIdx}
                onChange={(e) => setToStepIdx(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-orange-500/50 text-sm font-bold text-white focus:border-orange-400 focus:outline-none"
              >
                {activeTrack.steps.map((st, idx) => (
                  <option key={idx} value={idx} disabled={idx < safeFromIdx}>
                    {st.label}（累计 {st.cumulative} {activeTrack.unit}）
                  </option>
                ))}
              </select>
            </div>

            {/* 差额计算结果 */}
            <div className="rounded-2xl bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-slate-950 border border-orange-500/40 p-4 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-300">
                  还需补充 {activeTrack.unit}:
                </span>
                <span className="text-2xl font-black text-white">
                  +{neededCores} <small className="text-xs font-normal text-slate-300">个</small>
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                🎯 达成收益：{activeTrack.steps[safeToIdx].benefit}
              </p>
            </div>
          </div>
        </section>

        {/* 3. 模块 B：五大核心养成优先级与消耗矩阵切换器 */}
        <section className="space-y-5">
          <div className="flex flex-wrap gap-2">
            {initialMatrices.map((matrix) => {
              const Icon = MATRIX_ICONS[matrix.category] || Sparkles;
              const isActive = matrix.code === activeMatrix?.code;
              return (
                <button
                  key={matrix.code}
                  onClick={() => setActiveCode(matrix.code)}
                  className={`inline-flex items-center space-x-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-orange-500 text-slate-950 border-orange-400 shadow-lg shadow-orange-500/25'
                      : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{matrix.title}</span>
                </button>
              );
            })}
          </div>

          {activeMatrix && (
            <div className="rounded-3xl border border-slate-800 bg-[#11192c]/95 p-6 sm:p-8 shadow-2xl space-y-6">
              {/* Matrix Header & Summary */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
                <div className="space-y-2 max-w-3xl">
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {activeMatrix.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {activeMatrix.summary}
                  </p>
                </div>

                {activeMatrix.relatedArticleSlug && (
                  <Link
                    href={`/strategies/${activeMatrix.relatedArticleSlug}`}
                    className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/40 text-orange-300 text-xs font-bold shrink-0 transition-all"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>阅读原版深度图文攻略</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>

              {/* Matrix Data Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/80">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/90">
                      {activeMatrix.columns.map((col) => (
                        <th
                          key={col.key}
                          className={`px-4 py-3.5 text-xs font-black uppercase tracking-wider ${
                            col.highlight ? 'text-orange-400' : 'text-slate-300'
                          }`}
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70 text-xs sm:text-sm">
                    {activeMatrix.rows.map((row, rIdx) => {
                      const isKeyRow = Object.values(row).some(
                        (v) =>
                          typeof v === 'string' &&
                          (v.includes('🌟') || v.includes('🔥') || v.includes('👑')),
                      );
                      return (
                        <tr
                          key={rIdx}
                          className={
                            isKeyRow
                              ? 'bg-orange-500/5 hover:bg-orange-500/10 transition-colors'
                              : 'hover:bg-slate-900/50 transition-colors'
                          }
                        >
                          {activeMatrix.columns.map((col) => (
                            <td
                              key={col.key}
                              className={`px-4 py-3.5 leading-relaxed ${
                                col.highlight
                                  ? 'font-bold text-white'
                                  : 'text-slate-300'
                              }`}
                            >
                              {row[col.key]}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Tiered Recommendations */}
              {activeMatrix.recommendations &&
                activeMatrix.recommendations.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>分档投入建议与避坑指南</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {activeMatrix.recommendations.map((rec, idx) => (
                        <div
                          key={idx}
                          className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-2"
                        >
                          <span className="inline-block text-[11px] font-black px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                            {rec.tier}
                          </span>
                          <p className="text-sm font-bold text-white">
                            {rec.target}
                          </p>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {rec.reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}
        </section>
      </main>

      <FooterSection />
    </div>
  );
}
