import { describe, test, expect } from 'vitest';
import { distributeItems } from '../components/home/MasonryGrid';

describe('Masonry distributeItems algorithm', () => {
  test('handles empty and single column edge cases', () => {
    expect(distributeItems([], 3)).toEqual([[], [], []]);

    const items = [{ id: '1', ratio: 1 }];
    const result1 = distributeItems(items, 1);
    expect(result1).toHaveLength(1);
    expect(result1[0]).toHaveLength(1);
  });

  test('distributes items greedily to the shortest column', () => {
    // 3 items into 2 columns:
    // item 1: ratio 1 (height 1) -> goes to col 0 (heights: [1, 0])
    // item 2: ratio 1 (height 1) -> goes to col 1 (heights: [1, 1])
    // item 3: ratio 0.5 (height 2) -> col 0 and 1 are equal, goes to col 0 (heights: [3, 1])
    const items = [
      { id: '1', ratio: 1 },
      { id: '2', ratio: 1 },
      { id: '3', ratio: 0.5 },
    ];
    const columns = distributeItems(items, 2);
    expect(columns).toHaveLength(2);
    expect(columns[0].map((i) => i.id)).toEqual(['1', '3']);
    expect(columns[1].map((i) => i.id)).toEqual(['2']);
  });

  test('maintains left-to-right reading order across equal ratio items', () => {
    const items = [
      { id: 'a', ratio: 1 },
      { id: 'b', ratio: 1 },
      { id: 'c', ratio: 1 },
      { id: 'd', ratio: 1 },
    ];
    const columns = distributeItems(items, 2);
    expect(columns[0].map((i) => i.id)).toEqual(['a', 'c']);
    expect(columns[1].map((i) => i.id)).toEqual(['b', 'd']);
  });
});

