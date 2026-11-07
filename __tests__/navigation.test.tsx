import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Navbar from '../components/Navbar';
import TopNavBar from '../components/TopNavBar';
import MobileTabBar from '../components/MobileTabBar';

// Mock next/navigation hooks
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Navigation components', () => {
  test('Navbar renders legacy navigation links correctly', () => {
    render(<Navbar />);

    const logoLink = screen.getByText('弹壳呱呱 · 战术中心');
    expect(logoLink).toBeInTheDocument();
    expect(logoLink.getAttribute('href')).toBe('/');

    const links = ['首页', '月度产出', '物品百科', '活动时间轴', '伤害计算器'];
    links.forEach((linkText) => {
      const elements = screen.getAllByText(linkText);
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  test('TopNavBar groups navigation by home sections', () => {
    render(<TopNavBar width="wide" />);

    expect(screen.getByText('弹壳攻略站')).toBeInTheDocument();
    expect(screen.getAllByText('首页').length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: '攻略' })).toHaveAttribute('href', '/guides');
    expect(screen.getByRole('link', { name: '游戏资料' })).toHaveAttribute('href', '/#zone-wiki');
    expect(screen.getByRole('link', { name: '弹壳工具' })).toHaveAttribute('href', '/#zone-tools');
    expect(screen.getByRole('link', { name: '关于' })).toHaveAttribute('href', '/about');
  });

  test('MobileTabBar renders 4 core mobile tabs', () => {
    render(<MobileTabBar />);

    expect(screen.getByText('首页')).toBeInTheDocument();
    expect(screen.getByText('攻略库')).toBeInTheDocument();
    expect(screen.getByText('图鉴')).toBeInTheDocument();
    expect(screen.getByText('工具')).toBeInTheDocument();
  });
});
