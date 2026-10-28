import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { safeDecodeUri, cleanChineseTag, renderMarkdownToHtml } from './markdown';

export const FOLDER_CATEGORY_MAP: Record<string, { category: string; label: string }> = {
  event: { category: 'event', label: '活动' },
  活动: { category: 'event', label: '活动' },
  公会: { category: 'guild', label: '公会' },
  其他: { category: 'faq', label: '答疑' },
  区域行动: { category: 'boss', label: '挑战' },
  逃离行动: { category: 'boss', label: '挑战' },
  联机: { category: 'boss', label: '挑战' },
  宠物: { category: 'resources', label: '宠物' },
  装备: { category: 'resources', label: '装备' },
  收藏品: { category: 'resources', label: '收藏品' },
  载具: { category: 'resources', label: '载具' },
  配件: { category: 'resources', label: '配件' },
  爆料: { category: 'news', label: '资讯' },
  版本更新: { category: 'news', label: '版本' },
  特工: { category: 'characters', label: '特工' },
  提醒: { category: 'reminder', label: '每日日历' },
};

export interface ResolvedArticle {
  id: string;
  slug: string;
  title: string;
  tag: string;
  category: string;
  categoryLabel: string;
  badge?: string;
  summary: string;
  readTime: string;
  views: string;
  date: string;
  highlights: string[];
  coverImage?: string;
  cover?: string;
  contentHtml: string;
  sourceType: string;
  sourcePath?: string;
  url?: string;
}

/**
 * 获取 danke-creator/my-articles-md 物理根路径
 */
export function getCreatorArticlesBaseDir(): string {
  const possiblePaths = [
    path.resolve(process.cwd(), '../danke-creator/my-articles-md'),
    path.resolve(process.cwd(), 'danke-creator/my-articles-md'),
    path.resolve('/Users/hbt/my-project/danke-creator/my-articles-md'),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return possiblePaths[0];
}

/**
 * 扫描本地所有文章手稿，生成所有可能的有效 slug（包括纯中文、URL 编码版、历史截断兼容别名）
 * 供 Next.js output: 'export' 模式下的 generateStaticParams() 生成静态页面，彻底消灭 404
 */
export function getAllLocalArticleSlugs(): string[] {
  const baseDir = getCreatorArticlesBaseDir();
  if (!fs.existsSync(baseDir)) return [];

  const slugs = new Set<string>();

  try {
    const folders = fs.readdirSync(baseDir);
    for (const folder of folders) {
      if (folder.startsWith('.')) continue;
      const folderPath = path.join(baseDir, folder);
      if (!fs.statSync(folderPath).isDirectory()) continue;

      const categoryInfo = FOLDER_CATEGORY_MAP[folder] || {
        category: 'resources',
        label: '攻略',
      };
      const category = categoryInfo.category;

      const subDirs = fs.readdirSync(folderPath);
      for (const sub of subDirs) {
        if (sub.startsWith('.')) continue;
        const subPath = path.join(folderPath, sub);
        if (!fs.statSync(subPath).isDirectory()) continue;

        const cleanSub = sub.trim().replace(/[\s\/\\]+/g, '-');

        // 1. 标准可读纯中文 slug（如 faq-周常和日常分享）
        slugs.add(`${category}-${cleanSub}`);

        // 2. URL 编码版 slug（如 faq-%e5%91%a8%e5%b8%b8%e5%92%8c%e6%97%a5%e5%b8%b8%e5%88%86%e4%ba%ab）
        slugs.add(`${category}-${encodeURIComponent(cleanSub)}`);

        // 3. 历史数据库截断兼容 slug（如 faq-%e5%91%a8%e5%b8%b8%e5%92%8c%e6）
        const legacyTruncated = `${category}-${encodeURIComponent(sub).toLowerCase().slice(0, 30)}`;
        slugs.add(legacyTruncated);

        // 4. 目录名直接作为别名（如 周常和日常分享）
        slugs.add(cleanSub);
      }
    }
  } catch (err) {
    console.warn('获取本地文章静态 Slugs 失败:', err);
  }

  return Array.from(slugs);
}

/**
 * 根据任意输入的 slug（原始 URL 参数、已截断历史参数、解码中文等）
 * 从本地文件系统精准查找并解析对应的 Markdown 攻略
 */
export function resolveLocalArticle(inputSlug: string): ResolvedArticle | null {
  if (!inputSlug) return null;

  const baseDir = getCreatorArticlesBaseDir();
  if (!fs.existsSync(baseDir)) return null;

  const rawSlug = inputSlug.trim();
  const decoded = safeDecodeUri(rawSlug);

  // 提取可能的 category 前缀和核心目标关键词
  let categoryPrefix = '';
  let targetKeyword = decoded;

  const dashIndex = decoded.indexOf('-');
  if (dashIndex > 0) {
    const potentialCat = decoded.slice(0, dashIndex).toLowerCase();
    const isKnownCategory = Object.values(FOLDER_CATEGORY_MAP).some(
      (m) => m.category === potentialCat,
    );
    if (isKnownCategory) {
      categoryPrefix = potentialCat;
      targetKeyword = decoded.slice(dashIndex + 1).trim();
    }
  }

  const targetLower = targetKeyword.toLowerCase();

  try {
    const folders = fs.readdirSync(baseDir);

    interface MatchCandidate {
      folder: string;
      subDir: string;
      fullPath: string;
      score: number;
    }

    const matches: MatchCandidate[] = [];

    for (const folder of folders) {
      if (folder.startsWith('.')) continue;
      const folderPath = path.join(baseDir, folder);
      if (!fs.statSync(folderPath).isDirectory()) continue;

      const mapping = FOLDER_CATEGORY_MAP[folder] || {
        category: 'resources',
        label: '攻略',
      };

      // 如果指定了 category 前缀，且当前文件夹的分类不匹配，降低优先级
      const categoryMatches = !categoryPrefix || mapping.category === categoryPrefix;

      const subDirs = fs.readdirSync(folderPath);
      for (const subDir of subDirs) {
        if (subDir.startsWith('.')) continue;
        const subPath = path.join(folderPath, subDir);
        if (!fs.statSync(subPath).isDirectory()) continue;

        const subClean = subDir.trim().replace(/[\s\/\\]+/g, '-');
        const subLower = subClean.toLowerCase();
        const legacyTruncated = `${mapping.category}-${encodeURIComponent(subDir).toLowerCase().slice(0, 30)}`;

        let score = 0;

        // 1. 完全匹配历史截断 slug
        if (legacyTruncated === rawSlug.toLowerCase()) {
          score = 100;
        }
        // 2. 完全匹配标准 slug
        else if (
          `${mapping.category}-${subClean}` === decoded ||
          `${mapping.category}-${encodeURIComponent(subClean)}` === rawSlug
        ) {
          score = 90;
        }
        // 3. 目录名与目标关键词完全相等
        else if (subLower === targetLower) {
          score = categoryMatches ? 85 : 70;
        }
        // 4. 目录名包含目标关键词，或目标关键词包含目录名
        else if (subLower.includes(targetLower)) {
          score = categoryMatches ? 80 : 60;
        } else if (targetLower.includes(subLower)) {
          score = categoryMatches ? 75 : 55;
        }

        if (score > 0) {
          matches.push({
            folder,
            subDir,
            fullPath: subPath,
            score,
          });
        }
      }
    }

    if (matches.length === 0) return null;

    // 按匹配打分最高者胜出
    matches.sort((a, b) => b.score - a.score);
    const best = matches[0];

    // 在找到的文章目录中寻找 Markdown 攻略文件
    const dirFiles = fs.readdirSync(best.fullPath);
    const mdFileName =
      dirFiles.find((f) => f === '攻略.md') ||
      dirFiles.find((f) => f === `${best.subDir}.md`) ||
      dirFiles.find((f) => f.endsWith('.md') && !f.includes('_stage') && f !== '粗稿.md') ||
      dirFiles.find((f) => f.endsWith('.md') && !f.includes('_stage')) ||
      dirFiles.find((f) => f.endsWith('.md'));

    if (!mdFileName) return null;

    const mdFilePath = path.join(best.fullPath, mdFileName);
    const rawMd = fs.readFileSync(mdFilePath, 'utf-8');

    // 使用 gray-matter 解析 Frontmatter
    let frontmatterData: Record<string, any> = {};
    try {
      const parsed = matter(rawMd);
      frontmatterData = parsed.data || {};
    } catch {
      // ignore
    }

    // 提取标题
    let title = frontmatterData.title || frontmatterData.social_title;
    if (!title) {
      const lines = rawMd.split('\n');
      const h1 = lines.find((l) => l.startsWith('# '));
      title = h1 ? h1.replace(/^#\s*/, '').trim() : best.subDir;
    }

    // 分类与标签
    const mapping = FOLDER_CATEGORY_MAP[best.folder] || {
      category: 'resources',
      label: '攻略',
    };
    const isReminder =
      best.folder === '提醒' ||
      best.subDir.startsWith('26.') ||
      title.includes('日历') ||
      title.includes('每日事项') ||
      title.includes('每日提醒');

    const finalCategory = isReminder ? 'reminder' : mapping.category;
    const rawTag =
      frontmatterData.tag ||
      (Array.isArray(frontmatterData.tags) && frontmatterData.tags[0]) ||
      mapping.label;
    const tag = cleanChineseTag(rawTag);
    const categoryLabel = isReminder ? '每日日历' : tag || mapping.label;

    // 亮点标签
    let highlights: string[] = ['核心机制', '实战指引'];
    if (Array.isArray(frontmatterData.tags)) {
      highlights = frontmatterData.tags
        .filter((t: string) => t !== '弹壳特攻队' && t !== '游戏攻略')
        .map((t: string) => cleanChineseTag(t));
    }
    if (tag && !highlights.includes(tag)) {
      highlights = [tag, ...highlights];
    }

    // 摘要
    const summary =
      frontmatterData.summary ||
      frontmatterData.social_title ||
      `《弹壳特攻队》${title}战术全解析`;

    // 封面图路径
    let cover: string | undefined;
    if (fs.existsSync(path.join(best.fullPath, 'cover.png'))) {
      cover = `/uploads/creator/${best.folder}/${best.subDir}/cover.png`;
    } else if (fs.existsSync(path.join(best.fullPath, 'dist', 'cover.png'))) {
      cover = `/uploads/creator/${best.folder}/${best.subDir}/dist/cover.png`;
    }

    // 日期
    let date = '2026-10-25';
    if (frontmatterData.date) {
      date = String(frontmatterData.date).slice(0, 10);
    } else if (frontmatterData.lastmod) {
      date = String(frontmatterData.lastmod).slice(0, 10);
    }

    // 微信原文外链
    let url: string | undefined;
    if (Array.isArray(frontmatterData.recommendations) && frontmatterData.recommendations[0]?.url) {
      url = frontmatterData.recommendations[0].url;
    }

    // 使用 marked 渲染纯净 HTML，无 frontmatter 数据头泄漏
    const relDir = `${best.folder}/${best.subDir}`;
    const contentHtml = renderMarkdownToHtml(rawMd, relDir);

    return {
      id: rawSlug,
      slug: rawSlug,
      title,
      tag,
      category: finalCategory,
      categoryLabel,
      badge: best.subDir.includes('大乱斗') ? '最新' : undefined,
      summary,
      readTime: '6 分钟',
      views: '1.2w',
      date,
      highlights,
      coverImage: cover || '/assets/strategy-cover-4th.png',
      cover: cover || '/assets/strategy-cover-4th.png',
      contentHtml,
      sourceType: 'LOCAL_MARKDOWN',
      sourcePath: path.relative(process.cwd(), mdFilePath),
      url,
    };
  } catch (err) {
    console.warn(`本地解析文章 [${inputSlug}] 发生错误:`, err);
    return null;
  }
}
