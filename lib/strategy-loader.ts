import { ALL_STRATEGIES, StrategyArticle } from '@/lib/local-strategies-data';
import { fetchStrategies, getApiBase } from '@/lib/api';
import { loadCreatorStrategyCards } from '@/lib/creator-content';

interface RawStrategyItem {
  id?: string;
  slug: string;
  title: string;
  tag?: string;
  category?: string;
  categoryLabel?: string;
  summary?: string;
  cover?: string;
  date?: string;
  highlights?: string[];
  url?: string;
  badge?: string;
  sourcePath?: string;
}

const isReminder = (item: RawStrategyItem) =>
  item.category === 'reminder' ||
  item.categoryLabel?.includes('提醒') ||
  item.categoryLabel?.includes('日历') ||
  item.title?.includes('【弹壳日历】') ||
  item.title?.includes('日历') ||
  item.title?.includes('每日事项') ||
  item.title?.includes('每日提醒') ||
  item.slug?.includes('reminder') ||
  item.sourcePath?.includes('提醒/');

export const deriveVertical = (cover?: string) => {
  if (!cover) return undefined;
  if (cover.endsWith('/cover.png')) {
    return cover.replace(/\/cover\.png$/, '/cover_vertical.png');
  }
  return undefined;
};

export async function loadStrategies(): Promise<StrategyArticle[]> {
  const creatorArticles = loadCreatorStrategyCards();
  const mergeCreatorArticles = (base: StrategyArticle[]) => {
    const merged = new Map(base.map((article) => [article.slug, article]));
    for (const article of creatorArticles) merged.set(article.slug, article);
    return [...merged.values()];
  };
  try {
    const data = await fetchStrategies();
    if (data && Array.isArray(data) && data.length > 0) {
      const rawList = data as RawStrategyItem[];
      const strategiesOnly = rawList.filter((item) => !isReminder(item) && item.category !== 'video');
      const apiBase = getApiBase();
      const apiArticles = strategiesOnly.map((item) => {
        let coverImg = item.cover;
        if (coverImg && coverImg.startsWith('/uploads/') && apiBase && !apiBase.includes('localhost:3000')) {
          coverImg = `${apiBase}${coverImg}`;
        }
        let fullDate = '2026-09-14';
        if (item.slug && /^pub-(\d{4})(\d{2})(\d{2})/.test(item.slug)) {
          const m = item.slug.match(/^pub-(\d{4})(\d{2})(\d{2})/);
          if (m) {
            fullDate = `${m[1]}-${m[2]}-${m[3]}`;
          }
        } else if (item.date) {
          fullDate = item.date.length === 5 ? `2026-${item.date}` : item.date;
        }

        const rawTag =
          item.tag ||
          (Array.isArray(item.highlights) && item.highlights[0]) ||
          item.categoryLabel ||
          '攻略';
        const tag = String(rawTag).replace(/\([a-zA-Z-]+\)/g, '').trim();
        const cleanLabel = String(item.categoryLabel || tag).replace(/\([a-zA-Z-]+\)/g, '').trim();

        return {
          id: item.id || item.slug,
          slug: item.slug,
          title: item.title,
          tag,
          category: item.category || 'event',
          categoryLabel: cleanLabel,
          summary: item.summary || item.title,
          coverImage: coverImg || '/assets/strategy-cover-4th.png',
          coverVertical: deriveVertical(coverImg),
          publishedAt: fullDate,
          tags: Array.isArray(item.highlights)
            ? item.highlights.map((h: string) => String(h).replace(/\([a-zA-Z-]+\)/g, '').trim())
            : ['弹壳特攻队', '攻略'],
          externalUrl: item.url,
          badge: item.badge,
          isMustRead: item.slug?.includes('1000000149') || item.slug?.includes('1000000157'),
        };
      });
      return mergeCreatorArticles(apiArticles);
    }
  } catch (err) {
    console.warn('加载全量攻略失败，使用本地兜底:', err);
  }

  return mergeCreatorArticles(ALL_STRATEGIES);
}
