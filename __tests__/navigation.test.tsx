import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Navbar from '../components/Navbar';

// Mock next/navigation hooks
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Navbar component', () => {
  test('renders navigation links correctly', () => {
    render(<Navbar />);

    // Verify Brand Logo Title is rendered
    const logoLink = screen.getByText('弹壳呱呱 · 战术中心');
    expect(logoLink).toBeInTheDocument();
    expect(logoLink.getAttribute('href')).toBe('/');

    // Verify all 5 navigation links are rendered (both desktop and mobile menus)
    const links = ['首页', '月度产出', '物品百科', '活动时间轴', '伤害计算器'];
    links.forEach((linkText) => {
      const elements = screen.getAllByText(linkText);
      expect(elements.length).toBeGreaterThan(0);
    });
  });
});
