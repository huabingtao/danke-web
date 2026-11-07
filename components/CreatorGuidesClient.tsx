'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import TacticalArticleViewer from '@/components/TacticalArticleViewer';

type Article = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  categoryId: string;
  categoryLabel: string;
  subcategoryLabel: string;
  tags: string[];
  cover: string | null;
  htmlPath: string;
  publishedAt: string;
};

type Manifest = { schemaVersion: number; articles: Article[] };
const ROOT = '/creator-content';
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function normalizeAssetPath(value: string, slug: string) {
  if (value.startsWith('https://') || value.startsWith('http://')) return value;
  const prefix = `${slug}/`;
  const relative = value.startsWith(prefix) ? value : `${slug}/${value.replace(/^\.\//, '')}`;
  if (!relative.startsWith(prefix) || relative.includes('..') || relative.includes('\\')) return '';
  return `${ROOT}/${relative.split('/').map(encodeURIComponent).join('/')}`;
}

// The Creator HTML is sanitized at build time and sanitized again by TacticalArticleViewer.
// Rewrite ONLY generated relative image URLs; do not change article links or arbitrary URLs.
function resolveCreatorImages(html: string, slug: string) {
  return html.replace(/(<img\b[^>]*\bsrc=)(["'])(\.\/assets\/[^"']+)\2/gi, (_, before, quote, src) => {
    const url = normalizeAssetPath(src, slug);
    return url ? `${before}${quote}${url}${quote}` : `${before}${quote}${quote}`;
  });
}

export default function CreatorGuidesClient() {
  const params = useSearchParams();
  const slug = params.get('slug') ?? '';
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [content, setContent] = useState<{ slug: string; html: string } | null>(null);
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetch(`${ROOT}/manifest.json`, { cache: 'no-cache' })
      .then(async (response) => {
        if (!response.ok) throw new Error('攻略内容包尚未部署');
        return response.json() as Promise<Manifest>;
      })
      .then((manifest) => {
        if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.articles)) throw new Error('攻略索引格式不兼容');
        if (!cancelled) setArticles(manifest.articles.filter((item) =>
          typeof item.slug === 'string' && SLUG.test(item.slug) &&
          item.htmlPath === `${item.slug}/article.html`
        ));
      })
      .catch((err) => { if (!cancelled) setError(String(err.message ?? err)); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const article = articles.find((item) => item.slug === slug);
  useEffect(() => {
    let cancelled = false;
    if (!slug || loading || !article) return;
    fetch(`${ROOT}/${encodeURIComponent(article.slug)}/article.html`)
      .then((response) => {
        if (!response.ok) throw new Error('攻略正文加载失败');
        return response.text();
      })
      .then((content) => { if (!cancelled) setContent({ slug: article.slug, html: resolveCreatorImages(content, article.slug) }); })
      .catch((err) => { if (!cancelled) setError(String(err.message ?? err)); });
    return () => { cancelled = true; };
  }, [slug, loading, article]);

  const categories = useMemo(() => [...new Map(articles.map((item) => [item.categoryId, item.categoryLabel])).entries()], [articles]);
  const filtered = useMemo(() => articles
    .filter((item) => category === 'all' || item.categoryId === category)
    .filter((item) => `${item.title} ${item.summary} ${item.tags?.join(' ') ?? ''}`.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)), [articles, category, query]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 text-slate-100 sm:px-6">
      <div className="mb-8">
        <Link href="/strategies" className="text-sm text-orange-400 hover:underline">← 原攻略库</Link>
        <h1 className="mt-4 text-3xl font-bold">弹壳呱呱 · 攻略</h1>
        <p className="mt-2 text-slate-400">由 danke-creator 独立构建并发布的攻略内容</p>
      </div>
      {loading && <p className="text-slate-400">攻略加载中...</p>}
      {error && <p role="alert" className="mb-5 text-amber-400">{error}</p>}
      {!loading && slug ? (
        article ? (
          <div>
            <Link href="/guides" className="mb-4 inline-block text-orange-400 hover:underline">← 返回攻略列表</Link>
            <header className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <p className="mb-2 text-sm text-orange-400">{article.categoryLabel} / {article.subcategoryLabel}</p>
              <h2 className="text-2xl font-bold">{article.title}</h2>
              <p className="mt-3 text-slate-400">{article.summary}</p>
              <time className="mt-3 block text-xs text-slate-500">{article.publishedAt}</time>
            </header>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 sm:p-8">
              {content?.slug === article.slug ? <TacticalArticleViewer title={article.title} contentHtml={content.html} /> : !error && <p className="text-slate-400">正在加载正文...</p>}
            </div>
          </div>
        ) : <p className="text-slate-400">未找到这篇公开攻略。<Link href="/guides" className="ml-2 text-orange-400">返回列表</Link></p>
      ) : !loading && (
        <>
          <div className="mb-6 flex flex-wrap gap-3">
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索攻略标题、摘要和标签" aria-label="搜索攻略" className="min-w-56 flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white" />
            <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="选择分类" className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white">
              <option value="all">全部分类</option>
              {categories.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
            </select>
          </div>
          {filtered.length === 0 && <p className="text-slate-400">{articles.length ? '没有找到符合条件的攻略' : '暂无已发布的 Creator 攻略'}</p>}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <Link key={item.id} href={`/guides?slug=${encodeURIComponent(item.slug)}`} className="block rounded-xl border border-slate-800 bg-slate-900/70 p-5 hover:border-orange-500">
                {item.cover && normalizeAssetPath(item.cover, item.slug) && <img alt="" src={normalizeAssetPath(item.cover, item.slug)} className="mb-3 aspect-video w-full rounded-lg object-cover" />}
                <p className="mb-2 text-xs text-orange-400">{item.categoryLabel} / {item.subcategoryLabel}</p>
                <h2 className="text-lg font-bold">{item.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-slate-400">{item.summary}</p>
                <time className="mt-3 block text-xs text-slate-500">{item.publishedAt}</time>
              </Link>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
