import type { HomeToolItem } from './home-config';

export const HOME_TOOL_ORDER_KEY = 'danke-home-tool-order:v1';

export function parseHomeToolOrder(value: string | null): string[] {
  try {
    const parsed: unknown = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? [...new Set(parsed.filter((id): id is string => typeof id === 'string' && !!id))] : [];
  } catch { return []; }
}

export function orderedHomeTools(tools: HomeToolItem[], order: string[]): HomeToolItem[] {
  const positions = new Map(order.map((id, index) => [id, index]));
  return tools.filter((tool) => !tool.hidden).sort((a, b) => (positions.get(a.id) ?? order.length) - (positions.get(b.id) ?? order.length));
}

export function moveHomeTool(ids: string[], from: string, to: string): string[] {
  const start = ids.indexOf(from); const end = ids.indexOf(to);
  if (start < 0 || end < 0 || start === end) return [...ids];
  const next = [...ids];
  next.splice(start, 1);
  next.splice(end, 0, from);
  return next;
}
