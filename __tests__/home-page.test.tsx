import { describe, test, expect, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import HomePageClient from '../components/HomePageClient';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

describe('HomePageClient component', () => {
  const mockCategoriesData = [
    { key: 'AGENT' as const, count: 24, sampleIcons: [] },
    { key: 'COLLECTIBLE' as const, count: 77, sampleIcons: [] },
    { key: 'EQUIPMENT' as const, count: 19, sampleIcons: [] },
    { key: 'PET' as const, count: 18, sampleIcons: [] },
    { key: 'TECH_PART' as const, count: 10, sampleIcons: [] },
    { key: 'MOUNT' as const, count: 5, sampleIcons: [] },
    { key: 'MECHANIC' as const, count: 85, sampleIcons: [] },
    { key: 'BUFF' as const, count: 10, sampleIcons: [] },
    { key: 'DAMAGE_STAT' as const, count: 4, sampleIcons: [] },
  ];

  test('renders home tools and expandable game resources', async () => {
    render(<HomePageClient categoriesData={mockCategoriesData} />);

    await waitFor(() => expect(screen.getByRole('link', { name: '攻略' })).toBeInTheDocument());
    // 1. Verify 弹壳工具 and 图鉴分类 zone headings
    expect(screen.getByText('弹壳工具')).toBeInTheDocument();
    expect(screen.getByText('游戏资料')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '攻略' })).toHaveAttribute('href', '/strategies');

    // 2. Verify 深度攻略 is removed from home page
    expect(screen.queryByRole('heading', { name: '深度攻略' })).not.toBeInTheDocument();

    // 3. Verify standalone 词条速查 section heading is removed
    expect(screen.queryByRole('heading', { name: '词条速查' })).not.toBeInTheDocument();

    // 4. Verify the removed 伤害词条 panel no longer appears on the homepage
    expect(screen.queryByText('伤害词条')).not.toBeInTheDocument();
    expect(screen.queryByText('4 大核心')).not.toBeInTheDocument();
    expect(screen.queryByText('24 条')).not.toBeInTheDocument();

    // 5. Verify no strategy search input on home page
    const searchInputs = screen.queryAllByPlaceholderText(/搜索/);
    expect(searchInputs.length).toBe(0);

    // 6. Verify each category links to its standalone page
    const agentLinks = screen.getAllByRole('link', { name: /特工/i });
    const hasAgentStandaloneHref = agentLinks.some((l) => l.getAttribute('href') === '/items/agent');
    expect(hasAgentStandaloneHref).toBe(true);

    // 7. Verify battle Buff links go to the standalone page
    fireEvent.click(screen.getByRole('button', { name: /展开全部分类/ }));
    const buffLink = screen.getByRole('link', { name: /战斗Buff/i });
    expect(buffLink.getAttribute('href')).toBe('/items/buff');

    // 8. Verify 4 ordered tools: 潮汐秘境, 并列发车, 高价卖菜, 伤害计算器
    const cxmjLink = screen.getByRole('link', { name: '潮汐秘境' });
    expect(cxmjLink.getAttribute('href')).toBe('https://dankecxmj.guaguahub.cn/');
    expect(screen.getByRole('link', { name: '并列发车' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '高价卖菜' })).toBeInTheDocument();
    const calcLink = screen.getByRole('link', { name: '伤害计算器' });
    expect(calcLink.getAttribute('href')).toBe('/damage-calculator');
    expect(screen.queryByRole('link', { name: '养成模拟' })).not.toBeInTheDocument();
  });
});
