import HomePageClient from '@/components/HomePageClient';
import { fetchWikiEntries } from '@/lib/api';
import { LOCAL_WIKI_ENTRIES, WikiEntryItem } from '@/lib/local-wiki-data';
import { WIKI_CATEGORIES } from '@/lib/wiki-categories';
import { CategorySummaryItem } from '@/components/home/WikiCategoryZone';

export const dynamic = 'force-static';

export default async function Home() {
  let wikiEntries: WikiEntryItem[] = LOCAL_WIKI_ENTRIES;
  try {
    const remote = await fetchWikiEntries();
    if (remote && Array.isArray(remote) && remote.length > 0) {
      wikiEntries = remote;
    }
  } catch {
    wikiEntries = LOCAL_WIKI_ENTRIES;
  }

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
