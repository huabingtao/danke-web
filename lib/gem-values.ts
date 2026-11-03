import { getApiBase } from './core-api';

export interface GemCategory { id: string; name: string; icon: string | null }
export interface GemPrice { id: string; label: string; value: number }
export interface GemItem { id: string; name: string; icon: string | null; categoryIds: string[]; prices: GemPrice[] }
export interface GemCatalog { categories: GemCategory[]; items: GemItem[] }
export interface GemGroup extends GemCategory { items: GemItem[] }

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function coreImageUrl(value: unknown, apiBase: string): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value, `${apiBase.replace(/\/+$/, '')}/`);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
  } catch { return null; }
}

// Project only public display fields; raw stats and reference metadata stay out of UI state.
export function parseGemCatalog(dictionary: unknown, itemData: unknown, apiBase: string): GemCatalog {
  if (!record(dictionary) || !Array.isArray(dictionary.categories) || !Array.isArray(itemData)) {
    throw new Error('道具价值数据格式异常，请稍后重试');
  }
  const categoryMap = new Map<string, GemCategory>();
  const categories = [...dictionary.categories].sort((a, b) => {
    const order = (value: unknown) => record(value) && typeof value.sortOrder === 'number' ? value.sortOrder : 0;
    return order(a) - order(b);
  });
  for (const entry of categories) {
    if (!record(entry) || typeof entry.id !== 'string' || !entry.id || typeof entry.name !== 'string' || !entry.name.trim()) {
      throw new Error('道具分类数据格式异常，请稍后重试');
    }
    if (!categoryMap.has(entry.id)) categoryMap.set(entry.id, { id: entry.id, name: entry.name, icon: coreImageUrl(entry.icon, apiBase) });
  }
  const itemMap = new Map<string, GemItem>();
  for (const entry of itemData) {
    if (!record(entry) || typeof entry.id !== 'string' || !entry.id || typeof entry.name !== 'string' || !entry.name.trim()) {
      throw new Error('道具数据格式异常，请稍后重试');
    }
    if (itemMap.has(entry.id)) continue;
    const rawPrices = record(entry.gemValuation) && Array.isArray(entry.gemValuation.prices) ? entry.gemValuation.prices : [];
    const prices: GemPrice[] = [];
    for (const price of rawPrices) {
      if (!record(price) || typeof price.id !== 'string' || typeof price.value !== 'number' || !Number.isFinite(price.value) || price.value < 0) continue;
      if (prices.some((existing) => existing.id === price.id)) continue;
      prices.push({ id: price.id, label: price.id === 'default' || price.label === '默认单价' ? '单价' : typeof price.label === 'string' && price.label.trim() ? price.label : '单价', value: price.value });
    }
    itemMap.set(entry.id, {
      id: entry.id, name: entry.name, icon: coreImageUrl(entry.icon, apiBase), prices,
      categoryIds: Array.isArray(entry.categoryIds) ? [...new Set(entry.categoryIds.filter((id): id is string => typeof id === 'string'))] : [],
    });
  }
  return { categories: [...categoryMap.values()], items: [...itemMap.values()] };
}

function unitPrice(item: GemItem): number | null {
  return item.prices.find((price) => price.id === 'default')?.value ?? (item.prices.length ? Math.max(...item.prices.map((price) => price.value)) : null);
}

export function sortGemItems(items: GemItem[]): GemItem[] {
  return [...items].sort((a, b) => {
    const first = unitPrice(a); const second = unitPrice(b);
    if (first === null) return second === null ? a.name.localeCompare(b.name, 'zh-CN') : 1;
    if (second === null) return -1;
    return second - first || a.name.localeCompare(b.name, 'zh-CN');
  });
}

export function gemGroups(catalog: GemCatalog, selectedCategory = 'all'): GemGroup[] {
  const ordered = sortGemItems(catalog.items);
  const groups = catalog.categories.filter((category) => selectedCategory === 'all' || category.id === selectedCategory)
    .map((category) => ({ ...category, items: ordered.filter((item) => item.categoryIds.includes(category.id)) }));
  if (selectedCategory === 'all') {
    const ids = new Set(catalog.categories.map((category) => category.id));
    const unclassified = ordered.filter((item) => !item.categoryIds.some((id) => ids.has(id)));
    if (unclassified.length) groups.push({ id: '__unclassified__', name: '未分类', icon: null, items: unclassified });
  }
  return groups;
}

export const formatGemValue = (value: number) => value.toLocaleString('zh-CN', { maximumFractionDigits: 20 });

export async function fetchGemCatalog(signal?: AbortSignal): Promise<GemCatalog> {
  const base = getApiBase().replace(/\/+$/, '');
  const [categories, items] = await Promise.all(['/item-classifications', '/items'].map(async (path) => {
    const response = await fetch(`${base}${path}`, { cache: 'no-store', credentials: 'omit', signal });
    if (!response.ok) throw new Error('暂时无法读取道具价值，请稍后重试');
    return response.json() as Promise<unknown>;
  }));
  return parseGemCatalog(categories, items, base);
}
