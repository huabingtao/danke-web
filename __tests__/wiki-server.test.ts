import { describe, expect, it } from 'vitest';
import { LOCAL_WIKI_ENTRIES } from '@/lib/local-wiki-data';

describe('getNormalizedWikiEntries', () => {
  it('serves the Web-owned Wiki snapshot without calling Core', async () => {
    const { getNormalizedWikiEntries } = await import('@/lib/wiki-server');
    const entries = await getNormalizedWikiEntries();

    expect(entries.length).toBeGreaterThanOrEqual(243);
    expect(entries.some((entry) => entry.category === 'BUFF')).toBe(true);
    expect(entries.some((entry) => entry.name === 'Remote Agent')).toBe(false);
  });

  it('retains the full local detail data for entries that Core previously summarized', async () => {
    const localPart = LOCAL_WIKI_ENTRIES.find((entry) => entry.category === 'TECH_PART');
    expect(localPart).toBeDefined();

    const { getNormalizedWikiEntries } = await import('@/lib/wiki-server');
    const entries = await getNormalizedWikiEntries();
    const restored = entries.find((entry) => entry.slug === localPart!.slug);

    expect(restored?.attributes.techTabs).toEqual(localPart!.attributes.techTabs);
  });
});
