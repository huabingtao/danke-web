import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import ResourceAcquisitionPage from '../app/yields/page';
import { fetchAcquisitionSnapshot } from '../lib/resource-acquisition';
import { snapshot } from './fixtures/acquisition';

vi.mock('next/navigation', () => ({ usePathname: () => '/yields' }));
vi.mock('../lib/resource-acquisition', async (importOriginal) => ({ ...await importOriginal<typeof import('../lib/resource-acquisition')>(), fetchAcquisitionSnapshot: vi.fn() }));
const load = vi.mocked(fetchAcquisitionSnapshot);
const originalWidth = window.innerWidth;
function resize(width: number) {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
  fireEvent(window, new Event('resize'));
}
afterEach(() => resize(originalWidth));
beforeEach(() => { load.mockReset(); load.mockResolvedValue(snapshot()); });

test('defaults to resource cards, preserves quantities and expands sources inline without another request', async () => {
  render(<ResourceAcquisitionPage />);
  expect(screen.getByRole('status', { name: '正在加载资源获取数据' })).toBeInTheDocument();
  const card = await screen.findByRole('article', { name: '自选核心箱' });
  expect(screen.getByRole('heading', { level: 1, name: '资源获取' })).toBeInTheDocument();
  expect(screen.getAllByRole('link', { name: '返回首页' })).toHaveLength(1);
  expect(within(card).getByText('已录入 5 个获取途径')).toBeInTheDocument();
  expect(within(card).getAllByRole('listitem')).toHaveLength(3);
  expect(within(card).getByLabelText('当前资源合计')).toHaveTextContent('14.6');
  fireEvent.click(within(card).getByRole('button', { name: '展开全部途径（5）' }));
  expect(within(card).getAllByRole('listitem')).toHaveLength(5);
  expect(within(card).getByLabelText('当前资源合计')).toHaveTextContent('14.6');
  expect(within(card).getByText('0.6')).toBeInTheDocument();
  expect(within(card).queryByText('9,999')).not.toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /查看钻石价值/ })).not.toBeInTheDocument();
  fireEvent.click(within(card).getByRole('button', { name: '收起途径' }));
  expect(within(card).getAllByRole('listitem')).toHaveLength(3);
  expect(within(card).getByLabelText('当前资源合计')).toHaveTextContent('14.6');
  expect(screen.queryByRole('article', { name: '零产出道具' })).not.toBeInTheDocument();
  expect(screen.queryByRole('article', { name: '尚无来源' })).not.toBeInTheDocument();
  expect(screen.queryByText(/后台内部/)).not.toBeInTheDocument();
  expect(load).toHaveBeenCalledTimes(1);
});

test('resource totals include hidden matches, follow source searches and categories, and never mix different rewards', async () => {
  render(<ResourceAcquisitionPage />);
  let card = await screen.findByRole('article', { name: '自选核心箱' });
  expect(within(card).getByLabelText('当前资源合计')).toHaveTextContent('14.6');
  fireEvent.click(screen.getByRole('button', { name: '配件' }));
  card = screen.getByRole('article', { name: '自选核心箱' });
  expect(within(card).getByLabelText('当前资源合计')).toHaveTextContent('14.6');
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: '来源甲' } });
  card = screen.getByRole('article', { name: '自选核心箱' });
  expect(within(card).getByLabelText('当前资源合计')).toHaveTextContent('0.6');
  expect(within(screen.getByRole('article', { name: '谐振芯片' })).getByLabelText('当前资源合计')).toHaveTextContent('10');
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: '自选核心箱' } });
  expect(within(screen.getByRole('article', { name: '自选核心箱' })).getByLabelText('当前资源合计')).toHaveTextContent('14.6');
  fireEvent.click(screen.getByRole('button', { name: '按玩法查' }));
  expect(screen.queryByLabelText('当前资源合计')).not.toBeInTheDocument();
  expect(load).toHaveBeenCalledTimes(1);
});

test('category, search and view switching operate on the same loaded data; source cards expand rewards', async () => {
  render(<ResourceAcquisitionPage />);
  await screen.findByRole('article', { name: '自选核心箱' });
  fireEvent.click(screen.getByRole('button', { name: '按玩法查' }));
  const source = screen.getByRole('article', { name: '来源甲' });
  expect(within(source).getByText('已录入 4 种资源')).toBeInTheDocument();
  expect(within(source).getAllByRole('listitem')).toHaveLength(3);
  fireEvent.click(within(source).getByRole('button', { name: '展开全部奖励（4）' }));
  expect(within(source).getAllByRole('listitem')).toHaveLength(4);
  fireEvent.click(screen.getByRole('button', { name: '钥匙' }));
  expect(screen.getAllByRole('article')).toHaveLength(1);
  expect(screen.getByRole('article')).toHaveTextContent('配件钥匙');
  expect(screen.getByRole('article')).not.toHaveTextContent('自选核心箱');
  fireEvent.click(screen.getByRole('button', { name: '全部' }));
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: '芯片' } });
  expect(screen.getAllByRole('article')).toHaveLength(1);
  expect(screen.getByRole('article')).toHaveTextContent('谐振芯片');
  fireEvent.click(screen.getByRole('button', { name: '按资源查' }));
  expect(screen.getAllByRole('article')).toHaveLength(1);
  expect(screen.getByRole('article')).toHaveAccessibleName('谐振芯片');
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: '没有匹配' } });
  expect(screen.getByRole('status')).toHaveTextContent('没有符合条件');
  fireEvent.click(screen.getByRole('button', { name: '清除筛选' }));
  expect(screen.getAllByRole('article')).toHaveLength(4);
  expect(load).toHaveBeenCalledTimes(1);
});

test('failed reads retry honestly, empty data stays empty and late responses are aborted on unmount', async () => {
  load.mockRejectedValueOnce(new Error('offline'));
  const page = render(<ResourceAcquisitionPage />);
  expect(await screen.findByRole('alert')).toHaveTextContent('暂时无法加载资源获取数据');
  load.mockResolvedValueOnce({ ...snapshot(), offers: [] });
  fireEvent.click(screen.getByRole('button', { name: '重新加载' }));
  expect(await screen.findByText('暂无已录入的资源获取数据')).toBeInTheDocument();
  expect(screen.getByRole('status')).toHaveTextContent('暂无已录入的资源获取数据');
  expect(screen.queryByRole('article')).not.toBeInTheDocument();
  page.unmount();
  expect(load.mock.calls[1][0]?.aborted).toBe(true);
});

test('resource and source expansion survive responsive regrouping and filtering without reloading data', async () => {
  resize(1440);
  render(<ResourceAcquisitionPage />);
  let core = await screen.findByRole('article', { name: '自选核心箱' });
  const region = screen.getByRole('region', { name: '资源获取列表' });
  const columns = Array.from(region.children);
  fireEvent.click(within(core).getByRole('button', { name: '展开全部途径（5）' }));
  expect(Array.from(region.children)).toEqual(columns);
  for (const width of [320, 375, 640, 768, 1279, 1280, 1440]) {
    resize(width);
    core = screen.getByRole('article', { name: '自选核心箱' });
    expect(within(core).getAllByRole('listitem')).toHaveLength(5);
    expect(within(core).getByRole('button', { name: '收起途径' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('article')).toHaveLength(4);
  }
  fireEvent.click(screen.getByRole('button', { name: '按玩法查' }));
  let source = screen.getByRole('article', { name: '来源甲' });
  fireEvent.click(within(source).getByRole('button', { name: '展开全部奖励（4）' }));
  resize(375);
  source = screen.getByRole('article', { name: '来源甲' });
  expect(within(source).getAllByRole('listitem')).toHaveLength(4);
  expect(screen.queryByRole('link', { name: /查看钻石价值/ })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '按资源查' }));
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: '芯片' } });
  expect(screen.queryByRole('article', { name: '自选核心箱' })).not.toBeInTheDocument();
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: '' } });
  core = screen.getByRole('article', { name: '自选核心箱' });
  expect(within(core).getAllByRole('listitem')).toHaveLength(5);
  fireEvent.click(screen.getByRole('button', { name: '按玩法查' }));
  expect(within(screen.getByRole('article', { name: '来源甲' })).getByRole('button', { name: '收起奖励' })).toHaveAttribute('aria-expanded', 'true');
  expect(load).toHaveBeenCalledTimes(1);
});
