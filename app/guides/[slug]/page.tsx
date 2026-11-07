import { collectionHref, tagKey } from '@/lib/creator-collections';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { readCreatorPackage, creatorArticleHtml, creatorSiteUrl, creatorAssetUrl } from '@/lib/creator-content';
export const dynamicParams = false;
export function generateStaticParams() { return readCreatorPackage().articles.map(a => ({ slug: a.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const pkg = readCreatorPackage(); const a = pkg.articles.find(a => a.slug === slug); if (!a) notFound();
  const url = `${creatorSiteUrl()}/guides/${a.slug}/`; const cover = creatorAssetUrl(pkg, a.cover);
  return { title: a.title, description: a.summary, alternates: { canonical: url }, openGraph: { type: 'article', title: a.title, description: a.summary, url, images: cover ? [new URL(cover, creatorSiteUrl()).toString()] : [] }, robots: pkg.candidate ? { index: false, follow: false } : undefined };
}
export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const pkg = readCreatorPackage(); const a = pkg.articles.find(a => a.slug === slug); if (!a) notFound();
  const structured = { '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.summary, author: { '@type': 'Person', name: a.author }, dateModified: a.updatedAt, ...(a.publishedAt ? { datePublished: a.publishedAt } : {}), mainEntityOfPage: `${creatorSiteUrl()}/guides/${a.slug}/` };
  return <main className="mx-auto min-h-screen max-w-4xl px-4 py-10 sm:px-6"><Link href="/guides/" className="text-orange-400">← 全部攻略</Link><header className="my-8"><p className="text-sm text-cyan-400"><Link href={collectionHref('categories', a.categoryId)}>{a.categoryLabel}</Link> / {a.subcategoryLabel}</p><h1 className="my-4 text-3xl font-bold leading-snug text-white sm:text-4xl">{a.title}</h1><p className="text-slate-400">{a.summary}</p><p className="mt-5 text-sm text-slate-500">{a.author} · 更新于 {a.updatedAt}</p></header><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, '\\u003c') }} /><section className="creator-prose rounded-2xl border border-slate-700 bg-[#131d33] p-4 sm:p-8" dangerouslySetInnerHTML={{ __html: creatorArticleHtml(a) }} /><nav aria-label="文章标签" className="mt-8 flex flex-wrap gap-3">{a.tags.map(tag => <Link key={tag} href={collectionHref('tags', tagKey(tag))} className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300">{tag}</Link>)}</nav></main>;
}
