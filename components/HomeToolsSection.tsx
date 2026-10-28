"use client";

import Link from 'next/link';
import { Wrench, ArrowUpRight } from 'lucide-react';

export interface ToolEntry {
  id: string;
  name: string;
  desc: string;
  sourceLabel?: string;
  url: string;
  isExternal?: boolean;
}

interface HomeToolsSectionProps {
  availableTools?: ToolEntry[];
}

export default function HomeToolsSection({ availableTools = [] }: HomeToolsSectionProps) {
  if (!availableTools || availableTools.length === 0) {
    return null;
  }

  const displayTools = availableTools.slice(0, 4);

  return (
    <section id="tools-section" className="mb-10 sm:mb-12 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Wrench className="w-4 h-4 text-orange-400" />
          <h2 className="text-base sm:text-lg font-black text-white tracking-wide">
            Wiki 知识库与核心工具直达
          </h2>
        </div>

        <Link
          href="/items"
          className="text-xs text-slate-400 hover:text-orange-400 font-bold flex items-center space-x-1"
        >
          <span>进入完整 Wiki 图鉴</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayTools.map((tool) => {
          const content = (
            <div className="h-full p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-orange-500/50 transition-all duration-200 group flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-orange-400 transition-colors">
                    {tool.name}
                  </h3>
                  {tool.sourceLabel && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-300 shrink-0 font-bold">
                      {tool.sourceLabel}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {tool.desc}
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-end text-[11px] font-bold text-orange-400">
                <span>立即打开 →</span>
              </div>
            </div>
          );

          if (tool.isExternal) {
            return (
              <a
                key={tool.id}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {content}
              </a>
            );
          }

          return (
            <Link key={tool.id} href={tool.url}>
              {content}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
