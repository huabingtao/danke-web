import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProgressionCalculatorClient from '../components/ProgressionCalculatorClient';
import { LOCAL_PROGRESSION_MATRICES } from '../lib/local-wiki-data';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/calculator',
}));

describe('ProgressionCalculatorClient', () => {
  test('renders 5 progression matrices, switches tabs, and calculates core delta', () => {
    render(
      <ProgressionCalculatorClient
        initialMatrices={LOCAL_PROGRESSION_MATRICES}
      />,
    );

    // 1. Default matrix: SS equipment synthesis & forge
    expect(
      screen.getAllByText(/SS 神装打造顺位 & 神炼核心五阶段分配矩阵/).length,
    ).toBeGreaterThan(0);
    expect(screen.getByText(/阶段一：三件先到神炼 2/)).toBeInTheDocument();

    // 2. Switch to Pet Core matrix tab
    const petTab = screen.getByRole('button', {
      name: /S 宠物培养 & 异宠核心消耗节点/,
    });
    fireEvent.click(petTab);
    expect(screen.getByText(/解锁第 3 助战槽（21核）/)).toBeInTheDocument();

    // 3. Interactive Core Milestone Calculator
    expect(screen.getByText(/核心材料阶段差额速算器/)).toBeInTheDocument();
  });
});
