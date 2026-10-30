import { fetchWikiEntries } from './api';
import { LOCAL_WIKI_ENTRIES, WikiEntryItem } from './local-wiki-data';
import { normalizeWikiEntries } from './wiki-helpers';

export async function getNormalizedWikiEntries(): Promise<WikiEntryItem[]> {
  let entries = LOCAL_WIKI_ENTRIES;
  try {
    const remote = await fetchWikiEntries();
    if (remote && remote.length > 0) {
      const localSpecial = LOCAL_WIKI_ENTRIES.filter(
        (e) =>
          e.category === 'COLLECTIBLE' ||
          e.category === 'MOUNT' ||
          e.category === 'MECHANIC' ||
          e.category === 'BUFF',
      );
      const nonSpecial = remote.filter(
        (e) =>
          e.category !== 'COLLECTIBLE' &&
          e.category !== 'MOUNT' &&
          e.category !== 'MECHANIC' &&
          e.category !== 'BUFF',
      );
      entries = [...nonSpecial, ...localSpecial];
    }
  } catch {
    entries = LOCAL_WIKI_ENTRIES;
  }
  return normalizeWikiEntries(entries);
}

