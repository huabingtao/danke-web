import HomePageClient from '@/components/HomePageClient';
import { ALL_STRATEGIES, StrategyArticle } from '@/lib/local-strategies-data';
import { fetchStrategies, getApiBase } from '@/lib/api';

export const dynamic = 'force-static';

export default async function Home() {
  let initialArticles: StrategyArticle[] = ALL_STRATEGIES;

  try {
    const data = await fetchStrategies();
    if (data && Array.isArray(data) && data.length > 0) {
      // 首页攻略门户：根据要求彻底过滤掉弹壳日历（reminder），作为纯粹攻略专区
      const strategiesOnly = data.filter((item: any) => item.category !== 'reminder');
      const apiBase = getApiBase();
      initialArticles = strategiesOnly.map((item: any) => {
        let coverImg = item.cover;
        if (coverImg && coverImg.startsWith('/uploads/')) {
          coverImg = `${apiBase}${coverImg}`;
        }
        // 格式化完整年月日 (YYYY-MM-DD)
        let fullDate = '2026-09-14';
        if (item.slug && /^pub-(\d{4})(\d{2})(\d{2})/.test(item.slug)) {
          const m = item.slug.match(/^pub-(\d{4})(\d{2})(\d{2})/);
          fullDate = `${m[1]}-${m[2]}-${m[3]}`;
        } else if (item.date) {
          fullDate = item.date.length === 5 ? `2026-${item.date}` : item.date;
        }

        return {
          id: item.id || item.slug,
          slug: item.slug,
          title: item.title,
          category: item.category || 'event',
          categoryLabel: item.categoryLabel || '战术攻略',
          summary: item.summary || item.title,
          coverImage: coverImg || '/assets/strategy-cover-4th.png',
          publishedAt: fullDate,
          tags: Array.isArray(item.highlights) ? item.highlights : ['弹壳特攻队', '攻略'],
          externalUrl: item.url,
          badge: item.badge,
          isMustRead: item.slug?.includes('1000000159') || item.slug?.includes('1000000149'),
        };
      });
    }
  } catch (err) {
    console.warn('服务端加载全量文章失败，使用本地兜底:', err);
  }

  return <HomePageClient initialArticles={initialArticles} />;
}
