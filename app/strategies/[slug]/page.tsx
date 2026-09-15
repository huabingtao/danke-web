import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, Eye, ExternalLink, Sparkles, FileText, Globe, Play, Film, Video } from 'lucide-react';
import TopNavBar from '@/components/TopNavBar';
import FooterSection from '@/components/FooterSection';
import TacticalArticleViewer from '@/components/TacticalArticleViewer';
import { fetchStrategyBySlug } from '@/lib/api';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const res = await fetch('http://localhost:3000/api/strategies?limit=1000');
    if (!res.ok) return [];
    const items = await res.json();
    return items.map((item: { slug: string }) => ({
      slug: item.slug,
    }));
  } catch (e) {
    console.warn('generateStaticParams fallback:', e);
    return [];
  }
}

export default async function StrategyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const article = await fetchStrategyBySlug(decodedSlug);

  if (!article) {
    notFound();
  }

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
              {article.categoryLabel || '战术攻略'}
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
