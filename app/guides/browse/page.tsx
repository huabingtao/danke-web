import type { Metadata } from 'next';
import Link from 'next/link';
import { readCreatorPackage, creatorSeriesNames, creatorSiteUrl } from '@/lib/creator-content';
import { creatorCollections, collectionHref } from '@/lib/creator-collections';

export function generateMetadata(): Metadata {
  return { title: '分类、标签与系列 | 弹壳攻略', alternates: { canonical: `${creatorSiteUrl()}/guides/browse/` }, robots: process.env.CREATOR_PREVIEW === '1' ? { index: false, follow: false } : undefined };
}
export default function BrowseGuidesPage() {
  const pkg = readCreatorPackage();
  const groups = creatorCollections(pkg.articles, creatorSeriesNames());
  const sections = [{ kind: 'categories', title: '按分类查阅' }, { kind: 'tags', title: '按标签查阅' }, { kind: 'series', title: '系列攻略' }];
  return <main className="mx-auto min-h-screen max-w-6xl px-4 py-10 sm:px-6">
    <Link href="/guides/" className="text-orange-400">← 全部攻略</Link>
    <h1 className="mb-8 mt-6 text-3xl font-bold">分类、标签与系列</h1>
    
    {sections.map(section => <section key={section.kind} className="mb-8 rounded-2xl border border-slate-700 bg-[#131d33] p-6">
      <h2 className="mb-5 text-xl font-bold">{section.title}</h2>
      <div className="flex flex-wrap gap-3">{groups.filter(g => g.kind === section.kind).map(g => <Link key={g.key} href={collectionHref(g.kind, g.key)} className="rounded-lg border border-slate-600 px-4 py-2 text-slate-200 hover:border-orange-500">{g.label}<span className="ml-3 text-sm text-slate-400">{g.articles.length} 篇</span></Link>)}</div>
      {!groups.some(g => g.kind === section.kind) && <p className="text-slate-400">当前没有可展示的系列文章</p>}
    </section>)}
  </main>;
}
