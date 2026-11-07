import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ToolZone from '../components/home/ToolZone';
import WikiCategoryZone from '../components/home/WikiCategoryZone';
import { HOME_TOOLS } from '../lib/home-config';
import { HOME_TOOL_ORDER_KEY } from '../lib/home-tool-order';

const defaultIds = HOME_TOOLS.filter((tool) => !tool.hidden).map((tool) => tool.id);
const originalHitTest = Object.getOwnPropertyDescriptor(document, 'elementFromPoint');
const hitTest = vi.fn();
class Pointer extends MouseEvent {
  pointerId: number; pointerType: string; isPrimary: boolean;
  constructor(type: string, init: MouseEventInit & { pointerId?: number; pointerType?: string; isPrimary?: boolean } = {}) {
    super(type, init); this.pointerId = init.pointerId ?? 1; this.pointerType = init.pointerType ?? 'mouse'; this.isPrimary = init.isPrimary ?? true;
  }
}
beforeEach(() => {
  localStorage.clear(); sessionStorage.clear(); hitTest.mockReset();
  vi.stubGlobal('PointerEvent', Pointer);
  Object.defineProperty(document, 'elementFromPoint', { configurable: true, value: hitTest });
});
afterEach(() => {
  vi.restoreAllMocks(); vi.unstubAllGlobals();
  if (originalHitTest) Object.defineProperty(document, 'elementFromPoint', originalHitTest);
  else Reflect.deleteProperty(document, 'elementFromPoint');
});
const ids = () => Array.from(screen.getByLabelText('首页工具卡片').children).map((node) => (node as HTMLElement).dataset.homeToolId);
const card = (id: string) => screen.getByLabelText('首页工具卡片').querySelector(`[data-home-tool-id="${id}"]`)!;
function edit() { fireEvent.click(screen.getByRole('button', { name: '调整顺序' })); }

for (const pointerType of ['mouse', 'touch']) {
  test(`${pointerType} handle drag persists order across remount and reset restores defaults`, async () => {
    const page = render(<ToolZone />);
    edit();
    expect(screen.queryByRole('link', { name: '资源获取' })).not.toBeInTheDocument();
    const handle = screen.getByRole('button', { name: '拖动资源获取调整顺序' });
    hitTest.mockReturnValue(card(defaultIds[0]));
    fireEvent.pointerDown(handle, { pointerType, pointerId: 9, button: 0, clientX: 300, clientY: 300 });
    fireEvent.pointerMove(handle, { pointerType, pointerId: 9, clientX: 150, clientY: 150 });
    expect(card(defaultIds[0])).toHaveAttribute('data-drop-target', 'true');
    fireEvent.pointerUp(handle, { pointerType, pointerId: 9, clientX: 150, clientY: 150 });
    expect(ids()[0]).toBe('yields');
    expect(JSON.parse(localStorage.getItem(HOME_TOOL_ORDER_KEY)!)[0]).toBe('yields');
    fireEvent.click(screen.getByRole('button', { name: '完成排序' }));
    expect(screen.getByRole('link', { name: '资源获取' })).toHaveAttribute('href', '/yields');
    page.unmount(); render(<ToolZone />);
    await waitFor(() => expect(ids()[0]).toBe('yields'));
    edit(); fireEvent.click(screen.getByRole('button', { name: '恢复默认' }));
    expect(ids()).toEqual(defaultIds);
    expect(localStorage.getItem(HOME_TOOL_ORDER_KEY)).toBeNull();
  });
}

test('under-construction cards have no navigable element, while the strategy entry is enabled', () => {
  render(<><ToolZone /><WikiCategoryZone categoriesData={[]} /></>);
  expect(screen.getByRole('link', { name: '攻略' })).toHaveAttribute('href', '/guides');
  for (const name of ['伤害计算器', '活动数据']) {
    const disabled = screen.getByRole('group', { name });
    expect(disabled).toHaveAttribute('aria-disabled', 'true');
    expect(disabled).toHaveAccessibleDescription('建设中，暂不可用');
    expect(disabled.querySelector('a')).toBeNull();
    expect(disabled.closest('a')).toBeNull();
    expect(screen.queryByRole('link', { name })).not.toBeInTheDocument();
    fireEvent.click(disabled); fireEvent.keyDown(disabled, { key: 'Enter' });
  }
  expect(screen.getByRole('link', { name: '资源获取' })).toHaveAttribute('href', '/yields');
  expect(screen.getByRole('link', { name: '潮汐秘境' })).toHaveAttribute('target', '_blank');
  expect(screen.getByRole('link', { name: '特工图鉴' })).toHaveAttribute('href', '/items/agent');
});

test('keyboard sorting works for under-construction cards and remains usable when storage is unavailable', () => {
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
  render(<ToolZone />); edit();
  const handle = screen.getByRole('button', { name: '拖动活动数据调整顺序' });
  const before = ids().indexOf('events');
  fireEvent.keyDown(handle, { key: 'ArrowLeft', altKey: true });
  expect(ids().indexOf('events')).toBe(before - 1);
  expect(screen.getByRole('status')).toHaveTextContent('浏览器未能保存');
  expect(screen.getByRole('group', { name: '活动数据' })).toHaveAttribute('aria-disabled', 'true');
});

test('clicks, cancellations and drops outside the grid never alter or save order', () => {
  render(<ToolZone />); edit();
  const handle = screen.getByRole('button', { name: '拖动资源获取调整顺序' });
  const start = { pointerId: 9, button: 0, clientX: 300, clientY: 300 };
  fireEvent.pointerDown(handle, start); fireEvent.pointerUp(handle, start);
  expect(localStorage.getItem(HOME_TOOL_ORDER_KEY)).toBeNull();
  hitTest.mockReturnValue(card(defaultIds[0]));
  fireEvent.pointerDown(handle, start); fireEvent.pointerMove(handle, { pointerId: 9, clientX: 150, clientY: 150 });
  fireEvent.pointerCancel(handle, { pointerId: 9 }); fireEvent.pointerUp(handle, { pointerId: 9 });
  hitTest.mockReturnValue(document.body);
  fireEvent.pointerDown(handle, start); fireEvent.pointerMove(handle, { pointerId: 9, clientX: 150, clientY: 150 }); fireEvent.pointerUp(handle, { pointerId: 9 });
  expect(ids()).toEqual(defaultIds);
  expect(localStorage.getItem(HOME_TOOL_ORDER_KEY)).toBeNull();
});
