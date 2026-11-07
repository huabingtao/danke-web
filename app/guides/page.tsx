import type { Metadata } from 'next';
import CreatorGuideLibrary from '@/components/CreatorGuideLibrary';
import { readCreatorPackage, creatorAssetUrl, creatorSiteUrl } from '@/lib/creator-content';
export function generateMetadata(): Metadata {
  return { title: '弹壳攻略库', description: '查阅弹壳特攻队养成、机制与玩法攻略。', alternates: { canonical: `${creatorSiteUrl()}/guides/` }, robots: process.env.CREATOR_PREVIEW === '1' ? { index: false, follow: false } : undefined };
}
export default function GuidesPage() {
  const pkg = readCreatorPackage();
  return <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-6 text-slate-100 sm:px-6 md:py-8"><CreatorGuideLibrary articles={pkg.articles.map(a => ({ id: a.id, slug: a.slug, title: a.title, summary: a.summary, categoryId: a.categoryId, categoryLabel: a.categoryLabel, tags: a.tags, coverUrl: creatorAssetUrl(pkg, a.cover), updatedAt: a.updatedAt }))} /></main>;
}
