import { describe, it, expect } from 'vitest';
import { stripFrontmatter, renderMarkdownToHtml, cleanChineseTag, sanitizeArticleHtml } from '../lib/markdown';

describe('Markdown & Frontmatter Stripping', () => {
  it('sanitizes untrusted article HTML while preserving tables and normal links', () => {
    const html = sanitizeArticleHtml('<script>window.pwned = true</script><img src="/cover.png" onerror="alert(1)"><table><tr><td>奖励</td></tr></table><a href="https://example.com/video">视频</a>');
    expect(html).not.toContain('<script');
    expect(html).not.toContain('onerror');
    expect(html).toContain('<table>');
    expect(html).toContain('奖励');
    expect(html).toContain('https://example.com/video');
  });

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

    const html = renderMarkdownToHtml(raw);
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
