import HomePageClient from '@/components/HomePageClient';
import { getNormalizedWikiEntries } from '@/lib/wiki-server';
import { WIKI_CATEGORIES } from '@/lib/wiki-categories';
import { CategorySummaryItem } from '@/components/home/WikiCategoryZone';

export const dynamic = 'force-static';

export default async function Home() {
  const wikiEntries = await getNormalizedWikiEntries();

  const categoriesData: CategorySummaryItem[] = WIKI_CATEGORIES.map((catDef) => {
    if (catDef.key === 'DAMAGE_STAT') {
      return {
        key: catDef.key,
        count: 4,
        sampleIcons: [],
      };
    }

    const matching = wikiEntries.filter((e) => e.category === catDef.key);
    const orderedMatching =
      catDef.key === 'MECHANIC'
        ? [
            ...matching.filter((e) => e.icon?.includes('/道具/')),
            ...matching.filter((e) => !e.icon?.includes('/道具/')),
          ]
        : matching;
    const sampleIcons = orderedMatching
      .map((e) => e.icon)
      .filter((icon): icon is string => Boolean(icon && icon.trim()))
      .slice(0, 4);

    return {
      key: catDef.key,
      count: matching.length,
      sampleIcons,
    };
  });

  return <HomePageClient categoriesData={categoriesData} />;
}
