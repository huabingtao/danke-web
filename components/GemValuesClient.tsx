'use client';

import Image from 'next/image';
import { RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchGemCatalog, formatGemValue, gemGroups, type GemCatalog } from '@/lib/gem-values';
import ResourceIcon from './ResourceIcon';
import ResourceCategoryBar from './ResourceCategoryBar';

type LoadState = { status: 'loading' } | { status: 'error'; message: string } | { status: 'ready'; catalog: GemCatalog };

export default function GemValuesClient() {
  const [state, setState] = useState<LoadState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [selected, setSelected] = useState('all');
  useEffect(() => {
    const controller = new AbortController();
    fetchGemCatalog(controller.signal).then((catalog) => {
      if (!controller.signal.aborted) {
        const category = new URLSearchParams(window.location.search).get('category');
        if (category && catalog.categories.some((entry) => entry.id === category)) setSelected(category);
        setState({ status: 'ready', catalog });
      }
    }).catch(() => {
      if (!controller.signal.aborted) setState({ status: 'error', message: '暂时无法加载道具价值，请检查网络后重试' });
    });
    return () => controller.abort();
  }, [attempt]);

  const catalog = state.status === 'ready' ? state.catalog : null;
  const groups = catalog ? gemGroups(catalog, selected) : [];
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">道具价值</h1>
      {state.status === 'loading' && <div role="status" aria-label="正在加载道具价值" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"><span className="sr-only">正在加载道具价值</span>{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-24 rounded-2xl border border-slate-800 bg-slate-900/70 motion-safe:animate-pulse" aria-hidden="true" />)}</div>}
      {state.status === 'error' && <div role="alert" className="flex flex-col items-start gap-4 rounded-2xl border border-slate-700 bg-slate-900/70 p-6"><p className="text-slate-200">{state.message}</p><button type="button" onClick={() => { setState({ status: 'loading' }); setAttempt((value) => value + 1); }} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-orange-500/50 px-4 text-sm font-bold text-orange-300 hover:bg-orange-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"><RotateCcw aria-hidden="true" className="h-4 w-4" />重新加载</button></div>}
      {catalog && <>
        <div className="sticky top-16 z-20 min-w-0 border-y border-slate-800 bg-[#0a0f1d]/95 py-3 backdrop-blur-xl">
          <ResourceCategoryBar categories={catalog.categories} selected={selected} onSelect={setSelected} label="道具价值分类" />
        </div>
        {!catalog.items.length && <p role="status" className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-slate-300">暂无道具价值数据</p>}
        {catalog.items.length > 0 && groups.map((group) => <section key={group.id} aria-label={`${group.name}道具价值`} className="min-w-0 rounded-2xl border border-slate-700/70 bg-slate-800/60 p-4 sm:p-6">
          <h2 className="mb-4 flex items-baseline gap-2 text-lg font-bold text-slate-100">{group.name}<span className="text-sm font-normal tabular-nums text-slate-400">{group.items.length}</span></h2>
          {!group.items.length ? <p className="text-sm text-slate-400">该分类暂无道具</p> : <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">{group.items.map((item) => <article key={item.id} aria-label={item.name} className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-600/40 bg-slate-700/35 px-3 py-4">
            <ResourceIcon src={item.icon} name={item.name} />
            <h3 className="min-w-0 flex-1 break-words text-sm font-medium leading-6 text-slate-100 sm:text-base">{item.name}</h3>
            {!item.prices.length ? <span className="shrink-0 text-xs text-slate-400">未配置</span> : <dl className="flex max-w-[50%] shrink-0 flex-col gap-2">{item.prices.map((price) => <div key={price.id} className="flex flex-col items-end gap-1">
              <dt className="text-xs text-slate-400">{price.label}</dt>
              <dd className="flex min-w-0 items-center gap-1.5 font-bold tabular-nums text-slate-50"><span className="min-w-0 break-all">{formatGemValue(price.value)}</span><Image src="/wiki-assets/道具/钻石.png" alt="钻石" width={20} height={20} className="shrink-0 object-contain" /></dd>
            </div>)}</dl>}
          </article>)}</div>}
        </section>)}
      </>}
    </div>
  );
}
