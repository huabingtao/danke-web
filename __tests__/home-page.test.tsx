import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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

  test('renders 弹壳工具 and 图鉴分类, verifies 深度攻略 and 词条速查 are removed/merged', () => {
    render(<HomePageClient categoriesData={mockCategoriesData} />);

    // 1. Verify 弹壳工具 and 图鉴分类 zone headings
    expect(screen.getByText('弹壳工具')).toBeInTheDocument();
    expect(screen.getByText('图鉴分类')).toBeInTheDocument();

    // 2. Verify 深度攻略 is removed from home page
    expect(screen.queryByRole('heading', { name: '深度攻略' })).not.toBeInTheDocument();

    // 3. Verify standalone 词条速查 section heading is removed
    expect(screen.queryByRole('heading', { name: '词条速查' })).not.toBeInTheDocument();

    // 4. Verify 伤害词条 is merged as a category inside 图鉴分类 without count badge
    expect(screen.getByText('伤害词条')).toBeInTheDocument();
    expect(screen.queryByText('4 大核心')).not.toBeInTheDocument();
    expect(screen.queryByText('24 条')).not.toBeInTheDocument();

    // 5. Verify no strategy search input on home page
    const searchInputs = screen.queryAllByPlaceholderText(/搜索/);
    expect(searchInputs.length).toBe(0);

    // 6. Verify each category links to its standalone page
    const agentLinks = screen.getAllByRole('link', { name: /特工/i });
    const hasAgentStandaloneHref = agentLinks.some((l) => l.getAttribute('href') === '/items/agent');
    expect(hasAgentStandaloneHref).toBe(true);

    // 7. Verify damage stat and buff links go to their standalone pages
    const damageStatLink = screen.getByRole('link', { name: /伤害词条/i });
    expect(damageStatLink.getAttribute('href')).toBe('/items/damage-stat');
    const buffLink = screen.getByRole('link', { name: /战斗Buff/i });
    expect(buffLink.getAttribute('href')).toBe('/items/buff');

    // 8. Verify 4 ordered tools: 潮汐秘境助手, 并列发车, 高价卖菜, 弹壳伤害计算器
    const cxmjLink = screen.getByRole('link', { name: '潮汐秘境助手' });
    expect(cxmjLink.getAttribute('href')).toBe('https://dankecxmj.guaguahub.cn/');
    expect(screen.getByRole('link', { name: '并列发车' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '高价卖菜' })).toBeInTheDocument();
    const calcLink = screen.getByRole('link', { name: '弹壳伤害计算器' });
    expect(calcLink.getAttribute('href')).toBe('/calculator');
  });
});
