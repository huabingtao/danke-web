import { parseGemCatalog } from '../../lib/gem-values';
import { parseAcquisitionSnapshot } from '../../lib/resource-acquisition';

export const dictionary = { categories: [
  { id: 'core', name: '核心', sortOrder: 0, icon: '/uploads/core.png' },
  { id: 'tech', name: '配件', sortOrder: 1, icon: '/uploads/drone.png' },
  { id: 'key', name: '钥匙', sortOrder: 2, icon: '/uploads/key.png' },
] };
export const rawItems = [
  { id: 'core', name: '自选核心箱', categoryIds: ['core', 'tech'], icon: '/uploads/box.png', gemValuation: { prices: [{ id: 'default', label: '单价', value: 17200 }] } },
  { id: 'chip', name: '谐振芯片', categoryIds: ['core', 'tech'], icon: '/uploads/chip.png', gemValuation: { prices: [{ id: 'default', label: '单价', value: 16300 }] } },
  { id: 'key', name: '配件钥匙', categoryIds: ['key', 'tech'], icon: null },
  { id: 'parts', name: '杰出配件', categoryIds: ['tech'], icon: null },
  { id: 'zero', name: '零产出道具', categoryIds: ['tech'], icon: null },
  { id: 'unused', name: '尚无来源', categoryIds: ['core'], icon: null },
];
export const sources = ['甲', '乙', '丙', '丁', '戊'].map((name, index) => ({ id: `s${index}`, name: `来源${name}`, type: 'DAILY', description: '后台内部录入口述尚未核实' }));
export const records = [
  ...sources.map((source, index) => ({ id: `core-${index}`, itemId: 'core', sourceId: source.id, amount: index === 0 ? 0.6 : index + 1, year: 2026, month: 10, notes: '内部备注不应展示' })),
  ...['chip', 'key', 'parts'].map((itemId, index) => ({ id: itemId, itemId, sourceId: 's0', amount: index + 10, year: 2026, month: 10, notes: null })),
  { id: 'zero', itemId: 'zero', sourceId: 's0', amount: 0, year: 2026, month: 10, notes: null },
  { id: 'old', itemId: 'core', sourceId: 's0', amount: 9999, year: 2026, month: 9, notes: null },
];
export const catalog = parseGemCatalog(dictionary, rawItems, 'http://localhost:3001');
export const snapshot = () => parseAcquisitionSnapshot(catalog, sources, records);
