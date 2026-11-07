import type { MetadataRoute } from 'next';
import { readCreatorPackage, creatorSiteUrl, creatorSeriesNames } from '@/lib/creator-content';
import { creatorCollections, collectionHref } from '@/lib/creator-collections';
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  const pkg = readCreatorPackage();
  if (pkg.candidate) return [];
  return [{ url: `${creatorSiteUrl()}/guides/` }, { url: `${creatorSiteUrl()}/guides/browse/` },
    ...pkg.articles.map(a => ({ url: `${creatorSiteUrl()}/guides/${a.slug}/`, lastModified: a.updatedAt })),
    ...creatorCollections(pkg.articles, creatorSeriesNames()).map(g => ({ url: creatorSiteUrl() + collectionHref(g.kind, g.key) }))];
}
