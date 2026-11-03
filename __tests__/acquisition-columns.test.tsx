import { afterEach, expect, test } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import AcquisitionColumns, { acquisitionColumnCount } from '../components/AcquisitionColumns';

const originalWidth = window.innerWidth;
function resize(width: number) {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
  fireEvent(window, new Event('resize'));
}
afterEach(() => resize(originalWidth));

test('uses exact mobile, tablet and desktop breakpoint boundaries', () => {
  expect([320, 375, 639, 640, 768, 1279, 1280, 1600].map(acquisitionColumnCount)).toEqual([1, 1, 1, 2, 2, 2, 3, 3]);
});

test('round-robin columns stay independent and resizing never duplicates or drops a card', () => {
  resize(1440);
  const names = ['甲', '乙', '丙', '丁', '戊', '己'];
  render(<AcquisitionColumns label="测试卡片">{names.map((name) => <article key={name} aria-label={name}>{name}</article>)}</AcquisitionColumns>);
  const region = screen.getByRole('region', { name: '测试卡片' });
  const groups = () => Array.from(region.children).map((column) => within(column as HTMLElement).getAllByRole('article').map((card) => card.textContent));
  expect(region).toHaveAttribute('data-columns', '3');
  expect(groups()).toEqual([['甲', '丁'], ['乙', '戊'], ['丙', '己']]);
  expect(region).toHaveClass('gap-4');
  for (const column of Array.from(region.children)) expect(column).toHaveClass('flex-col', 'gap-4');
  resize(768);
  expect(groups()).toEqual([['甲', '丙', '戊'], ['乙', '丁', '己']]);
  resize(375);
  expect(groups()).toEqual([names]);
  resize(1440);
  expect(groups()).toEqual([['甲', '丁'], ['乙', '戊'], ['丙', '己']]);
  expect(screen.getAllByRole('article')).toHaveLength(6);
});
