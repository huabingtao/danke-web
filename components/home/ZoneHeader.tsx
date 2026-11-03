"use client";

import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

interface ZoneHeaderProps {
  id?: string;
  title: string;
  viewAllText?: string;
  viewAllHref?: string;
  className?: string;
  actions?: ReactNode;
}

export default function ZoneHeader({
  id,
  title,
  viewAllText = '查看全部',
  viewAllHref,
  className = '',
  actions,
}: ZoneHeaderProps) {
  return (
    <div id={id} className={`flex items-center justify-between pb-2 mb-3.5 sm:mb-4 border-b border-slate-800/60 scroll-mt-20 ${className}`}>
      <div className="flex items-center space-x-2">
        <div className="w-1.5 h-4 rounded-full bg-orange-500" />
        <h2 className="text-base sm:text-lg font-black text-white tracking-wide">
          {title}
        </h2>
      </div>

      {actions ?? (viewAllHref && (
        <Link
          href={viewAllHref}
          className="group inline-flex items-center space-x-1 text-xs font-bold text-slate-400 hover:text-orange-400 transition-colors"
        >
          <span>{viewAllText}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      ))}
    </div>
  );
}

