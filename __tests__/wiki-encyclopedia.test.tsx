import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WikiEncyclopediaClient from '../components/WikiEncyclopediaClient';
import {
  LOCAL_WIKI_ENTRIES,
  LOCAL_HANDBOOK_GUIDES,
} from '../lib/local-wiki-data';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/items',
}));

describe('WikiEncyclopediaClient', () => {
  test('renders handbook series, categories, and filters collectibles by crit rate', () => {
    render(
      <WikiEncyclopediaClient
        initialEntries={LOCAL_WIKI_ENTRIES}
        handbookGuides={LOCAL_HANDBOOK_GUIDES}
      />,
    );

    // 1. Verify From Beginner to Master (从入门到入土) section
    expect(screen.getByText('从入门到入土 · 特工篇')).toBeInTheDocument();
    expect(screen.getByText('从入门到入土 · 装备篇')).toBeInTheDocument();

    // 2. Switch to Collectibles (收藏品) category
    const collectibleTab = screen.getByRole('button', { name: /收藏品/ });
    fireEvent.click(collectibleTab);

    // 3. Click "红3暴击率" filter tag
    const critRateFilter = screen.getByRole('button', { name: /红3暴击率/ });
    fireEvent.click(critRateFilter);

    // Verify 幸运护身符 (Ep2 Crit Rate Gold Collectible) is displayed
    expect(screen.getByText('幸运护身符')).toBeInTheDocument();

    // 4. Click card to open detail drawer modal
    fireEvent.click(screen.getByText('幸运护身符'));
    expect(screen.getByText(/红3星（核心节点）/)).toBeInTheDocument();
  });
});
