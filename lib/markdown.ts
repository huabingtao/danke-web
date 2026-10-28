import matter from 'gray-matter';
import { Marked, Renderer } from 'marked';
import hljs from 'highlight.js';
import DOMPurify from 'isomorphic-dompurify';

/**
 * 安全解码 URI 字符串，杜绝由于截断（例如 .slice(0, 30) 截断多字节 UTF-8 编码尾部 %xx）
 * 导致 decodeURIComponent 抛出 URIError: URI malformed 致命异常
 */
export function safeDecodeUri(str: string | null | undefined): string {
  if (!str) return '';
  try {
    return decodeURIComponent(str);
  } catch {
    let cleaned = str;
    while (cleaned.includes('%')) {
      // 循环剔除末尾可能残缺的百分号序列（如 %e6 或 %e 或 %）
      cleaned = cleaned.replace(/%[0-9a-fA-F]{0,2}$/, '');
      try {
        return decodeURIComponent(cleaned);
      } catch {
        // 继续向上剔除直到能正确解码或无百分号
      }
    }
    return cleaned;
  }
}

/**
 * 辅助函数：彻底去除标签中的英文括号及内容，只保留纯中文
 * 例如: "活动(activity)" -> "活动", "装备(equipment)" -> "装备"
 */
export function cleanChineseTag(tag: string | null | undefined): string {
  if (!tag) return '';
  return tag.replace(/\([a-zA-Z-]+\)/g, '').trim();
}

/**
 * 使用 GitHub 著名开源库 gray-matter 彻底剥离 Frontmatter 数据头（--- ... ---）
 */
export function stripFrontmatter(content: string | null | undefined): string {
  if (!content) return '';

  let clean = content;

  // 1. 若为原始 Markdown，使用 gray-matter 剥离 YAML 头部
  if (clean.trimStart().startsWith('---')) {
    try {
      const parsed = matter(clean);
      clean = parsed.content.trim();
    } catch {
      clean = clean.replace(/^---\s*[\r\n]+[\s\S]*?[\r\n]+---\s*[\r\n]*/, '').trim();
    }
  }

  // 2. 剥离已被预编译或历史泄漏进 HTML 的 Frontmatter 结构
  // 例如：<hr><p>title: "..." ... </p><ul>...</ul><hr>
  clean = clean.replace(
    /^<hr\s*\/?>\s*<p>\s*(?:title|tag|social_title|summary|tags|cover|author|date|lastmod):[\s\S]*?(?:<\/ul>|<\/p>)\s*(?:<hr\s*\/?>)?/i,
    '',
  );

  clean = clean.replace(/^<hr\s*\/?>[\s\S]*?<hr\s*\/?>/i, (match) => {
    if (
      match.includes('title:') ||
      match.includes('summary:') ||
      match.includes('tag:') ||
      match.includes('author:') ||
      match.includes('lastmod:')
    ) {
      return '';
    }
    return match;
  });

  // 3. 剥离文章最顶端可能遗留的孤立首行分割线
  clean = clean.replace(/^\s*---\s*[\r\n]+/, '');

  return clean.trim();
}

/**
 * macOS 风格代码块红黄绿三色小圆点 SVG（源自 cross-publisher / doocs-md 规范）
 */
const MAC_CODE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="45px" height="13px" viewBox="0 0 450 130">
  <ellipse cx="50" cy="65" rx="50" ry="52" fill="rgb(237,108,96)" />
  <ellipse cx="225" cy="65" rx="50" ry="52" fill="rgb(247,193,81)" />
  <ellipse cx="400" cy="65" rx="50" ry="52" fill="rgb(100,200,86)" />
</svg>
`.trim();

/**
 * 辅助构建带语义 class 与 data-heading 属性的元素节点
 */
function styledContent(
  styleLabel: string,
  content: string,
  tagName?: string,
  style?: string,
): string {
  const tag = tagName ?? styleLabel;
  const className = `${styleLabel.replace(/_/g, '-')}`;
  const headingAttr = /h\d/.test(tag) ? ' data-heading="true"' : '';
  const styleAttr = style ? ` style="${style}"` : '';
  return `<${tag} class="${className}"${headingAttr}${styleAttr}>${content}</${tag}>`;
}

/**
 * 代码高亮空格与换行排版美化
 */
function formatHighlightedCode(html: string): string {
  let formatted = html;
  formatted = formatted.replace(
    /(<span[^>]*>[^<]*<\/span>)(\s+)(<span[^>]*>[^<]*<\/span>)/g,
    (_, span1, spaces, span2) => span1 + span2.replace(/^(<span[^>]*>)/, `$1${spaces}`),
  );
  formatted = formatted.replace(
    /(\s+)(<span[^>]*>)/g,
    (_, spaces, span) => span.replace(/^(<span[^>]*>)/, `$1${spaces}`),
  );
  formatted = formatted.replace(/\t/g, '    ');
  return formatted;
}

/**
 * 使用 Highlight.js 进行精准代码语法高亮，并生成 macOS 经典三色红黄绿窗体与行号结构
 */
function highlightAndFormatCode(text: string, language: string, showLineNumber = true): string {
  const hasLang = language && hljs.getLanguage(language);
  const actualLang = hasLang ? language : 'plaintext';

  if (showLineNumber) {
    const rawLines = text.replace(/\r\n/g, '\n').split('\n');
    const highlightedLines = rawLines.map((lineRaw) => {
      const lineHtml = hljs.highlight(lineRaw, { language: actualLang }).value;
      const formatted = formatHighlightedCode(lineHtml);
      return formatted === '' ? '&nbsp;' : formatted;
    });

    const lineNumbersHtml = highlightedLines
      .map((_, idx) => `<section style="padding:0 10px 0 0;line-height:1.7">${idx + 1}</section>`)
      .join('');
    const codeInnerHtml = highlightedLines.join('<br/>');
    const codeLinesHtml = `<div style="white-space:pre;min-width:max-content;line-height:1.7">${codeInnerHtml}</div>`;

    return `
      <section style="display:flex;align-items:flex-start;overflow-x:hidden;overflow-y:auto;width:100%;max-width:100%;padding:0;box-sizing:border-box">
        <section class="line-numbers" style="text-align:right;padding:10px 0;user-select:none;">${lineNumbersHtml}</section>
        <section class="code-scroll" style="flex:1 1 auto;overflow-x:auto;overflow-y:visible;padding:10px 14px;min-width:0;box-sizing:border-box">${codeLinesHtml}</section>
      </section>
    `;
  } else {
    const rawHighlighted = hljs.highlight(text, { language: actualLang }).value;
    return formatHighlightedCode(rawHighlighted);
  }
}

/**
 * 将 Markdown 格式的攻略正文深度净化并使用融合 cross-publisher (doocs/md) 技术的渲染引擎转换为精美 HTML
 * @param markdown 原始或清洗过的 markdown 内容
 * @param articleDirRel 相对于 my-articles-md 的文章子目录（如 "其他/周常和日常分享"）
 */
export function renderMarkdownToHtml(
  markdown: string | null | undefined,
  articleDirRel?: string,
): string {
  if (!markdown) return '';

  // 1. 剥离 Frontmatter 数据头
  let md = stripFrontmatter(markdown);

  // 2. 剥离内部图床协议占位符 img:// 与自定义语法后缀
  md = md.replace(/!\[.*?\]\(\s*img:\/\/[^)]+\s*\)(?:\{[^}]*\})?/gi, '');
  md = md.replace(/(!\[.*?\]\([^)]+\))\s*\{[^}]+\}/gi, '$1');
  md = md.replace(/\{type=[^}]+\}/gi, '');

  // 3. 相对图片路径重写（支持文章本地相对图片通过 /uploads/creator 访问）
  if (articleDirRel) {
    const encodedDir = articleDirRel
      .split('/')
      .map((segment) => encodeURIComponent(segment))
      .join('/');

    md = md.replace(
      /!\[(.*?)\]\((?:\.\/)?([^):]+?\.(?:png|jpe?g|webp|gif|svg))\)/gi,
      (match, alt, relativePath) => {
        if (relativePath.startsWith('http') || relativePath.startsWith('/')) {
          return match;
        }
        const encodedPath = relativePath
          .split('/')
          .map((part: string) => encodeURIComponent(part))
          .join('/');
        return `![${alt}](/uploads/creator/${encodedDir}/${encodedPath})`;
      },
    );
  }

  // 4. 清理宏语法（例如 {{短名称}} 转换为纯净文本）
  md = md.replace(/\{\{([^}]+)\}\}/g, '$1');

  // 5. 构建借鉴 cross-publisher 微信排版引擎的自定义 Marked Renderer
  const footnotes: [number, string, string][] = [];
  let footnoteIndex = 0;
  const listOrderedStack: boolean[] = [];
  const listCounters: number[] = [];

  function addFootnote(title: string, link: string): number {
    const existing = footnotes.find(([, , l]) => l === link);
    if (existing) return existing[0];
    footnotes.push([++footnoteIndex, title, link]);
    return footnoteIndex;
  }

  const renderer = new Renderer();

  // 一级标题、二级标题、三级标题等排版
  renderer.heading = function (this: any, token: any) {
    const text = this.parser.parseInline(token.tokens);
    return styledContent(`h${token.depth}`, text);
  };

  renderer.paragraph = function (this: any, token: any) {
    const text = this.parser.parseInline(token.tokens);
    const isFigureImage = text.includes('<figure') && text.includes('<img');
    const isEmpty = text.trim() === '';
    if (isFigureImage || isEmpty) return text;
    return styledContent('p', text);
  };

  renderer.blockquote = function (this: any, token: any) {
    const text = this.parser.parse(token.tokens);
    return styledContent('blockquote', text);
  };

  // 代码块高亮与 Mac 红黄绿圆点
  renderer.code = function (token: any) {
    const lang = token.lang ? token.lang.split(' ')[0] : 'plaintext';
    const highlighted = highlightAndFormatCode(token.text, lang, true);
    const span = `<span class="mac-sign">${MAC_CODE_SVG}</span>`;
    const code = `<code class="language-${lang}">${highlighted}</code>`;
    return `<pre class="hljs code__pre">${span}${code}</pre>`;
  };

  // 行内代码
  renderer.codespan = function (token: any) {
    const escapedText = token.text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/`/g, '&#96;');
    return styledContent('codespan', escapedText, 'code');
  };

  // 列表与编号
  renderer.list = function (this: any, token: any) {
    listOrderedStack.push(token.ordered);
    listCounters.push(Number(token.start || 1));

    const html = token.items.map((item: any) => this.listitem(item)).join('');

    listOrderedStack.pop();
    listCounters.pop();

    return styledContent(token.ordered ? 'ol' : 'ul', html);
  };

  renderer.listitem = function (this: any, token: any) {
    const ordered = listOrderedStack[listOrderedStack.length - 1];
    const idx = listCounters[listCounters.length - 1];
    listCounters[listCounters.length - 1] = idx + 1;
    const prefix = ordered ? `${idx}. ` : '• ';

    let content: string;
    try {
      content = this.parser.parseInline(token.tokens);
    } catch {
      content = this.parser.parse(token.tokens).replace(/^<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/, '$1');
    }
    return styledContent('listitem', `${prefix}${content}`, 'li');
  };

  // 图片与画框
  renderer.image = function (token: any) {
    let widthAttr = '';
    let heightAttr = '';
    let altText = token.text || '';

    const sizeMatch = altText.match(/\|(\d+)(?:x(\d+))?$/);
    if (sizeMatch) {
      altText = altText.replace(/\|(\d+)(?:x(\d+))?$/, '');
      widthAttr = sizeMatch[1] ? ` width="${sizeMatch[1]}"` : '';
      heightAttr = sizeMatch[2] ? ` height="${sizeMatch[2]}"` : '';
    }

    const figCaption = altText ? `<figcaption class="figcaption">${altText}</figcaption>` : '';
    return `<figure class="figure"><img src="${token.href}"${token.title ? ` title="${token.title}"` : ''}${widthAttr}${heightAttr} alt="${altText}" loading="lazy" />${figCaption}</figure>`;
  };

  // 表格自适应滚动包裹
  renderer.table = function (this: any, token: any) {
    const headerRow = token.header
      .map((cell: any) => {
        const text = this.parser.parseInline(cell.tokens);
        return styledContent('th', text, undefined, `text-align: ${cell.align || 'left'}`);
      })
      .join('');
    const body = token.rows
      .map((row: any) => {
        const rowContent = row.map((cell: any) => this.tablecell(cell)).join('');
        return styledContent('tr', rowContent);
      })
      .join('');
    return `
      <section class="table-scroll-wrapper" style="max-width: 100%; overflow: auto; -webkit-overflow-scrolling: touch">
        <table class="preview-table">
          <thead>${headerRow}</thead>
          <tbody>${body}</tbody>
        </table>
      </section>
    `;
  };

  renderer.tablecell = function (token: any) {
    const text = this.parser.parseInline(token.tokens);
    return styledContent('td', text, undefined, `text-align: ${token.align || 'left'}`);
  };

  // 粗体加亮
  renderer.strong = function (this: any, token: any) {
    return styledContent('strong', this.parser.parseInline(token.tokens));
  };

  renderer.em = function (this: any, token: any) {
    return styledContent('em', this.parser.parseInline(token.tokens));
  };

  renderer.hr = function () {
    return `<hr class="hr">`;
  };

  // 链接与尾注
  renderer.link = function (this: any, token: any) {
    const parsedText = this.parser.parseInline(token.tokens);
    const MP_WEIXIN_LINK_REGEX = /^https?:\/\/mp\.weixin\.qq\.com/;
    if (MP_WEIXIN_LINK_REGEX.test(token.href)) {
      return `<a href="${token.href}" target="_blank" rel="noopener noreferrer" title="${token.title || token.text}">${parsedText}</a>`;
    }
    if (token.href === token.text) {
      return parsedText;
    }
    const ref = addFootnote(token.title || token.text, token.href);
    return `<a href="${token.href}" target="_blank" rel="noopener noreferrer" title="${token.title || token.text}">${parsedText}<sup>[${ref}]</sup></a>`;
  };

  const markedInstance = new Marked({ renderer, breaks: true });
  let html = markedInstance.parse(md) as string;

  // 尾注排版
  if (footnotes.length > 0) {
    const footnoteList = footnotes
      .map(([index, title, link]) =>
        link === title
          ? `<code style="font-size: 90%; opacity: 0.7;">[${index}]</code> <i style="word-break: break-all">${title}</i><br/>`
          : `<code style="font-size: 90%; opacity: 0.7;">[${index}]</code> ${title}: <i style="word-break: break-all">${link}</i><br/>`,
      )
      .join('\n');
    html += styledContent('h4', '引用链接');
    html += styledContent('footnotes', footnoteList, 'p');
  }

  // 6. 使用 DOMPurify 进行企业级安全过滤
  return DOMPurify.sanitize(html, { ADD_TAGS: ['mp-common-profile', 'section', 'figure', 'figcaption'] });
}
