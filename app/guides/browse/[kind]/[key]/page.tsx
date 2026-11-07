import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CreatorGuideLibrary from '@/components/CreatorGuideLibrary';
import { readCreatorPackage, creatorAssetUrl, creatorSiteUrl, creatorSeriesNames } from '@/lib/creator-content';
import { creatorCollections, collectionHref } from '@/lib/creator-collections';

export const dynamicParams = false;
function groups() { const pkg = readCreatorPackage(); return { pkg, groups: creatorCollections(pkg.articles, creatorSeriesNames()) }; }
export function generateStaticParams() { return groups().groups.map(g => ({ kind: g.kind, key: g.key })); }
type Props = { params: Promise<{ kind: string; key: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params; const { pkg, groups: all } = groups(); const group = all.find(g => g.kind === p.kind && g.key === p.key);
  if (!group) notFound();
  return { title: `${group.label} | 弹壳攻略`, description: `${group.label}相关攻略`, alternates: { canonical: creatorSiteUrl() + collectionHref(group.kind, group.key) }, robots: pkg.candidate ? { index: false, follow: false } : undefined };
}
export default async function CollectionPage({ params }: Props) {
  const p = await params; const { pkg, groups: all } = groups(); const group = all.find(g => g.kind === p.kind && g.key === p.key);
  if (!group) notFound();
  return <main className="mx-auto min-h-screen max-w-6xl px-4 py-10 sm:px-6">
    <Link href="/guides/browse/" className="text-orange-400">← 分类、标签与系列</Link>
    
    <h1 className="mb-8 mt-6 text-3xl font-bold">{group.label}</h1>
    <CreatorGuideLibrary articles={group.articles.map(a => ({ id: a.id, slug: a.slug, title: a.title, summary: a.summary, categoryId: a.categoryId, categoryLabel: a.categoryLabel, tags: a.tags, coverUrl: creatorAssetUrl(pkg, a.cover), updatedAt: a.updatedAt }))} />
  </main>;
}
