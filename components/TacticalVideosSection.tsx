"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Play, Film, Calendar, Tag, ChevronRight, Eye, ShieldAlert, Sparkles, Video } from 'lucide-react';
import { StrategyArticle } from '@/lib/local-strategies-data';

interface TacticalVideosSectionProps {
  videos: StrategyArticle[];
  onSelectVideo?: (video: StrategyArticle) => void;
}

const VIDEO_TABS = [
  { id: 'all', label: '全部实录' },
  { id: 'boss', label: '回响之战 Boss' },
  { id: 'guide', label: '日常速通教学' },
];

export default function TacticalVideosSection({
  videos,
  onSelectVideo,
}: TacticalVideosSectionProps) {
  const [activeTab, setActiveTab] = useState<string>('all');

  const filteredVideos = videos.filter((v) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'boss') return v.title.includes('回响之战');
    if (activeTab === 'guide') return !v.title.includes('回响之战');
    return true;
  });

  const bossCount = videos.filter((v) => v.title.includes('回响之战')).length;
  const guideCount = videos.length - bossCount;

  // 提取标题中的关键数值高光或赛季标识（如 1646Qi / 771qi / s47 / s46）
  const extractHighlight = (title: string) => {
    const matchScore = title.match(/(\d+[Qq]i|\d+分|\d+秒|新纪录\d+)/i);
    if (matchScore) return matchScore[0];
    const matchSeason = title.match(/(s\d+)/i);
    if (matchSeason) return matchSeason[0].toUpperCase();
    return null;
  };

  return (
    <section id="tactical-videos" className="mb-14 sm:mb-20 space-y-6 pt-6 border-t border-slate-800/80">
      {/* 头部：标题与分类切换 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <div className="w-2.5 h-6 rounded-full bg-cyan-500 shadow-md shadow-cyan-500/30" />
            <div className="flex items-center space-x-2">
              <Film className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg sm:text-xl font-black text-white tracking-wide">
                战术实录
              </h2>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 font-bold border border-cyan-500/30">
              实机演示
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 pl-5">
            回响之战极限伤害实测、走位控弹与日常速通实录（共收录 {videos.length} 期视频）
          </p>
        </div>

        {/* 视频子分类切换 Pills */}
        <div className="flex items-center space-x-2 self-start sm:self-auto overflow-x-auto max-w-full pb-1">
          {VIDEO_TABS.map((tab) => {
            const isSelected = activeTab === tab.id;
            let count = videos.length;
            if (tab.id === 'boss') count = bossCount;
            if (tab.id === 'guide') count = guideCount;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-black'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 视频卡片网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {filteredVideos.map((video) => {
          const highlightBadge = extractHighlight(video.title);
          const isBoss = video.title.includes('回响之战');

          return (
            <div
              key={video.id || video.slug}
              onClick={() => onSelectVideo && onSelectVideo(video)}
              className="group relative flex flex-col rounded-2xl bg-[#0f172a]/75 hover:bg-[#131d33] border border-slate-800/90 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-cyan-500/10 cursor-pointer"
            >
              {/* 视频封面预览区 (16:9 比例) */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                {video.coverImage ? (
                  <Image
                    src={video.coverImage}
                    alt={video.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-100"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-slate-950 via-slate-900 to-cyan-950/40 flex items-center justify-center">
                    <Video className="w-10 h-10 text-slate-700" />
                  </div>
                )}

                {/* 渐变遮罩 */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

                {/* 悬浮播放指示器 (Play Button) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-11 h-11 rounded-full bg-slate-950/80 border border-cyan-400/40 text-cyan-400 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-slate-950 group-hover:border-transparent transition-all duration-300">
                    <Play className="w-5 h-5 fill-current translate-x-0.5" />
                  </div>
                </div>

                {/* 顶部标签 */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide backdrop-blur-md shadow-md ${
                    isBoss
                      ? 'bg-rose-500/90 text-white'
                      : 'bg-emerald-500/90 text-white'
                  }`}>
                    {isBoss ? '回响 Boss' : '搬砖教学'}
                  </span>

                  {highlightBadge && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-500/90 text-slate-950 backdrop-blur-md shadow-md">
                      {highlightBadge}
                    </span>
                  )}
                </div>

                {/* 底部时长/录像标识 */}
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-slate-950/85 border border-slate-800 text-[10px] text-slate-300 font-medium">
                  实机录像
                </div>
              </div>

              {/* 下半部分：文本元数据 */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                <div>
                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug">
                    {video.title}
                  </h3>
                  {video.summary && (
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                      {video.summary}
                    </p>
                  )}
                </div>

                {/* 底部信息栏 */}
                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="inline-flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{video.publishedAt}</span>
                  </span>

                  <span className="inline-flex items-center space-x-1 text-cyan-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                    <span>观摩实操</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
