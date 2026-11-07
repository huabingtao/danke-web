import { describe, expect, it } from 'vitest';
import { creatorCollections, collectionHref, tagKey } from '@/lib/creator-collections';
import type { CreatorArticle } from '@/lib/creator-content';

const article = (id: string, tags: string[], series: string | null = null) => ({ id, tags, series, categoryId: 'equipment', categoryLabel: '装备' }) as CreatorArticle;
describe('static guide collections', () => {
  it('deduplicates repeated tags and collects only existing groups', () => {
    const groups = creatorCollections([article('a', ['养成', '养成']), article('b', ['养成', '载具'])]);
    expect(groups.filter(g => g.kind === 'categories')).toHaveLength(1);
    expect(groups.filter(g => g.kind === 'tags')).toHaveLength(2);
    expect(groups.find(g => g.label === '养成')?.articles.map(a => a.id)).toEqual(['a', 'b']);
    expect(groups.filter(g => g.kind === 'series')).toEqual([]);
  });
  it('uses the provided series label and stable tag URLs', () => {
    const groups = creatorCollections([article('a', ['新手 / FAQ'], 'beginner-series')], { 'beginner-series': '新手入门系列' });
    expect(groups.find(g => g.kind === 'series')?.label).toBe('新手入门系列');
    const key = tagKey('新手 / FAQ');
    expect(key).toMatch(/^tag-[a-f0-9]{16}$/);
    expect(key).toBe(tagKey('新手 / FAQ'));
    expect(collectionHref('tags', key)).toBe(`/guides/browse/tags/${key}/`);
  });
  it('does not silently combine conflicting category labels', () => {
    expect(() => creatorCollections([article('a', []), { ...article('b', []), categoryLabel: '另一分类' }])).toThrow('collision');
  });
});
