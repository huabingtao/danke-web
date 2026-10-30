"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, BookOpen } from 'lucide-react';

export interface PinCardProps {
  id: string;
  title: string;
  subtitle?: string;
  metaText?: string;
  imageSrc?: string;
  imageAlt?: string;
  fallbackGraphic?: React.ReactNode;
  ratio: number; // width / height, e.g. 3/4 = 0.75, 1/1 = 1, 900/384 = 2.34
  href: string;
  isExternal?: boolean;
  topBadge?: {
    text: string;
    color?: string; // e.g. 'bg-orange-500 text-slate-950'
  };
  actionText?: string;
  className?: string;
}

export default function PinCard({
  title,
  subtitle,
  metaText,
  imageSrc,
  imageAlt = '',
  fallbackGraphic,
  ratio,
  href,
  isExternal = false,
  topBadge,
  actionText = '阅读',
  className = '',
}: PinCardProps) {
  const [imageError, setImageError] = useState(false);

  const cardContent = (
    <div className={`group flex flex-col cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-3xl ${className}`}>
      {/* Pin Image Container */}
      <div
        className="relative w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-800/80 group-hover:border-slate-700 transition-all duration-300 shadow-md group-hover:shadow-2xl group-hover:shadow-orange-500/10"
        style={{ aspectRatio: `${ratio}` }}
      >
        {imageSrc && !imageError ? (
          <Image
            src={imageSrc}
            alt={imageAlt || title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
            onError={() => setImageError(true)}
          />
        ) : fallbackGraphic ? (
          <div className="w-full h-full flex items-center justify-center group-hover:scale-[1.03] transition-transform duration-500 ease-out">
            {fallbackGraphic}
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-850 flex items-center justify-center p-6 text-slate-500">
            <BookOpen className="w-10 h-10 opacity-40 text-orange-400" />
          </div>
        )}

        {/* Top-Left Badge */}
        {topBadge && (
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`px-2.5 py-1 rounded-xl text-xs font-black shadow-lg backdrop-blur-md ${
                topBadge.color || 'bg-orange-500 text-slate-950'
              }`}
            >
              {topBadge.text}
            </span>
          </div>
        )}

        {/* Hover Overlay with Action Pill */}
        <div className="absolute inset-0 bg-slate-950/45 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3.5 z-20 pointer-events-none">
          <div className="flex justify-end">
            <span className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full bg-orange-500 text-slate-950 text-xs font-black shadow-xl transform translate-y-1 group-hover:translate-y-0 transition-transform duration-200">
              <span>{actionText}</span>
              {isExternal ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : null}
            </span>
          </div>

          {subtitle && (
            <p className="text-xs text-slate-200 line-clamp-2 bg-slate-950/70 backdrop-blur-md p-2 rounded-xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Pin Description Area */}
      <div className="pt-2 px-1 flex flex-col space-y-1">
        <h3 className="text-sm font-bold text-slate-100 group-hover:text-orange-400 transition-colors line-clamp-2 leading-snug">
          {title}
        </h3>
        {metaText && (
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>{metaText}</span>
            {isExternal && (
              <span className="text-[10px] text-orange-400/80 font-semibold flex items-center">
                站外 <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block focus:outline-none"
        aria-label={title}
      >
        {cardContent}
      </a>
    );
  }

  return (
    <Link href={href} className="block focus:outline-none" aria-label={title}>
      {cardContent}
    </Link>
  );
}

