import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import HomePageClient from '../components/HomePageClient';
import WikiCategoryZone from '../components/home/WikiCategoryZone';
afterEach(() => { sessionStorage.clear(); vi.restoreAllMocks(); });
describe('home view restoration', () => {
  it('keeps expanded categories after leaving and mounting again', () => {
    const first = render(<WikiCategoryZone categoriesData={[]} />);
    expect(screen.queryByRole('link', { name: '战斗Buff图鉴' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /展开全部分类/ }));
    expect(sessionStorage.getItem('home-categories-expanded')).toBe('true');
    first.unmount();
    render(<WikiCategoryZone categoriesData={[]} />);
    expect(screen.getByRole('link', { name: '战斗Buff图鉴' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '收起分类' })).toHaveAttribute('aria-expanded', 'true');
  });
  it('restores saved scroll after restoring the expanded layout', async () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    sessionStorage.setItem('home-categories-expanded', 'true');
    sessionStorage.setItem('home-scroll-y', '321');
    render(<HomePageClient categoriesData={[]} />);
    await waitFor(() => expect(scrollTo).toHaveBeenCalledWith(0, 321));
    expect(screen.getByRole('button', { name: '收起分类' })).toBeInTheDocument();
  });
});
