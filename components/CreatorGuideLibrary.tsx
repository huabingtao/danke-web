'use client';
import { useEffect, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
type Guide = { id: string; slug: string; title: string; summary: string; categoryId: string; categoryLabel: string; tags: string[]; coverUrl: string | null; updatedAt: string };
const EVENT = 'guide-filters-change';
function subscribe(callback: () => void) {
  window.addEventListener('popstate', callback); window.addEventListener(EVENT, callback);
  return () => { window.removeEventListener('popstate', callback); window.removeEventListener(EVENT, callback); };
}
const snapshot = () => window.location.search;
const serverSnapshot = () => '';
export function legacyGuideTarget(search: string, articles: Pick<Guide, 'slug'>[]) {
  const slug = new URLSearchParams(search).get('slug');
  return slug && articles.some(a => a.slug === slug) ? `/guides/${encodeURIComponent(slug)}/` : null;
}
function Thumbnail({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  return failed ? null : <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} className="h-[60px] w-[88px] shrink-0 rounded-lg object-cover md:h-[80px] md:w-[128px]" />;
}
export default function CreatorGuideLibrary({ articles }: { articles: Guide[] }) {
  const search = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const params = new URLSearchParams(search), query = params.get('q') || '';
  const categories = [...new Map(articles.map(a => [a.categoryId, a.categoryLabel])).entries()];
  const category = categories.some(([id]) => id === params.get('category')) ? params.get('category')! : 'all';
  const sort = params.get('sort') === 'title' ? 'title' : 'updated';
  useEffect(() => { const target = legacyGuideTarget(window.location.search, articles); if (target) window.location.replace(target); }, [articles]);
  function update(values: Record<string, string>) {
    const url = new URL(window.location.href);
    for (const [key, value] of Object.entries(values)) {
      if (!value || (key === 'category' && value === 'all') || (key === 'sort' && value === 'updated')) url.searchParams.delete(key);
      else url.searchParams.set(key, value);
    }
    window.history.replaceState(window.history.state, '', url); window.dispatchEvent(new Event(EVENT));
  }
  const selected = articles.filter(a => (category === 'all' || a.categoryId === category) && `${a.title} ${a.summary} ${a.tags.join(' ')}`.toLowerCase().includes(query.trim().toLowerCase())).sort((a, b) => {
    const byTitle = a.title.localeCompare(b.title, 'zh-CN') || a.slug.localeCompare(b.slug);
    return sort === 'title' ? byTitle : b.updatedAt.localeCompare(a.updatedAt) || byTitle;
  });
  const control = 'min-w-0 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500';
  return <>
    <header className="mb-5 flex items-baseline gap-3"><h1 className="text-2xl font-bold text-white">攻略库</h1><p role="status" aria-live="polite" className="text-sm text-slate-400">{selected.length} 篇攻略</p></header>
    <div className="mb-3 grid grid-cols-2 gap-3 md:flex">
      <input type="search" aria-label="搜索攻略" placeholder="搜索标题、摘要和标签" value={query} onChange={e => update({ q: e.target.value })} className={`${control} col-span-2 w-full md:flex-1`} />
      <select aria-label="攻略分类" value={category} onChange={e => update({ category: e.target.value })} className={`${control} md:w-40`}><option value="all">全部分类</option>{categories.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select>
      <select aria-label="攻略排序" value={sort} onChange={e => update({ sort: e.target.value })} className={`${control} md:w-36`}><option value="updated">最近更新</option><option value="title">标题排序</option></select>
    </div>
    <ul aria-label="攻略列表" className="divide-y divide-slate-800 border-y border-slate-800">{selected.map(a => <li key={a.id}><Link href={`/guides/${a.slug}/`} className="group flex items-start gap-3 rounded-sm py-[14px] transition-colors hover:bg-slate-900/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 md:gap-5 md:py-4">
      <div className="min-w-0 flex-1"><h2 className="line-clamp-2 text-base font-semibold leading-6 text-slate-100 group-hover:text-orange-400 md:text-lg md:leading-7">{a.title}</h2>
        {a.summary && <p className="mt-1 hidden truncate text-sm leading-5 text-slate-400 md:block">{a.summary}</p>}
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs leading-4 text-slate-400"><span>{a.categoryLabel}</span>{a.updatedAt && <time dateTime={a.updatedAt}>{a.updatedAt.slice(0, 10)}</time>}</div>
      </div>{a.coverUrl && <Thumbnail key={a.coverUrl} src={a.coverUrl} />}
    </Link></li>)}</ul>
    {selected.length === 0 && <div className="py-12 text-center"><p className="text-slate-400">没有找到相关攻略</p><button type="button" onClick={() => update({ q: '', category: 'all', sort: 'updated' })} className="mt-3 rounded px-3 py-2 text-sm text-orange-400 hover:text-orange-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">清除筛选</button></div>}
  </>;
}
