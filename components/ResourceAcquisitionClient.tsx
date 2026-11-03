'use client';

import { ChevronDown, ChevronUp, Search, RotateCcw } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { formatGemValue } from '@/lib/gem-values';
import { acquisitionResources, acquisitionSources, fetchAcquisitionSnapshot, formatAcquisitionTotal, type AcquisitionSnapshot } from '@/lib/resource-acquisition';
import ResourceIcon from './ResourceIcon';
import ResourceCategoryBar from './ResourceCategoryBar';
import AcquisitionColumns from './AcquisitionColumns';

type LoadState = { status: 'loading' } | { status: 'error' } | { status: 'ready'; data: AcquisitionSnapshot };
interface Entry { id: string; name: string; amount: number; icon?: string | null }

function OfferList({ entries, kind, expanded, onToggle }: { entries: Entry[]; kind: '途径' | '奖励'; expanded: boolean; onToggle: () => void }) {
  const listId = useId();
  return <>
    <div className="mb-2 flex justify-between gap-3 text-xs text-slate-400"><span>{kind === '途径' ? '获取途径' : '奖励道具'}</span><span className="shrink-0">当前录入数量</span></div>
    <ul id={listId} className="flex flex-col divide-y divide-slate-700/50">
      {(expanded ? entries : entries.slice(0, 3)).map((entry) => <li key={entry.id} className="flex min-w-0 items-center gap-2 py-3">
        {kind === '奖励' && <ResourceIcon src={entry.icon ?? null} name={entry.name} size={26} />}
        <span className="min-w-0 flex-1 break-words text-sm leading-6 text-slate-200">{entry.name}</span>
        <span className="max-w-[45%] shrink-0 break-all text-right font-semibold tabular-nums text-amber-200">{formatGemValue(entry.amount)}</span>
      </li>)}
    </ul>
    {kind === '途径' && <dl className="mt-2 flex min-w-0 items-baseline justify-between gap-3 border-t border-slate-600/60 pt-3">
      <dt className="text-sm font-semibold text-slate-200">合计</dt>
      <dd aria-label="当前资源合计" className="max-w-[60%] break-all text-right font-bold tabular-nums text-amber-200">{formatAcquisitionTotal(entries)}</dd>
    </dl>}
    {entries.length > 3 && <button type="button" aria-expanded={expanded} aria-controls={listId} onClick={onToggle} className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-700 px-3 text-sm font-medium text-slate-200 hover:border-orange-500/50 hover:text-orange-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400">
      {expanded ? `收起${kind}` : `展开全部${kind}（${entries.length}）`}
      {expanded ? <ChevronUp aria-hidden="true" className="size-4" /> : <ChevronDown aria-hidden="true" className="size-4" />}
    </button>}
  </>;
}

export default function ResourceAcquisitionClient() {
  const [state, setState] = useState<LoadState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [mode, setMode] = useState<'resource' | 'source'>('resource');
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(() => new Set());
  function toggleCard(key: string) {
    setExpandedCards((previous) => {
      const next = new Set(previous);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }
  useEffect(() => {
    const controller = new AbortController();
    fetchAcquisitionSnapshot(controller.signal).then((data) => {
      if (!controller.signal.aborted) setState({ status: 'ready', data });
    }).catch(() => {
      if (!controller.signal.aborted) setState({ status: 'error' });
    });
    return () => controller.abort();
  }, [attempt]);

  const data = state.status === 'ready' ? state.data : null;
  const resourceCards = data && mode === 'resource' ? acquisitionResources(data, category, search) : [];
  const sourceCards = data && mode === 'source' ? acquisitionSources(data, category, search) : [];
  return <div className="flex min-w-0 flex-col gap-6">
    <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">资源获取</h1>
    <p className="max-w-3xl text-sm leading-6 text-slate-400">数量按当前录入口径展示，实际获取受活动、进度及领取条件影响。</p>

    {state.status === 'loading' && <div role="status" aria-label="正在加载资源获取数据" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"><span className="sr-only">正在加载资源获取数据</span>{Array.from({ length: 6 }, (_, index) => <div key={index} aria-hidden="true" className="h-64 rounded-2xl border border-slate-800 bg-slate-900/70 motion-safe:animate-pulse" />)}</div>}
    {state.status === 'error' && <div role="alert" className="flex flex-col items-start gap-4 rounded-2xl border border-slate-700 bg-slate-900/70 p-6"><p className="text-slate-200">暂时无法加载资源获取数据，请检查网络后重试</p><button type="button" onClick={() => { setState({ status: 'loading' }); setAttempt((value) => value + 1); }} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-orange-500/50 px-4 text-sm font-bold text-orange-300 hover:bg-orange-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"><RotateCcw aria-hidden="true" className="size-4" />重新加载</button></div>}
    {data && <>
      <div className="flex min-w-0 flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div role="group" aria-label="查询方式" className="inline-flex w-fit shrink-0 gap-1 rounded-xl border border-slate-700 bg-slate-900 p-1">
          {([{ id: 'resource', name: '按资源查' }, { id: 'source', name: '按玩法查' }] as const).map((view) => <button key={view.id} type="button" aria-pressed={mode === view.id} onClick={() => setMode(view.id)} className={`min-h-11 rounded-lg px-4 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${mode === view.id ? 'bg-orange-500/15 text-orange-300' : 'text-slate-300 hover:bg-slate-800'}`}>{view.name}</button>)}
        </div>
        <label className="relative block min-w-0 sm:w-80"><span className="sr-only">搜索道具或获取途径</span><Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索道具或获取途径" className="min-h-11 w-full min-w-0 rounded-xl border border-slate-700 bg-slate-900 py-2 pl-10 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400" /></label>
      </div>
      <div className="sticky top-16 z-20 min-w-0 border-y border-slate-800 bg-[#0a0f1d]/95 py-3 backdrop-blur-xl"><ResourceCategoryBar categories={data.catalog.categories} selected={category} onSelect={setCategory} label="资源获取分类" /></div>
      {!resourceCards.length && !sourceCards.length && <div role="status" className="flex flex-col items-start gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-slate-300">
        <p>{data.offers.length ? '没有符合条件的资源或获取途径' : '暂无已录入的资源获取数据'}</p>
        {(category !== 'all' || search) && <button type="button" onClick={() => { setCategory('all'); setSearch(''); }} className="min-h-11 rounded-xl border border-slate-700 px-4 text-sm text-slate-200 hover:text-orange-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400">清除筛选</button>}
      </div>}
      <AcquisitionColumns label={mode === 'resource' ? '资源获取列表' : '玩法奖励列表'}>
        {resourceCards.map(({ item, offers }) => {
          return <article key={`resource-${item.id}`} aria-label={item.name} className="flex min-w-0 flex-col rounded-2xl border border-slate-700/70 bg-slate-800/60 p-4 sm:p-5">
            <div className="mb-4 flex min-w-0 items-center gap-3"><ResourceIcon src={item.icon} name={item.name} size={40} /><div className="min-w-0"><h2 className="break-words text-base font-bold leading-6 text-slate-100">{item.name}</h2><p className="mt-1 text-xs text-slate-400">已录入 {offers.length} 个获取途径</p></div></div>
            <OfferList entries={offers.map((offer) => ({ id: offer.source.id, name: offer.source.name, amount: offer.amount }))} kind="途径" expanded={expandedCards.has(`resource:${item.id}`)} onToggle={() => toggleCard(`resource:${item.id}`)} />
          </article>;
        })}
        {sourceCards.map(({ source, offers }) => <article key={`source-${source.id}`} aria-label={source.name} className="flex min-w-0 flex-col rounded-2xl border border-slate-700/70 bg-slate-800/60 p-4 sm:p-5">
          <h2 className="break-words text-base font-bold leading-6 text-slate-100">{source.name}</h2><p className="mb-4 mt-1 text-xs text-slate-400">已录入 {offers.length} 种资源</p>
          <OfferList entries={offers.map((offer) => ({ id: offer.item.id, name: offer.item.name, icon: offer.item.icon, amount: offer.amount }))} kind="奖励" expanded={expandedCards.has(`source:${source.id}`)} onToggle={() => toggleCard(`source:${source.id}`)} />
        </article>)}
      </AcquisitionColumns>
    </>}
  </div>;
}
