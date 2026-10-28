import { describe, it, expect } from 'vitest';
import { stripFrontmatter, renderMarkdownToHtml, cleanChineseTag } from '../lib/markdown';
import { ALL_STRATEGIES, FEATURED_STRATEGY, MUST_READ_STRATEGIES } from '../lib/local-strategies-data';

describe('Markdown & Frontmatter Stripping', () => {
  it('strips YAML frontmatter from raw markdown using gray-matter', () => {
    const raw = `---
title: "【活动】水上乐园大乱斗"
tag: "活动"
summary: "精算指南"
tags:
  - "活动"
  - "水上乐园"
cover: "./cover.png"
---

# 正文第一行标题
这是正文内容。`;

    const stripped = stripFrontmatter(raw);
    expect(stripped).not.toContain('title:');
    expect(stripped).not.toContain('tag:');
    expect(stripped).not.toContain('cover:');
    expect(stripped.trim().startsWith('# 正文第一行标题')).toBe(true);
  });

  it('strips leaked HTML frontmatter', () => {
    const leakedHtml = `<hr><p>title: &quot;测试标题&quot;<br>tag: &quot;装备&quot;<br>summary: &quot;测试摘要&quot;</p><ul><li>装备</li></ul><hr><h2>真正的正文</h2><p>详情内容</p>`;
    const cleaned = stripFrontmatter(leakedHtml);
    expect(cleaned).not.toContain('title:');
    expect(cleaned).not.toContain('测试摘要');
    expect(cleaned).toContain('<h2>真正的正文</h2>');
  });

  it('renders markdown to clean HTML using marked engine with no metadata leak', () => {
    const raw = `---
title: "【公会】公会币精算"
tag: "公会"
summary: "公会商店"
---

![article-top](img://article-top){type=banner}

## 核心机制

- 要点 1：**优先兑换核心**
- 要点 2：消耗 {{神器核心}} 30个
`;

    const html = renderMarkdownToHtml(raw, '公会/公会币性价比方案');
    expect(html).not.toContain('---');
    expect(html).not.toContain('title:');
    expect(html).not.toContain('img://article-top');
    expect(html).not.toContain('{type=banner}');
    expect(html).toContain('data-heading="true">核心机制</h2>');
    expect(html).toContain('class="strong">优先兑换核心</strong>');
    expect(html).toContain('神器核心 30个');
  });

  it('renders code blocks with highlight.js syntax highlighting and macOS window dots', () => {
    const codeMd = '```typescript\nconst score = 100;\n```';
    const html = renderMarkdownToHtml(codeMd);
    expect(html).toContain('mac-sign');
    expect(html).toContain('code__pre');
    expect(html).toContain('hljs');
    expect(html).toContain('language-typescript');
  });

  it('renders tables wrapped in responsive scroll container', () => {
    const tableMd = '| 列A | 列B |\n| --- | --- |\n| 1 | 2 |';
    const html = renderMarkdownToHtml(tableMd);
    expect(html).toContain('table-scroll-wrapper');
    expect(html).toContain('preview-table');
    expect(html).toContain('列A');
    expect(html).toContain('列B');
  });

  it('cleans tags to pure Chinese removing english in parentheses', () => {
    expect(cleanChineseTag('活动(activity)')).toBe('活动');
    expect(cleanChineseTag('装备(equipment)')).toBe('装备');
    expect(cleanChineseTag('区域行动(zone-operation)')).toBe('区域行动');
    expect(cleanChineseTag('宠物')).toBe('宠物');
  });
});

describe('Strategy Articles Metadata & Tags', () => {
  it('ensures featured and must-read articles have standardized pure Chinese tag and cover.png', () => {
    expect(FEATURED_STRATEGY.tag).toMatch(/^[\u4e00-\u9fa5]+$/);
    expect(FEATURED_STRATEGY.coverImage).toContain('cover.png');

    for (const article of MUST_READ_STRATEGIES) {
      expect(article.tag).toMatch(/^[\u4e00-\u9fa5]+$/);
      expect(article.coverImage).toContain('cover.png');
    }
  });

  it('ensures all local strategies have standardized pure Chinese tags and no reminder leaks', () => {
    for (const article of ALL_STRATEGIES) {
      expect(article.tag).toMatch(/^[\u4e00-\u9fa5]+$/);
      expect(article.coverImage).toContain('cover.png');
      expect(article.category).not.toBe('reminder');
      expect(article.title).not.toContain('日历');
      expect(article.title).not.toContain('每日事项');
    }
  });
});
