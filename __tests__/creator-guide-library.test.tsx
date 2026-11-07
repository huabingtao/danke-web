import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import CreatorGuideLibrary, { legacyGuideTarget } from '../components/CreatorGuideLibrary';
const articles = [
  { id: 'a', slug: 'alpha', title: 'Alpha ' + '长标题'.repeat(30), summary: '摘要内容', categoryId: 'agents', categoryLabel: '特工', tags: ['养成'], coverUrl: '/cover.png', updatedAt: '2026-10-01' },
  { id: 'b', slug: 'beta', title: 'Beta', summary: '', categoryId: 'pets', categoryLabel: '宠物', tags: ['核心'], coverUrl: null, updatedAt: '2026-11-01' },
  { id: 'c', slug: 'gamma', title: 'Gamma', summary: '推荐内容', categoryId: 'agents', categoryLabel: '特工', tags: ['核心'], coverUrl: null, updatedAt: '2026-11-01' },
];
const rows = () => within(screen.getByRole('list', { name: '攻略列表' })).getAllByRole('link');
beforeEach(() => window.history.replaceState({}, '', '/guides/'));
afterEach(cleanup);
describe('compact guide library', () => {
  it('sorts by date with stable title ties and renders text-only rows without empty image space', () => {
    render(<CreatorGuideLibrary articles={articles} />);
    expect(rows().map(r => r.getAttribute('href'))).toEqual(['/guides/beta', '/guides/gamma', '/guides/alpha']);
    expect(rows()[0].querySelector('img')).toBeNull();
    expect(rows()[0].querySelector('p')).toBeNull();
    expect(screen.getByRole('status')).toHaveTextContent('3 篇攻略');
    expect(screen.getByText(articles[0].title)).toHaveClass('line-clamp-2');
  });
  it('removes a failed image without removing the article', () => {
    render(<CreatorGuideLibrary articles={articles} />);
    fireEvent.error(document.querySelector('img')!);
    expect(document.querySelector('img')).toBeNull();
    expect(rows()).toHaveLength(3);
  });
  it('combines tag search, category and sort and keeps them in the URL', () => {
    render(<CreatorGuideLibrary articles={articles} />);
    fireEvent.change(screen.getByRole('searchbox', { name: '搜索攻略' }), { target: { value: '核心' } });
    fireEvent.change(screen.getByLabelText('攻略分类'), { target: { value: 'agents' } });
    fireEvent.change(screen.getByLabelText('攻略排序'), { target: { value: 'title' } });
    expect(rows()).toHaveLength(1); expect(rows()[0]).toHaveTextContent('Gamma');
    const p = new URLSearchParams(window.location.search);
    expect(p.get('q')).toBe('核心'); expect(p.get('category')).toBe('agents'); expect(p.get('sort')).toBe('title');
  });
  it('restores initial URL conditions and responds to back/forward popstate', () => {
    window.history.replaceState({}, '', '/guides/?q=核心&category=pets&sort=title');
    render(<CreatorGuideLibrary articles={articles} />);
    expect(rows()[0]).toHaveTextContent('Beta');
    expect(screen.getByLabelText('攻略排序')).toHaveValue('title');
    act(() => { window.history.replaceState({}, '', '/guides/?category=agents'); window.dispatchEvent(new PopStateEvent('popstate')); });
    expect(rows()).toHaveLength(2); expect(screen.getByLabelText('搜索攻略')).toHaveValue('');
  });
  it('clears filters from empty results while preserving unrelated URL state', () => {
    window.history.replaceState({}, '', '/guides/?q=missing&category=agents&sort=title&from=home');
    render(<CreatorGuideLibrary articles={articles} />);
    expect(screen.getByText('没有找到相关攻略')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '清除筛选' }));
    expect(rows()).toHaveLength(3); expect(window.location.search).toBe('?from=home');
  });
  it('supports title ordering and rejects unknown legacy slugs', () => {
    render(<CreatorGuideLibrary articles={articles} />);
    fireEvent.change(screen.getByLabelText('攻略排序'), { target: { value: 'title' } });
    expect(rows()[0]).toHaveTextContent('Alpha');
    expect(legacyGuideTarget('?slug=alpha', articles)).toBe('/guides/alpha/');
    expect(legacyGuideTarget('?slug=unknown', articles)).toBeNull();
  });
});
