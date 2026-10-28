"use client";

import React, { useEffect, useRef } from 'react';
import { getApiBase } from '@/lib/api';
import { stripFrontmatter } from '@/lib/markdown';

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
  const cleanHtml = stripFrontmatter(contentHtml);

  useEffect(() => {
    if (!containerRef.current) return;
    const root = containerRef.current;
    const apiBase = getApiBase();

    // 0. 防御性彻底消除顶端泄漏的 frontmatter 节点 (title:, summary:, tags:)
    const firstChildren = Array.from(root.children).slice(0, 5);
    for (const child of firstChildren) {
      const text = child.textContent || '';
      if (
        (text.includes('title:') || text.includes('tag:')) &&
        (text.includes('summary:') || text.includes('tags:') || text.includes('author:') || text.includes('cover:'))
      ) {
        child.remove();
      }
    }

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

      // 图片加载失败优雅降级，严格杜绝死循环向控制台刷请求
      img.onerror = () => {
        // 立即注销 onerror 事件监听，彻底阻断任何二次递归死循环
        img.onerror = null;

        const currentSrc = img.src;
        // 最多仅尝试一次跨端口优雅回退（仅当未重试过且来自非本页面端口时）
        if (!img.dataset.retried && typeof window !== 'undefined') {
          img.dataset.retried = 'true';
          const localPort = window.location.port || '3002';
          if (currentSrc.includes(':3000') || currentSrc.includes(':3001')) {
            const fallbackSrc = currentSrc.replace(/:(3000|3001)/, `:${localPort}`);
            if (fallbackSrc !== currentSrc) {
              img.src = fallbackSrc;
              return;
            }
          }
        }
        // 最终兜底：优雅隐藏失败图片，绝不频繁重发请求
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
  }, [cleanHtml]);

  if (!cleanHtml) {
    return (
      <div className="py-16 text-center text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
        <p className="text-base">暂无正文内容</p>
      </div>
    );
  }

  return (
    <article className="tactical-article-viewer w-full">
      {/* 正文呈现区域：融合 cross-publisher 微信排版引擎与战术电竞视觉 */}
      <div
        ref={containerRef}
        className="tactical-content w-full"
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />
    </article>
  );
}
