import { describe, it, expect } from 'vitest';
import { safeDecodeUri } from '../lib/markdown';
import { resolveLocalArticle, getAllLocalArticleSlugs } from '../lib/article-resolver';

describe('Safe URI Decoding & Local Article Resolver', () => {
  it('safely decodes truncated and malformed percent-encoded slugs without crashing', () => {
    // Truncated multi-byte UTF-8 sequence (%e6 without following bytes)
    const malformed = 'faq-%e5%91%a8%e5%b8%b8%e5%92%8c%e6';
    expect(() => safeDecodeUri(malformed)).not.toThrow();
    expect(safeDecodeUri(malformed)).toBe('faq-周常和');

    // Normal encoded
    expect(safeDecodeUri('faq-%e5%91%a8%e5%b8%b8')).toBe('faq-周常');

    // Clean Chinese
    expect(safeDecodeUri('faq-周常攻略')).toBe('faq-周常攻略');
  });

  it('resolves article by encoded slug: faq-%e5%91%a8%e5%b8%b8%e6%94%bb%e7%95%a5', () => {
    const article = resolveLocalArticle('faq-%e5%91%a8%e5%b8%b8%e6%94%bb%e7%95%a5');
    expect(article).not.toBeNull();
    expect(article?.title).toContain('省事做任务');
    expect(article?.category).toBe('faq');
    expect(['周常攻略', '答疑']).toContain(article?.tag);
    // Content HTML should not have frontmatter header leaked
    expect(article?.contentHtml).not.toContain('<hr><p>title:');
    expect(article?.contentHtml).not.toContain('---');
    expect(article?.contentHtml).toContain('省事');
  });

  it('resolves article by clean slug: faq-周常攻略', () => {
    const article = resolveLocalArticle('faq-周常攻略');
    expect(article).not.toBeNull();
    expect(article?.title).toContain('省事做任务');
    expect(['周常攻略', '答疑']).toContain(article?.tag);
  });

  it('getAllLocalArticleSlugs includes both clean and legacy slugs', () => {
    const slugs = getAllLocalArticleSlugs();
    expect(slugs.length).toBeGreaterThan(100);
    expect(slugs).toContain('faq-%e5%91%a8%e5%b8%b8%e6%94%bb%e7%95%a5');
    expect(slugs).toContain('faq-周常攻略');
  });
});
