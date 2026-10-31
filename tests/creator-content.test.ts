import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

const contentRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'danke-web-creator-test-'));
let getCreatorStrategySlugs: typeof import('../lib/creator-content').getCreatorStrategySlugs;
let loadCreatorStrategyCards: typeof import('../lib/creator-content').loadCreatorStrategyCards;
let resolveCreatorStrategy: typeof import('../lib/creator-content').resolveCreatorStrategy;

describe('creator website content', () => {
  beforeAll(async () => {
    vi.stubEnv('DANKE_WEB_CREATOR_CONTENT_DIR', contentRoot);
    vi.resetModules();
    ({ getCreatorStrategySlugs, loadCreatorStrategyCards, resolveCreatorStrategy } = await import('../lib/creator-content'));
    const articleDir = path.join(contentRoot, 'fixture-guide');
    fs.mkdirSync(articleDir, { recursive: true });
    fs.writeFileSync(path.join(contentRoot, 'index.json'), JSON.stringify({
      version: 1,
      articles: [{
        id: 'dk-20261031-0001', slug: 'fixture-guide', title: '潮汐秘境攻略', summary: '示例摘要',
        topic: 'gameplay', topic_name: '玩法与挑战', subtopic: 'tidemist', subtopic_name: '潮汐秘境',
        content_type: 'guide', tags: ['找钻石'], series: 'tidemist-series', date: '2026-10-31',
        lastmod: '2026-10-31', cover: '/creator-strategies/fixture-guide/assets/cover.png',
        legacy_slugs: ['old-tidemist-guide'], package_path: 'fixture-guide',
      }],
    }));
    fs.writeFileSync(path.join(articleDir, 'article.html'), '<article><h1>正文</h1></article>');
  });

  afterAll(() => {
    vi.unstubAllEnvs();
    fs.rmSync(contentRoot, { recursive: true, force: true });
  });

  it('indexes taxonomy fields and serves generated HTML through canonical and legacy slugs', () => {
    const [card] = loadCreatorStrategyCards();
    expect(card).toMatchObject({ category: 'gameplay', categoryLabel: '玩法与挑战', subtopic: 'tidemist' });
    expect(getCreatorStrategySlugs()).toEqual(['fixture-guide', 'old-tidemist-guide']);
    expect(resolveCreatorStrategy('old-tidemist-guide')).toMatchObject({
      id: 'dk-20261031-0001', sourceType: 'CREATOR_WEB_HTML', contentHtml: '<article><h1>正文</h1></article>',
    });
  });
});
