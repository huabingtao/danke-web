import { beforeEach, expect, test, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import GemValuesPage from '../app/gem-values/page';
import { fetchGemCatalog, type GemCatalog } from '../lib/gem-values';

vi.mock('next/navigation', () => ({ usePathname: () => '/gem-values' }));
vi.mock('../lib/gem-values', async (importOriginal) => ({ ...await importOriginal<typeof import('../lib/gem-values')>(), fetchGemCatalog: vi.fn() }));
const load = vi.mocked(fetchGemCatalog);
const catalog: GemCatalog = {
  categories: [{ id: 'core', name: '核心', icon: 'http://localhost:3001/uploads/core.png' }, { id: 'agent', name: '特工', icon: null }],
  items: [
    { id: 'core-box', name: '特工宠物核心自选箱', icon: 'http://localhost:3001/uploads/box.png', categoryIds: ['core', 'agent'], prices: [{ id: 'default', label: '单价', value: 17200 }] },
    { id: 'oil', name: '特工升级精油', icon: null, categoryIds: ['agent'], prices: [{ id: 'before', label: '协同前', value: 0.12 }, { id: 'after', label: '协同后', value: 0.02 }] },
    { id: 'none', name: '未定价材料', icon: null, categoryIds: [], prices: [] },
    { id: 'zero', name: '零价道具', icon: null, categoryIds: ['core'], prices: [{ id: 'default', label: '单价', value: 0 }] },
  ],
};
beforeEach(() => { window.history.replaceState(null, '', '/gem-values'); load.mockReset(); load.mockResolvedValue(catalog); });

test('links from resource cards select the requested value category and unknown categories retain all', async () => {
  window.history.replaceState(null, '', '/gem-values?category=agent');
  const page = render(<GemValuesPage />);
  await screen.findByRole('region', { name: '特工道具价值' });
  expect(screen.getByRole('button', { name: '特工' })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.queryByRole('region', { name: '核心道具价值' })).not.toBeInTheDocument();
  page.unmount();
  window.history.replaceState(null, '', '/gem-values?category=unknown');
  render(<GemValuesPage />);
  await screen.findByRole('region', { name: '核心道具价值' });
  expect(screen.getByRole('button', { name: '全部' })).toHaveAttribute('aria-pressed', 'true');
});

test('shows Chinese sections, prices and multiple plans, keeps one return-home link and supports category switching', async () => {
  render(<GemValuesPage />);
  expect(screen.getByRole('status', { name: '正在加载道具价值' })).toBeInTheDocument();
  const core = await screen.findByRole('region', { name: '核心道具价值' });
  expect(screen.getByRole('heading', { level: 1, name: '道具价值' })).toBeInTheDocument();
  expect(screen.getAllByRole('link', { name: '返回首页' })).toHaveLength(1);
  expect(screen.getByRole('link', { name: '返回首页' })).toHaveAttribute('href', '/');
  expect(within(core).getByText('17,200')).toBeInTheDocument();
  expect(within(core).getByText('0', { exact: true })).toBeInTheDocument();
  expect(screen.getByText('协同前')).toBeInTheDocument();
  expect(screen.getByText('协同后')).toBeInTheDocument();
  expect(screen.getByText('0.02')).toBeInTheDocument();
  expect(screen.getByRole('region', { name: '未分类道具价值' })).toHaveTextContent('未配置');
  expect(screen.getAllByRole('article', { name: '特工宠物核心自选箱' })).toHaveLength(2);
  fireEvent.click(screen.getByRole('button', { name: '特工' }));
  expect(screen.queryByRole('region', { name: '核心道具价值' })).not.toBeInTheDocument();
  expect(screen.queryByRole('region', { name: '未分类道具价值' })).not.toBeInTheDocument();
  expect(screen.getAllByRole('article', { name: '特工宠物核心自选箱' })).toHaveLength(1);
  expect(screen.getByRole('button', { name: '特工' })).toHaveAttribute('aria-pressed', 'true');
  fireEvent.click(screen.getByRole('button', { name: '全部' }));
  expect(screen.getByRole('region', { name: '核心道具价值' })).toBeInTheDocument();
});

test('image errors preserve name and price, and data is fetched again on remount', async () => {
  const first = render(<GemValuesPage />);
  const core = await screen.findByRole('region', { name: '核心道具价值' });
  fireEvent.error(within(core).getByRole('img', { name: '特工宠物核心自选箱' }));
  expect(within(core).getByLabelText('特工宠物核心自选箱图标暂不可用')).toBeInTheDocument();
  expect(within(core).getByRole('article', { name: '特工宠物核心自选箱' })).toHaveTextContent('17,200');
  first.unmount();
  load.mockResolvedValue({ ...catalog, items: [{ ...catalog.items[0], prices: [{ id: 'default', label: '单价', value: 12345.6789 }] }] });
  render(<GemValuesPage />);
  expect((await screen.findAllByText('12,345.6789')).length).toBeGreaterThan(0);
  expect(load).toHaveBeenCalledTimes(2);
});

test('errors provide retry, successful empty responses show an honest empty state', async () => {
  load.mockRejectedValueOnce(new TypeError('Failed to fetch'));
  render(<GemValuesPage />);
  expect(await screen.findByRole('alert')).toHaveTextContent('暂时无法加载道具价值，请检查网络后重试');
  expect(screen.queryByText('Failed to fetch')).not.toBeInTheDocument();
  load.mockResolvedValueOnce({ categories: catalog.categories, items: [] });
  fireEvent.click(screen.getByRole('button', { name: '重新加载' }));
  expect(await screen.findByText('暂无道具价值数据')).toBeInTheDocument();
  expect(screen.queryByRole('article')).not.toBeInTheDocument();
});

test('empty category remains selectable with a clear empty state and unmount aborts pending reads', async () => {
  load.mockResolvedValue({ categories: [...catalog.categories, { id: 'key', name: '钥匙', icon: null }], items: catalog.items });
  const page = render(<GemValuesPage />);
  fireEvent.click(await screen.findByRole('button', { name: '钥匙' }));
  expect(screen.getByRole('region', { name: '钥匙道具价值' })).toHaveTextContent('该分类暂无道具');
  const signal = load.mock.calls[0][0];
  page.unmount();
  expect(signal?.aborted).toBe(true);
});
