import { createHash } from 'node:crypto';
import type { CreatorArticle } from './creator-content';

export type CollectionKind = 'categories' | 'tags' | 'series';
export type CreatorCollection = { kind: CollectionKind; key: string; label: string; articles: CreatorArticle[] };
export function tagKey(label: string): string {
  return 'tag-' + createHash('sha256').update(label).digest('hex').slice(0, 16);
}
export function collectionHref(kind: CollectionKind, key: string): string {
  return `/guides/browse/${kind}/${encodeURIComponent(key)}/`;
}
export function creatorCollections(articles: CreatorArticle[], seriesNames: Record<string, string> = {}): CreatorCollection[] {
  const collections = new Map<string, CreatorCollection>();
  function add(kind: CollectionKind, key: string, label: string, article: CreatorArticle) {
    const id = kind + '/' + key;
    let group = collections.get(id);
    if (group && group.label !== label) throw new Error('Collection key collision');
    if (!group) { group = { kind, key, label, articles: [] }; collections.set(id, group); }
    if (!group.articles.some(a => a.id === article.id)) group.articles.push(article);
  }
  for (const article of articles) {
    add('categories', article.categoryId, article.categoryLabel, article);
    for (const tag of new Set(article.tags)) add('tags', tagKey(tag), tag, article);
    if (article.series) add('series', article.series, seriesNames[article.series] || article.series, article);
  }
  return [...collections.values()].sort((a, b) => a.kind.localeCompare(b.kind) || a.key.localeCompare(b.key));
}
