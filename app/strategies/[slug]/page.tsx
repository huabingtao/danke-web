import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, Eye, ExternalLink, Sparkles, FileText, Globe, Play, Film, Video } from 'lucide-react';
import TopNavBar from '@/components/TopNavBar';
import FooterSection from '@/components/FooterSection';
import TacticalArticleViewer from '@/components/TacticalArticleViewer';
import { fetchStrategyBySlug } from '@/lib/api';
import { stripFrontmatter, renderMarkdownToHtml, safeDecodeUri } from '@/lib/markdown';
import { resolveLocalArticle, getAllLocalArticleSlugs } from '@/lib/article-resolver';
import { ALL_STRATEGIES, FEATURED_STRATEGY, MUST_READ_STRATEGIES } from '@/lib/local-strategies-data';
import { LOCAL_WIKI_ENTRIES, LOCAL_HANDBOOK_GUIDES } from '@/lib/local-wiki-data';
import { getCreatorStrategySlugs, resolveCreatorStrategy } from '@/lib/creator-content';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const localSlugs = getAllLocalArticleSlugs();
  const fallbackSlugs = Array.from(
    new Set([
      ...localSlugs,
      ...getCreatorStrategySlugs(),
      ...ALL_STRATEGIES.map((s) => s.slug).filter(Boolean),
      ...LOCAL_HANDBOOK_GUIDES.map((g) => g.articleSlug).filter(Boolean),
      'resources-%e7%a5%9e%e7%82%bc%e9%a1%ba%e5%ba%8f%e6%8e%a8%e8%8d%90',
      'resources-ss%e8%a3%85%e5%a4%87%e5%90%88%e6%88%90%e9%a1%ba%e5%ba%8f',
      'resources-6%e4%b8%aa%e5%bf%85%e5%81%9a%e7%9a%84%e7%ba%a2%e6%94%b6%e8%97%8f%e5%93%81%e6%8e%a8%e8%8d%90',
      'resources-1-10%e6%9c%9f%e5%8a%a0%e6%9a%b4%e4%bc%a4%e7%9a%84%e9%87%91%e6%94%b6%e8%97%8f',
      'resources-%e5%8a%a0%e6%9a%b4%e5%87%bb%e7%9a%84%e9%87%91%e6%94%b6%e8%97%8f%e7%af%87',
      'resources-%e5%bc%82%e5%ae%a0%e6%a0%b8%e5%bf%83%e6%b6%88%e8%80%97%e8%8a%82%e7%82%b9%e6%8e%a8%e8%8d%90',
      'resources-%e9%85%8d%e4%bb%b6%e8%bf%87%e8%bd%bd%e6%b6%88%e8%80%97',
      'resources-%e8%bd%bd%e5%85%b7%e9%9b%b6%e4%bb%b6%e6%91%86%e6%94%be%e6%94%bb%e7%95%a5',
      'faq-%e5%91%a8%e5%b8%b8%e5%92%8c%e6',
    ]),
  );

  try {
    const res = await fetch('http://localhost:3000/api/strategies?limit=1000');
    if (!res.ok) return fallbackSlugs.map((slug) => ({ slug }));
    const items = await res.json();
    if (!Array.isArray(items) || items.length === 0) {
      return fallbackSlugs.map((slug) => ({ slug }));
    }
    const merged = new Set([
      ...items.map((item: { slug: string }) => item.slug),
      ...fallbackSlugs,
    ]);
    return Array.from(merged).map((slug) => ({ slug }));
  } catch {
    return fallbackSlugs.map((slug) => ({ slug }));
  }
}

export default async function StrategyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const decodedSlug = safeDecodeUri(slug);

  // 1. 优先尝试从 danke-core API 获取
  let article: any = resolveCreatorStrategy(decodedSlug) || resolveCreatorStrategy(slug);
  if (!article) article = await fetchStrategyBySlug(decodedSlug);
  if (!article && slug !== decodedSlug) {
    article = await fetchStrategyBySlug(slug);
  }

  // 2. 若 API 未启动或返回空，使用本地文件解析器从 my-articles-md 实时读取并渲染
  if (!article) {
    article = resolveLocalArticle(slug) || resolveLocalArticle(decodedSlug);
  }

  // 3. 兜底匹配预置常量与手册
  if (!article) {
    const localMatch =
      (FEATURED_STRATEGY.slug === slug || FEATURED_STRATEGY.slug === decodedSlug
        ? FEATURED_STRATEGY
        : null) ||
      MUST_READ_STRATEGIES.find((s) => s.slug === slug || s.slug === decodedSlug) ||
      ALL_STRATEGIES.find((s) => s.slug === slug || s.slug === decodedSlug);
    const handbookMatch = LOCAL_HANDBOOK_GUIDES.find(
      (g) => g.articleSlug === slug || g.articleSlug === decodedSlug,
    );
    if (localMatch) {
      let contentHtml = `<p>${localMatch.summary}</p>`;
      // 尝试在本地文件系统中查找对应的 Markdown 手稿并使用 marked 编译
      try {
        if (localMatch.coverImage && localMatch.coverImage.startsWith('/uploads/creator/')) {
          const relDir = localMatch.coverImage
            .replace('/uploads/creator/', '')
            .replace(/\/(dist\/)?cover\.png$/, '');
          const creatorDir = path.resolve(process.cwd(), '../danke-creator/my-articles-md', relDir);
          if (fs.existsSync(creatorDir)) {
            const files = fs.readdirSync(creatorDir);
            const mdFile =
              files.find(
                (f) =>
                  f.endsWith('.md') &&
                  !f.includes('_stage') &&
                  f !== '粗稿.md' &&
                  !f.includes('征集') &&
                  !f.startsWith('.'),
              ) ||
              files.find((f) => f.endsWith('.md') && !f.includes('_stage')) ||
              files.find((f) => f.endsWith('.md'));
            if (mdFile) {
              const rawMd = fs.readFileSync(path.join(creatorDir, mdFile), 'utf-8');
              contentHtml = renderMarkdownToHtml(rawMd, relDir);
            }
          }
        }
      } catch (e) {
        // fallback to summary
      }

      article = {
        slug: localMatch.slug,
        title: localMatch.title,
        tag: localMatch.tag,
        category: localMatch.category,
        categoryLabel: localMatch.tag || localMatch.categoryLabel,
        summary: localMatch.summary,
        date: localMatch.publishedAt,
        highlights: localMatch.tags,
        sourceType: 'LOCAL_MARKDOWN',
        contentHtml,
      };
    } else if (handbookMatch) {
      article = {
        slug: handbookMatch.articleSlug,
        title: handbookMatch.title,
        tag: '装备',
        category: handbookMatch.category.toLowerCase(),
        categoryLabel: handbookMatch.chapter,
        summary: handbookMatch.routeSummary,
        date: '2026-10-25',
        highlights: handbookMatch.keyTakeaways,
        sourceType: 'LOCAL_MARKDOWN',
        contentHtml: renderMarkdownToHtml(
          `### ${handbookMatch.title}\n\n${handbookMatch.routeSummary}\n\n${handbookMatch.keyTakeaways
            .map((k) => `- ${k}`)
            .join('\n')}`,
        ),
      };
    } else {
      article = {
        slug: decodedSlug,
        title: `《弹壳特攻队》专题攻略`,
        tag: '攻略',
        category: 'resources',
        categoryLabel: 'Wiki 专题攻略',
        summary: '结合最新实战测试整理的核心机制、节点消耗与养成优先级指南。',
        date: '2026-10-25',
        highlights: ['核心机制', '养成优先级'],
        sourceType: 'LOCAL_MARKDOWN',
        contentHtml: '<p>请结合下方关联 Wiki 词条与养成消耗速查矩阵查阅详细数值节点。</p>',
      };
    }
  } else {
    // 若从 core 返回了 contentMarkdown，优先以 marked 重新编译为纯净无数据头的 HTML
    if (article.contentMarkdown) {
      const cleanPath = article.sourcePath
        ? article.sourcePath.replace(/^.*my-articles-md\//, '')
        : '';
      const relDir = cleanPath.endsWith('.md')
        ? path.dirname(cleanPath)
        : cleanPath;
      article.contentHtml = renderMarkdownToHtml(article.contentMarkdown, relDir);
    } else if (article.contentHtml) {
      article.contentHtml = stripFrontmatter(article.contentHtml);
    }
  }

  const rawTag =
    article.tag ||
    (Array.isArray(article.highlights) && article.highlights[0]) ||
    article.categoryLabel ||
    '战术攻略';
  const articleTag = String(rawTag).replace(/\([a-zA-Z-]+\)/g, '').trim();

  const isLocalMarkdown = article.sourceType === 'LOCAL_MARKDOWN';
  const isVideo = article.category === 'video' || article.contentType === 'VIDEO';

  const fullDate = article.slug && /^pub-(\d{4})(\d{2})(\d{2})/.test(article.slug)
    ? article.slug.replace(/^pub-(\d{4})(\d{2})(\d{2}).*$/, '$1-$2-$3')
    : (article.date && article.date.length === 5 ? `2026-${article.date}` : (article.date || '2026-09-14'));

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1d] text-slate-100 selection:bg-orange-500 selection:text-slate-950">
      <TopNavBar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* 顶部面包屑与返回导航 */}
        <div className="flex items-center justify-between gap-4 mb-6 text-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-orange-400 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>返回攻略门户</span>
          </Link>

          {/* 权威源标识徽章 */}
          <div className="flex items-center gap-2">
            {isVideo ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm">
                <Film className="w-3.5 h-3.5" />
                实机录像 · 战术演练
              </span>
            ) : isLocalMarkdown ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <FileText className="w-3.5 h-3.5" />
                本地原稿 · 实时更新
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                公众号历史存档
              </span>
            )}
          </div>
        </div>

        {/* 文章头部信息卡片 */}
        <header className="mb-8 bg-[#131d33]/80 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl">
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/30">
              {articleTag}
            </span>
            {article.badge && (
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
                {article.badge}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
            {article.title}
          </h1>

          {/* 摘要说明 */}
          {article.summary && (
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6 border-l-2 border-slate-700 pl-3">
              {article.summary}
            </p>
          )}

          {/* 元数据与高光标签 */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80 text-xs sm:text-sm text-slate-400">
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-500" />
                {fullDate}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-500" />
                {article.readTime || '5 分钟'}
              </span>
              {article.views && (
                <span className="inline-flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-slate-500" />
                  {article.views} 人阅
                </span>
              )}
            </div>

            {/* 外部原始链接 */}
            {article.url && (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-orange-400 transition-colors"
              >
                <span>微信原文</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* 战术要点 Highlights */}
          {article.highlights && article.highlights.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-800/40">
              <span className="text-xs text-slate-500 inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-orange-400" /> 战术要点:
              </span>
              {article.highlights.map((h: string, idx: number) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-xs bg-slate-900/80 text-slate-300 border border-slate-800"
                >
                  #{h}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* 正文呈现卡片 */}
        {isVideo ? (
          <div className="space-y-6">
            {/* 视频专属高光播放框 */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group">
              {article.cover ? (
                <Image
                  src={article.cover.startsWith('/uploads/') ? `http://localhost:3000${article.cover}` : article.cover}
                  alt={article.title}
                  fill
                  sizes="100vw"
                  className="object-cover brightness-75 group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-slate-950 via-slate-900 to-cyan-950/40 flex items-center justify-center">
                  <Video className="w-16 h-16 text-slate-700" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                {article.url ? (
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-col items-center group/btn cursor-pointer"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-2xl shadow-cyan-500/50 group-hover/btn:scale-110 group-hover/btn:bg-cyan-400 transition-all duration-300 mb-3">
                      <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current translate-x-0.5" />
                    </div>
                    <span className="px-5 py-2 rounded-full bg-slate-950/85 backdrop-blur-md border border-cyan-400/50 text-cyan-300 text-xs sm:text-sm font-bold tracking-wide group-hover/btn:border-cyan-400 group-hover/btn:text-white shadow-lg">
                      点击前往微信观看超清实机录像
                    </span>
                  </a>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mb-2">
                    <Play className="w-8 h-8 fill-current translate-x-0.5" />
                  </div>
                )}
              </div>
            </div>

            {/* 实录战术说明卡片 */}
            <div className="bg-[#131d33] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>实机演练要点复盘</span>
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {article.summary || '本期视频包含 Boss 弹幕走位演练、核心装备科技配件搭配与极限伤害打法演示。'}
              </p>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 leading-relaxed">
                💡 战术小贴士：回响之战 Boss 打法重在开局走位与武器核心过载触发时机，建议先观摩走位规律再实操冲击更高评分。
              </div>
            </div>
          </div>
        ) : (
          <section className="bg-[#131d33] border border-slate-800/80 rounded-2xl p-6 sm:p-10 shadow-2xl">
            <TacticalArticleViewer
              contentHtml={article.contentHtml}
              sourceType={article.sourceType}
              title={article.title}
            />
          </section>
        )}

        {/* 本篇关联 Wiki 图鉴词条与养成消耗速查联动 */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-[#11192c]/90 p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span>关联 Wiki 百科词条与养成消耗速查</span>
            </h3>
            <div className="flex items-center gap-3 text-xs font-bold">
              <Link href="/items" className="text-orange-400 hover:text-orange-300">
                全部图鉴词条 →
              </Link>
              <Link href="/calculator" className="text-cyan-400 hover:text-cyan-300">
                养成消耗矩阵 →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {LOCAL_WIKI_ENTRIES.filter(
              (entry) =>
                entry.relatedArticleSlugs.includes(decodedSlug) ||
                article.title?.includes(entry.name),
            )
              .slice(0, 4)
              .map((entry) => (
                <Link
                  key={entry.slug}
                  href="/items"
                  className="flex items-center space-x-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-orange-500/40 transition-all group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={entry.icon}
                    alt={entry.name}
                    className="w-10 h-10 object-contain shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate group-hover:text-orange-400">
                      {entry.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {entry.tier || entry.subcategory}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </section>

        {/* 底部导航返回区 */}
        <footer className="mt-10 flex items-center justify-between gap-4 py-6 border-t border-slate-800 text-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-orange-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回攻略首页</span>
          </Link>

          {article.url && (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-orange-400 hover:border-orange-500/50 transition-all shadow-md"
            >
              <span>在微信中阅读原文</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </footer>
      </main>

      <FooterSection />
    </div>
  );
}
