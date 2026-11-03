import { afterEach, expect, test, vi } from 'vitest';
import { coreImageUrl, fetchGemCatalog, formatGemValue, gemGroups, parseGemCatalog } from '../lib/gem-values';

const dictionary = { categories: [
  { id: 'agent', name: '特工', sortOrder: 1, icon: '/uploads/agent.png' },
  { id: 'core', name: '核心', sortOrder: 0, icon: '/uploads/core.png' },
] };
const valued = (id: string, name: string, value: number, categoryIds = ['core']) => ({ id, name, categoryIds, gemValuation: { prices: [{ id: 'default', label: '默认单价', value }] } });
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

test('projects display fields only, resolves Core icons, retains Chinese names and deduplicates by ID', () => {
  const input = { ...valued('a', '特工核心', 15200, ['core', 'agent']), icon: '/uploads/a.png', stats: { private: 'not-needed' } };
  const catalog = parseGemCatalog(dictionary, [input, input, { id: 'b', name: '待定价道具', categoryIds: [] }], 'http://localhost:3001');
  expect(catalog.categories.map((category) => category.id)).toEqual(['core', 'agent']);
  expect(catalog.items).toHaveLength(2);
  expect(catalog.items[0]).toEqual({ id: 'a', name: '特工核心', icon: 'http://localhost:3001/uploads/a.png', categoryIds: ['core', 'agent'], prices: [{ id: 'default', label: '单价', value: 15200 }] });
  expect(catalog.items[1].prices).toEqual([]);
  expect(gemGroups(catalog).map((group) => [group.id, group.items.length])).toEqual([['core', 1], ['agent', 1], ['__unclassified__', 1]]);
  expect(gemGroups(catalog, 'agent').map((group) => group.id)).toEqual(['agent']);
});

test('sorts by real price, including zero, default-plan precedence, multi-plan maximum and unconfigured last', () => {
  const data = [
    valued('free', '零价', 0),
    { id: 'missing', name: '无价格', categoryIds: ['core'] },
    valued('cheap', '小数价', 0.02),
    { id: 'multi', name: '多方案', categoryIds: ['core'], gemValuation: { prices: [{ id: 'pre', label: '协同前', value: 0.12 }, { id: 'post', label: '协同后', value: 0.02 }] } },
    { ...valued('default', '默认优先', 0.05), gemValuation: { prices: [{ id: 'default', value: 0.05 }, { id: 'other', value: 100 }] } },
  ];
  const catalog = parseGemCatalog(dictionary, data, 'http://localhost:3001');
  expect(gemGroups(catalog, 'core')[0].items.map((item) => item.id)).toEqual(['multi', 'default', 'cheap', 'free', 'missing']);
  expect(catalog.items.find((item) => item.id === 'multi')?.prices.map((price) => price.label)).toEqual(['协同前', '协同后']);
  expect(formatGemValue(17200)).toBe('17,200');
  expect(formatGemValue(0.0000123456789)).toBe('0.0000123456789');
});

test('empty is valid, malformed payload is an error, invalid prices and unsafe icon schemes are excluded', () => {
  expect(parseGemCatalog({ categories: [] }, [], 'http://localhost:3001')).toEqual({ categories: [], items: [] });
  expect(() => parseGemCatalog(null, [], 'http://localhost:3001')).toThrow(/格式异常/);
  expect(() => parseGemCatalog(dictionary, { error: true }, 'http://localhost:3001')).toThrow(/格式异常/);
  expect(() => parseGemCatalog(dictionary, [{ name: '缺少ID' }], 'http://localhost:3001')).toThrow(/格式异常/);
  const invalid = valued('a', '异常价格', -2);
  invalid.gemValuation.prices.push({ id: 'bad', label: '异常', value: Infinity });
  expect(parseGemCatalog(dictionary, [invalid], 'http://localhost:3001').items[0].prices).toEqual([]);
  expect(coreImageUrl('javascript:alert(1)', 'http://localhost:3001')).toBeNull();
  expect(coreImageUrl(null, 'http://localhost:3001')).toBeNull();
});

test('reads the current Core anonymously without caching, propagates abort and HTTP errors, and does not fall back', async () => {
  vi.stubEnv('NEXT_PUBLIC_CORE_API_URL', 'https://core.example.test/');
  const controller = new AbortController();
  const request = vi.fn(async (url: string) => ({ ok: true, json: async () => url.endsWith('/items') ? [valued('a', '实时道具', 100)] : dictionary }));
  vi.stubGlobal('fetch', request);
  expect((await fetchGemCatalog(controller.signal)).items[0].prices[0].value).toBe(100);
  expect(request.mock.calls.map(([url]) => url)).toEqual(['https://core.example.test/item-classifications', 'https://core.example.test/items']);
  expect(request).toHaveBeenCalledWith(expect.any(String), { cache: 'no-store', credentials: 'omit', signal: controller.signal });
  request.mockResolvedValue({ ok: false, json: async () => [] });
  await expect(fetchGemCatalog()).rejects.toThrow(/无法读取/);
  request.mockRejectedValue(new DOMException('aborted', 'AbortError'));
  await expect(fetchGemCatalog()).rejects.toMatchObject({ name: 'AbortError' });
});
