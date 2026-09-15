"use client";

import React, { useEffect, useRef } from 'react';
import { getApiBase } from '@/lib/api';

interface TacticalArticleViewerProps {
  contentHtml?: string;
  sourceType?: string;
  title: string;
}

export default function TacticalArticleViewer({
  contentHtml,
  sourceType,
  title,
}: TacticalArticleViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const root = containerRef.current;
    const apiBase = getApiBase();

    // 1. 深度清洗微信历史 HTML 中的行内暗黑字体与刺眼白底
    const allStyledElements = root.querySelectorAll<HTMLElement>('[style]');
    allStyledElements.forEach((el) => {
      const style = el.style;
      
      // 清洗刺眼纯白/浅灰背景
      const bg = style.backgroundColor || '';
      if (
        bg.includes('255, 255, 255') ||
        bg.includes('248, 250, 252') ||
        bg.includes('242, 242, 247') ||
        bg.includes('#fff') ||
        bg === 'white'
      ) {
        style.backgroundColor = 'transparent';
      }

      // 清洗低对比度暗黑文字，恢复继承
      const color = style.color || '';
      if (
        color.includes('51, 51, 51') ||
        color.includes('30, 41, 59') ||
        color.includes('68, 68, 68') ||
        color.includes('0, 0, 0') ||
        color === 'black' ||
        color === '#333' ||
        color === '#444' ||
        color === '#1e293b'
      ) {
        style.color = 'inherit';
      }

      // 规避固定大像素宽度导致移动端溢出
      if (style.width && parseInt(style.width, 10) > 400) {
        style.maxWidth = '100%';
        style.width = 'auto';
      }
    });

    // 2. 纠正正文中所有指向 /uploads/ 的相对静态资源图片链接
    const images = root.querySelectorAll('img');
    images.forEach((img) => {
      let src = img.getAttribute('src') || img.getAttribute('data-src') || '';
      if (src.startsWith('/uploads/')) {
        img.src = `${apiBase}${src}`;
      } else if (src.startsWith('uploads/')) {
        img.src = `${apiBase}/${src}`;
      } else if (img.getAttribute('data-src') && !img.src) {
        img.src = img.getAttribute('data-src')!;
      }

      // 添加战术风图片圆角与阴影，居中自适应
      img.classList.add(
        'rounded-xl',
        'border',
        'border-slate-800',
        'shadow-xl',
        'my-6',
        'max-w-full',
        'h-auto',
        'mx-auto',
        'block',
        'transition-transform',
        'hover:scale-[1.01]',
      );

      // 图片加载失败优雅降级
      img.onerror = () => {
        img.style.display = 'none';
      };
    });

    // 3. 规范正文中所有超链接在深色战术风下的可读性
    const links = root.querySelectorAll('a');
    links.forEach((a) => {
      a.classList.add(
        'text-orange-400',
        'hover:text-orange-300',
        'underline',
        'underline-offset-4',
        'font-medium',
        'transition-colors',
      );
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    });

    // 4. 表格自动包裹横向自适应滚动容器
    const tables = root.querySelectorAll('table');
    tables.forEach((table) => {
      if (!table.parentElement?.classList.contains('table-scroll-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-scroll-wrapper overflow-x-auto my-6 rounded-xl border border-slate-800 shadow-inner bg-slate-900/50 p-1';
        table.parentNode?.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }
    });
  }, [contentHtml]);

  if (!contentHtml) {
    return (
      <div className="py-16 text-center text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
        <p className="text-base">暂无正文内容</p>
      </div>
    );
  }

  return (
    <article className="tactical-article-viewer w-full">
      {/* 正文呈现区域 */}
      <div
        ref={containerRef}
        className="tactical-content prose prose-invert max-w-none 
          prose-headings:text-slate-100 prose-headings:font-bold prose-headings:tracking-tight
          prose-h1:text-2xl sm:prose-h1:text-3xl prose-h1:border-b prose-h1:border-slate-800/80 prose-h1:pb-3 prose-h1:mb-6 prose-h1:text-white
          prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:text-orange-400 prose-h2:mt-8 prose-h2:mb-4 prose-h2:flex prose-h2:items-center prose-h2:gap-2
          prose-h3:text-lg sm:prose-h3:text-xl prose-h3:text-slate-200 prose-h3:mt-6 prose-h3:mb-3
          prose-p:text-slate-300 prose-p:leading-relaxed prose-p:my-4 prose-p:text-base sm:prose-p:text-lg
          prose-strong:text-orange-400 prose-strong:font-semibold
          prose-ul:text-slate-300 prose-ul:my-4 prose-ul:space-y-2.5 prose-ul:pl-6
          prose-ol:text-slate-300 prose-ol:my-4 prose-ol:space-y-2.5 prose-ol:pl-6
          prose-li:marker:text-orange-500 prose-li:leading-relaxed
          prose-table:w-full prose-table:border-collapse prose-table:border prose-table:border-slate-800
          prose-th:bg-slate-900/90 prose-th:text-orange-400 prose-th:p-3.5 prose-th:border prose-th:border-slate-800 prose-th:text-left prose-th:font-semibold
          prose-td:p-3.5 prose-td:border prose-td:border-slate-800/80 prose-td:text-slate-300 prose-td:text-sm sm:prose-td:text-base
          prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:bg-[#0c1427]/80 prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:rounded-r-xl prose-blockquote:my-6 prose-blockquote:text-slate-300 prose-blockquote:shadow-sm
          prose-hr:border-slate-800 prose-hr:my-8
          break-words"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </article>
  );
}
