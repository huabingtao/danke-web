"use client";

import React, { useMemo, useSyncExternalStore } from 'react';

export function distributeItems<T extends { ratio: number }>(items: T[], cols: number): T[][] {
  const columnCount = Math.max(1, cols);
  const heights = Array(columnCount).fill(0);
  const columns: T[][] = Array.from({ length: columnCount }, () => []);

  items.forEach((item) => {
    let minIdx = 0;
    let minH = heights[0];
    for (let i = 1; i < columnCount; i++) {
      if (heights[i] < minH) {
        minH = heights[i];
        minIdx = i;
      }
    }
    columns[minIdx].push(item);
    heights[minIdx] += 1 / (item.ratio > 0 ? item.ratio : 1);
  });

  return columns;
}

const subscribe = (callback: () => void) => {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
};

const getSnapshot = () => (typeof window !== 'undefined' ? window.innerWidth : 1280);
const getServerSnapshot = () => 1280;

interface MasonryGridProps<T extends { id: string; ratio: number }> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  maxCols?: number;
  className?: string;
}

export default function MasonryGrid<T extends { id: string; ratio: number }>({
  items,
  renderItem,
  maxCols = 6,
  className = '',
}: MasonryGridProps<T>) {
  const windowWidth = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const cols = useMemo(() => {
    let c = 2;
    if (windowWidth >= 1536) c = 6;
    else if (windowWidth >= 1280) c = 5;
    else if (windowWidth >= 1024) c = 4;
    else if (windowWidth >= 640) c = 3;
    else c = 2;
    return Math.min(c, maxCols, Math.max(1, items.length));
  }, [windowWidth, maxCols, items.length]);

  const columns = useMemo(() => distributeItems(items, cols), [items, cols]);

  return (
    <div
      className={`grid gap-3.5 sm:gap-4.5 ${className}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      }}
    >
      {columns.map((colItems, colIdx) => (
        <div key={colIdx} className="flex flex-col gap-3.5 sm:gap-4.5">
          {colItems.map((item) => (
            <div key={item.id} className="w-full">
              {renderItem(item)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
