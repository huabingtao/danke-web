import { afterEach, expect, test, vi } from 'vitest';
import { acquisitionResources, acquisitionSources, fetchAcquisitionSnapshot, formatAcquisitionTotal, parseAcquisitionSnapshot } from '../lib/resource-acquisition';
import { catalog, dictionary, rawItems, records, snapshot, sources } from './fixtures/acquisition';

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

test('totals retain recorded decimal precision without floating-point display artifacts or a fixed two-digit cutoff', () => {
  const total = (...amounts: number[]) => formatAcquisitionTotal(amounts.map((amount) => ({ amount })));
  expect(total()).toBe('0');
  expect(total(0.1, 0.2)).toBe('0.3');
  expect(total(0.006, 0.004)).toBe('0.01');
  expect(total(0.0000001, 0.0000002)).toBe('0.0000003');
  expect(total(1000, 2000.125)).toBe('3,000.125');
});

test('selects one complete latest snapshot, drops zero output, does not expose internal notes, and preserves decimals', () => {
  const data = snapshot();
  expect(data.period).toEqual({ year: 2026, month: 10 });
  expect(data.offers).toHaveLength(8);
  expect(data.offers[0].amount).toBe(0.6);
  expect(data.offers.some((offer) => offer.amount === 9999)).toBe(false);
  expect(JSON.stringify(data)).not.toContain('内部');
  expect(acquisitionResources(data).map((card) => card.item.id)).toEqual(['core', 'chip', 'parts', 'key']);
  expect(acquisitionResources(data)[0].offers).toHaveLength(5);
});

test('multi-category IDs occur only once per view and both views filter the same real relationships', () => {
  const data = snapshot();
  expect(acquisitionResources(data, 'core').map((card) => card.item.id)).toEqual(['core', 'chip']);
  expect(acquisitionResources(data, 'tech')).toHaveLength(4);
  expect(acquisitionResources(data, 'key').map((card) => card.item.id)).toEqual(['key']);
  expect(acquisitionSources(data, 'core').find((card) => card.source.id === 's0')?.offers.map((offer) => offer.item.id)).toEqual(['core', 'chip']);
  expect(acquisitionSources(data, 'key')).toHaveLength(1);
  expect(acquisitionSources(data, 'key')[0].offers).toHaveLength(1);
});

test('search matches either end of a relationship without retaining unrelated source rows or rewards', () => {
  const data = snapshot();
  const byItem = acquisitionResources(data, 'all', ' 芯片 ');
  expect(byItem.map((card) => card.item.id)).toEqual(['chip']);
  const bySource = acquisitionResources(data, 'all', '来源甲');
  expect(bySource).toHaveLength(4);
  expect(bySource.every((card) => card.offers.length === 1 && card.offers[0].source.id === 's0')).toBe(true);
  expect(acquisitionSources(data, 'all', '芯片')).toHaveLength(1);
  expect(acquisitionSources(data, 'all', '芯片')[0].offers.map((offer) => offer.item.id)).toEqual(['chip']);
  expect(acquisitionSources(data, 'all', '来源乙')[0].offers).toHaveLength(1);
  expect(acquisitionResources(data, 'core', '钥匙')).toEqual([]);
});

test('duplicate payload records do not double count, while conflicting records and dangling IDs fail clearly', () => {
  expect(parseAcquisitionSnapshot(catalog, sources, [...records, records[0]]).offers).toHaveLength(8);
  expect(() => parseAcquisitionSnapshot(catalog, sources, [...records, { ...records[0], id: 'conflict' }])).toThrow(/重试/);
  expect(() => parseAcquisitionSnapshot(catalog, sources, [...records, { ...records[0], amount: 50 }])).toThrow(/重试/);
  expect(() => parseAcquisitionSnapshot(catalog, sources, [{ ...records[0], itemId: 'deleted' }])).toThrow(/重试/);
  expect(() => parseAcquisitionSnapshot(catalog, sources, [{ ...records[0], sourceId: 'deleted' }])).toThrow(/重试/);
});

test('empty or all-zero latest snapshots never borrow amounts from older snapshots', () => {
  expect(parseAcquisitionSnapshot(catalog, sources, []).period).toBeNull();
  const data = parseAcquisitionSnapshot(catalog, sources, [...records, { ...records[0], id: 'new-zero', amount: 0, month: 11 }]);
  expect(data.period).toEqual({ year: 2026, month: 11 });
  expect(data.offers).toEqual([]);
  expect(acquisitionResources(data)).toEqual([]);
});

test('fetches four anonymous no-cache endpoints with abort support; errors have no local data fallback', async () => {
  vi.stubEnv('NEXT_PUBLIC_CORE_API_URL', 'https://core.example.test');
  const request = vi.fn(async (url: string) => ({ ok: true, json: async () => url.endsWith('/item-classifications') ? dictionary : url.endsWith('/items') ? rawItems : url.endsWith('/sources') ? sources : records }));
  vi.stubGlobal('fetch', request);
  const controller = new AbortController();
  expect((await fetchAcquisitionSnapshot(controller.signal)).offers).toHaveLength(8);
  expect(request).toHaveBeenCalledTimes(4);
  expect(request).toHaveBeenCalledWith('https://core.example.test/yields', { cache: 'no-store', credentials: 'omit', signal: controller.signal });
  request.mockRejectedValue(new Error('offline'));
  await expect(fetchAcquisitionSnapshot()).rejects.toThrow('offline');
});
