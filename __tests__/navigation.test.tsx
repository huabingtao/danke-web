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

  test('TopNavBar renders 首页, 攻略库, 战术图鉴, 物品图鉴, 养成消耗表', () => {
    render(<TopNavBar width="wide" />);

    expect(screen.getByText('弹壳特攻队 Wiki & 攻略站')).toBeInTheDocument();
    expect(screen.getAllByText('首页').length).toBeGreaterThan(0);
    expect(screen.getAllByText('攻略库').length).toBeGreaterThan(0);
    expect(screen.getAllByText('战术图鉴').length).toBeGreaterThan(0);
    expect(screen.getAllByText('物品图鉴').length).toBeGreaterThan(0);
    expect(screen.getAllByText('养成消耗表').length).toBeGreaterThan(0);
  });

  test('MobileTabBar renders 4 core mobile tabs', () => {
    render(<MobileTabBar />);

    expect(screen.getByText('首页')).toBeInTheDocument();
    expect(screen.getByText('攻略库')).toBeInTheDocument();
    expect(screen.getByText('图鉴')).toBeInTheDocument();
    expect(screen.getByText('工具')).toBeInTheDocument();
  });
});
