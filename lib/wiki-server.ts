import { LOCAL_WIKI_ENTRIES, WikiEntryItem } from './local-wiki-data';
import { normalizeWikiEntries } from './wiki-helpers';

export async function getNormalizedWikiEntries(): Promise<WikiEntryItem[]> {
  return normalizeWikiEntries(LOCAL_WIKI_ENTRIES);
}

