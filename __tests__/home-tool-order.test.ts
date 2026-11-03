import { expect, test } from 'vitest';
import { HOME_TOOLS } from '../lib/home-config';
import { moveHomeTool, orderedHomeTools, parseHomeToolOrder } from '../lib/home-tool-order';

test('saved IDs are deduplicated and invalid storage falls back to the default order', () => {
  for (const input of [null, '', 'bad', '{}', '12']) expect(parseHomeToolOrder(input)).toEqual([]);
  expect(parseHomeToolOrder('["yields",null,"yields",1,""]')).toEqual(['yields']);
});
test('removed IDs are ignored, hidden tools stay hidden and newly added tools remain available', () => {
  const tools = orderedHomeTools(HOME_TOOLS, ['deleted', 'progression', 'gem-values', 'yields']);
  expect(tools.slice(0, 2).map((tool) => tool.id)).toEqual(['gem-values', 'yields']);
  expect(tools.some((tool) => tool.id === 'progression')).toBe(false);
  expect(tools).toHaveLength(HOME_TOOLS.filter((tool) => !tool.hidden).length);
});
test('moves either direction without mutating input and ignores invalid targets', () => {
  const ids = ['a', 'b', 'c'];
  expect(moveHomeTool(ids, 'c', 'a')).toEqual(['c', 'a', 'b']);
  expect(moveHomeTool(ids, 'a', 'c')).toEqual(['b', 'c', 'a']);
  expect(moveHomeTool(ids, 'missing', 'b')).toEqual(ids);
  expect(ids).toEqual(['a', 'b', 'c']);
});
