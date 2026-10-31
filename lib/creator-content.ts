import fs from 'node:fs';
import path from 'node:path';
import type { StrategyArticle } from './local-strategies-data';

interface CreatorArticleRecord {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  topic?: string;
  topic_name?: string;
  subtopic?: string;
  subtopic_name?: string;
  content_type?: string;
  tags?: string[];
  series?: string | null;
  date?: string;
  lastmod?: string;
  cover?: string | null;
  cover_vertical?: string | null;
  legacy_slugs?: string[];
  package_path: string;
}

interface CreatorArticleIndex {
  version: number;
  articles: CreatorArticleRecord[];
}

export interface CreatorResolvedArticle extends StrategyArticle {
  contentHtml: string;
  sourceType: 'CREATOR_WEB_HTML';
}

const CONTENT_ROOT = path.resolve(
  process.env.DANKE_WEB_CREATOR_CONTENT_DIR || path.join(process.cwd(), 'public', 'creator-strategies'),
);
const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SAFE_LEGACY_SLUG = /^(?!\.{1,2}$)[^/\\?#]+$/;
let cachedIndex: CreatorArticleIndex | null | undefined;

function readIndex(): CreatorArticleIndex {
  if (cachedIndex) return cachedIndex;
  const indexPath = path.join(CONTENT_ROOT, 'index.json');
  if (!fs.existsSync(indexPath)) {
    cachedIndex = { version: 1, articles: [] };
    return cachedIndex;
  }
  const parsed = JSON.parse(fs.readFileSync(indexPath, 'utf8')) as CreatorArticleIndex;
  cachedIndex = {
    version: parsed.version,
    articles: Array.isArray(parsed.articles)
      ? parsed.articles.filter((article) =>
          typeof article.slug === 'string' && SAFE_SLUG.test(article.slug) &&
          typeof article.package_path === 'string' && SAFE_SLUG.test(article.package_path),
        )
      : [],
  };
  return cachedIndex;
}

function toStrategyArticle(article: CreatorArticleRecord): StrategyArticle {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    tag: article.tags?.[0] || article.subtopic_name || article.topic_name || '攻略',
    category: article.topic || 'resources',
    categoryLabel: article.topic_name || '攻略',
    summary: article.summary || article.title,
    coverImage: article.cover || undefined,
    coverVertical: article.cover_vertical || undefined,
    publishedAt: article.date || article.lastmod || '',
    updatedAt: article.lastmod,
    tags: Array.isArray(article.tags) ? article.tags : [],
    series: article.series || undefined,
    subtopic: article.subtopic,
    subtopicLabel: article.subtopic_name,
    contentType: article.content_type,
    date: article.date || article.lastmod || '',
    highlights: Array.isArray(article.tags) ? article.tags : [],
  };
}

export function getCreatorStrategySlugs(): string[] {
  const slugs = new Set<string>();
  for (const article of readIndex().articles) {
    slugs.add(article.slug);
    for (const legacySlug of article.legacy_slugs || []) {
      if (SAFE_LEGACY_SLUG.test(legacySlug)) slugs.add(legacySlug);
    }
  }
  return [...slugs];
}

export function loadCreatorStrategyCards(): StrategyArticle[] {
  return readIndex().articles.map(toStrategyArticle);
}

export function resolveCreatorStrategy(slug: string): CreatorResolvedArticle | null {
  const article = readIndex().articles.find(
    (candidate) => candidate.slug === slug || candidate.legacy_slugs?.includes(slug),
  );
  if (!article) return null;

  const packageRoot = path.resolve(CONTENT_ROOT, article.package_path);
  if (!packageRoot.startsWith(`${CONTENT_ROOT}${path.sep}`)) return null;
  const htmlPath = path.join(packageRoot, 'article.html');
  if (!fs.existsSync(htmlPath)) return null;

  return {
    ...toStrategyArticle(article),
    contentHtml: fs.readFileSync(htmlPath, 'utf8'),
    sourceType: 'CREATOR_WEB_HTML',
  };
}
