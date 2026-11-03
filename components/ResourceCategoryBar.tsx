'use client';

import { Grid2X2 } from 'lucide-react';
import type { GemCategory } from '@/lib/gem-values';
import ResourceIcon from './ResourceIcon';

export default function ResourceCategoryBar({ categories, selected, onSelect, label }: {
  categories: GemCategory[]; selected: string; onSelect: (id: string) => void; label: string;
}) {
  return <div role="group" aria-label={label} className="flex min-w-0 gap-2 overflow-x-auto pb-1">
    {[{ id: 'all', name: '全部', icon: null }, ...categories].map((category) => <button key={category.id} type="button" aria-pressed={selected === category.id} onClick={() => onSelect(category.id)} className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border px-3 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-400 ${selected === category.id ? 'border-orange-400 bg-orange-500/15 text-orange-300' : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500'}`}>
      {category.id === 'all' ? <Grid2X2 aria-hidden="true" className="h-5 w-5" /> : <span aria-hidden="true"><ResourceIcon src={category.icon} name={`${category.name}分类`} size={26} /></span>}
      {category.name}
    </button>)}
  </div>;
}
