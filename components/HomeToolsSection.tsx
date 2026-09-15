"use client";

import Link from 'next/link';
import { Wrench, ArrowUpRight } from 'lucide-react';

export interface ToolEntry {
  id: string;
  name: string;
  desc: string;
  sourceLabel?: string; // 外部工具来源标注
  url: string;
  isExternal?: boolean;
}

interface HomeToolsSectionProps {
  // 可用工具列表。若为空或未提供，则整块自动隐藏
  availableTools?: ToolEntry[];
}

export default function HomeToolsSection({ availableTools = [] }: HomeToolsSectionProps) {
  // 规则：如果没有可用工具，隐藏整个模块，不显示空白卡片或“敬请期待”
  if (!availableTools || availableTools.length === 0) {
    return null;
  }

  // 最多展示前3个工具入口
  const displayTools = availableTools.slice(0, 3);

  return (
    <section id="tools-section" className="mb-10 sm:mb-12 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Wrench className="w-4 h-4 text-blue-400" />
          <h2 className="text-base sm:text-lg font-black text-white tracking-wide">
            常用工具
          </h2>
        </div>

        <Link
          href="/tools"
          className="text-xs text-slate-400 hover:text-blue-400 font-bold flex items-center space-x-1"
        >
          <span>全部工具</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayTools.map((tool) => (
          <div
            key={tool.id}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 transition-all duration-200 group"
          >
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                {tool.name}
              </h3>
              {tool.sourceLabel && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  来源：{tool.sourceLabel}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
              {tool.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
