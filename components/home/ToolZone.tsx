"use client";

import Link from 'next/link';
import ZoneHeader from './ZoneHeader';
import { HOME_TOOLS, HomeToolItem } from '@/lib/home-config';

interface ToolZoneProps {
  tools?: HomeToolItem[];
}

export default function ToolZone({ tools = HOME_TOOLS }: ToolZoneProps) {
  return (
    <section className="space-y-3">
      <ZoneHeader
        id="zone-tools"
        title="弹壳工具"
      />

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const cardInner = (
            <div
              className={`group relative w-full aspect-square rounded-3xl bg-gradient-to-br ${tool.gradient} p-5 sm:p-6 flex flex-col items-center justify-center border border-slate-800 hover:border-orange-500/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-orange-500/10 cursor-pointer overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500`}
            >
              {/* Center Enlarged Graphic & Title */}
              <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-5 text-center">
                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-3xl bg-slate-900/90 border border-slate-700/60 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:border-orange-500/40 transition-all duration-300">
                  <Icon className="w-8 h-8 sm:w-12 sm:h-12 text-orange-400" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-white group-hover:text-orange-400 transition-colors line-clamp-1 px-1">
                  {tool.name}
                </h3>
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
                className="block focus:outline-none"
                aria-label={tool.name}
              >
                {cardInner}
              </a>
            );
          }

          return (
            <Link key={tool.id} href={tool.url} className="block focus:outline-none" aria-label={tool.name}>
              {cardInner}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
