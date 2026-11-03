import { getApiBase } from './core-api';
import { fetchGemCatalog, sortGemItems, type GemCatalog, type GemItem } from './gem-values';

export interface AcquisitionSource { id: string; name: string }
export interface AcquisitionOffer { id: string; itemId: string; sourceId: string; amount: number }
export interface AcquisitionSnapshot {
  catalog: GemCatalog;
  sources: AcquisitionSource[];
  offers: AcquisitionOffer[];
  period: { year: number; month: number } | null;
}
export interface ResourceCardData { item: GemItem; offers: { source: AcquisitionSource; amount: number }[] }
export interface SourceCardData { source: AcquisitionSource; offers: { item: GemItem; amount: number }[] }

// Only sum the same resource's matching sources; precision follows the recorded quantities.
export function formatAcquisitionTotal(offers: { amount: number }[]): string {
  const fractionDigits = offers.reduce((precision, { amount }) => {
    const [coefficient, exponent = '0'] = amount.toString().split('e');
    return Math.min(20, Math.max(precision, (coefficient.split('.')[1]?.length ?? 0) - Number(exponent)));
  }, 0);
  return offers.reduce((total, offer) => total + offer.amount, 0).toLocaleString('zh-CN', { maximumFractionDigits: fractionDigits });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}
const dataError = () => new Error('资源获取数据异常或正在更新，请重试');

export function parseAcquisitionSnapshot(catalog: GemCatalog, sourceData: unknown, recordData: unknown): AcquisitionSnapshot {
  if (!Array.isArray(sourceData) || !Array.isArray(recordData)) throw dataError();
  const sources = new Map<string, AcquisitionSource>();
  for (const source of sourceData) {
    if (!isRecord(source) || typeof source.id !== 'string' || !source.id || typeof source.name !== 'string' || !source.name.trim()) throw dataError();
    if (!sources.has(source.id)) sources.set(source.id, { id: source.id, name: source.name });
  }
  const records = new Map<string, AcquisitionOffer & { year: number; month: number }>();
  for (const entry of recordData) {
    if (!isRecord(entry) || typeof entry.id !== 'string' || !entry.id || typeof entry.itemId !== 'string' || typeof entry.sourceId !== 'string'
      || typeof entry.amount !== 'number' || !Number.isFinite(entry.amount) || typeof entry.year !== 'number' || !Number.isInteger(entry.year)
      || typeof entry.month !== 'number' || !Number.isInteger(entry.month) || entry.month < 1 || entry.month > 12) throw dataError();
    const record = { id: entry.id, itemId: entry.itemId, sourceId: entry.sourceId, amount: entry.amount, year: entry.year, month: entry.month };
    const previous = records.get(record.id);
    if (previous && JSON.stringify(previous) !== JSON.stringify(record)) throw dataError();
    records.set(record.id, record);
  }
  let period: AcquisitionSnapshot['period'] = null;
  for (const record of records.values()) {
    if (!period || record.year * 12 + record.month > period.year * 12 + period.month) period = { year: record.year, month: record.month };
  }
  const itemIds = new Set(catalog.items.map((item) => item.id));
  const pairs = new Set<string>();
  const offers: AcquisitionOffer[] = [];
  for (const record of records.values()) {
    if (!period || record.year !== period.year || record.month !== period.month || record.amount === 0) continue;
    const pair = JSON.stringify([record.itemId, record.sourceId]);
    if (!itemIds.has(record.itemId) || !sources.has(record.sourceId) || pairs.has(pair)) throw dataError();
    pairs.add(pair);
    offers.push({ id: record.id, itemId: record.itemId, sourceId: record.sourceId, amount: record.amount });
  }
  return { catalog, sources: [...sources.values()], offers, period };
}

function categoryItems(snapshot: AcquisitionSnapshot, category: string) {
  return sortGemItems(snapshot.catalog.items).filter((item) => category === 'all' || item.categoryIds.includes(category));
}
const matches = (value: string, query: string) => value.toLocaleLowerCase().includes(query);

export function acquisitionResources(snapshot: AcquisitionSnapshot, category = 'all', search = ''): ResourceCardData[] {
  const query = search.trim().toLocaleLowerCase();
  const sourceMap = new Map(snapshot.sources.map((source) => [source.id, source]));
  return categoryItems(snapshot, category).map((item) => ({
    item,
    offers: snapshot.offers.filter((offer) => offer.itemId === item.id).map((offer) => ({ source: sourceMap.get(offer.sourceId)!, amount: offer.amount }))
      .filter((offer) => !query || matches(item.name, query) || matches(offer.source.name, query))
      .sort((a, b) => a.source.name.localeCompare(b.source.name, 'zh-CN')),
  })).filter((card) => card.offers.length > 0);
}

export function acquisitionSources(snapshot: AcquisitionSnapshot, category = 'all', search = ''): SourceCardData[] {
  const query = search.trim().toLocaleLowerCase();
  const items = categoryItems(snapshot, category);
  return [...snapshot.sources].sort((a, b) => a.name.localeCompare(b.name, 'zh-CN')).map((source) => ({
    source,
    offers: items.flatMap((item) => {
      if (query && !matches(source.name, query) && !matches(item.name, query)) return [];
      const offer = snapshot.offers.find((entry) => entry.sourceId === source.id && entry.itemId === item.id);
      return offer ? [{ item, amount: offer.amount }] : [];
    }),
  })).filter((card) => card.offers.length > 0);
}

export async function fetchAcquisitionSnapshot(signal?: AbortSignal): Promise<AcquisitionSnapshot> {
  const base = getApiBase().replace(/\/+$/, '');
  const read = async (path: string): Promise<unknown> => {
    const response = await fetch(`${base}${path}`, { cache: 'no-store', credentials: 'omit', signal });
    if (!response.ok) throw new Error('资源获取读取失败，请重试');
    return response.json();
  };
  const [catalog, sources, records] = await Promise.all([fetchGemCatalog(signal), read('/sources'), read('/yields')]);
  return parseAcquisitionSnapshot(catalog, sources, records);
}
