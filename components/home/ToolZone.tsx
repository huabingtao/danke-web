'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { GripVertical, RotateCcw } from 'lucide-react';
import ZoneHeader from './ZoneHeader';
import ConstructionOverlay from './ConstructionOverlay';
import HomeCardLink from './HomeCardLink';
import { HOME_TOOLS, type HomeToolItem } from '@/lib/home-config';
import { HOME_TOOL_ORDER_KEY, moveHomeTool, orderedHomeTools, parseHomeToolOrder } from '@/lib/home-tool-order';

interface ToolZoneProps { tools?: HomeToolItem[] }
interface DragState { id: string; pointerId: number; x: number; y: number; moved: boolean; target: string | null }

export default function ToolZone({ tools = HOME_TOOLS }: ToolZoneProps) {
  const [order, setOrder] = useState<string[]>([]);
  const [editing, setEditing] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dropId, setDropId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const grid = useRef<HTMLDivElement>(null);
  const drag = useRef<DragState | null>(null);
  const visibleTools = orderedHomeTools(tools, order);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try { setOrder(parseHomeToolOrder(localStorage.getItem(HOME_TOOL_ORDER_KEY))); }
      catch { /* Sorting remains available in this mounted page. */ }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function save(next: string[], message: string) {
    setOrder(next);
    try {
      if (next.length) localStorage.setItem(HOME_TOOL_ORDER_KEY, JSON.stringify(next));
      else localStorage.removeItem(HOME_TOOL_ORDER_KEY);
      setNotice(message);
    } catch { setNotice(`${message}；浏览器未能保存，当前页面仍可使用`); }
  }
  function move(from: string, to: string) {
    if (from === to) return;
    const ids = moveHomeTool(visibleTools.map((tool) => tool.id), from, to);
    save(ids, `已将${visibleTools.find((tool) => tool.id === from)?.name ?? '工具'}移到第 ${ids.indexOf(from) + 1} 位`);
  }
  function cancelDrag() {
    drag.current = null; setDragId(null); setDropId(null);
  }
  function pointerMove(event: PointerEvent<HTMLButtonElement>) {
    const active = drag.current;
    if (!active || active.pointerId !== event.pointerId) return;
    if (!active.moved && Math.hypot(event.clientX - active.x, event.clientY - active.y) < 6) return;
    active.moved = true;
    setDragId(active.id);
    const target = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>('[data-home-tool-id]');
    const targetId = target && grid.current?.contains(target) ? target.dataset.homeToolId ?? null : null;
    active.target = targetId;
    setDropId(targetId !== active.id ? targetId : null);
    if (event.clientY < 80) window.scrollBy(0, -16);
    else if (event.clientY > window.innerHeight - 80) window.scrollBy(0, 16);
  }
  function pointerUp(event: PointerEvent<HTMLButtonElement>) {
    const active = drag.current;
    if (!active || active.pointerId !== event.pointerId) return;
    if (active.moved && active.target) move(active.id, active.target);
    cancelDrag();
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  return <section className="space-y-3" onKeyDown={(event) => {
    if (event.key !== 'Escape') return;
    if (drag.current) cancelDrag(); else setEditing(false);
  }}>
    <ZoneHeader id="zone-tools" title="弹壳工具" actions={<div className="flex shrink-0 items-center gap-2">
      {editing && <button type="button" onClick={() => { cancelDrag(); save([], '已恢复默认顺序'); }} className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-slate-700 px-3 text-xs font-semibold text-slate-300 hover:text-orange-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"><RotateCcw aria-hidden="true" className="size-3.5" />恢复默认</button>}
      <button type="button" aria-pressed={editing} onClick={() => { cancelDrag(); setEditing((value) => !value); }} className="min-h-11 rounded-xl border border-slate-700 px-3 text-xs font-semibold text-orange-300 hover:bg-orange-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400">{editing ? '完成排序' : '调整顺序'}</button>
    </div>} />
    {editing && <p id="home-tool-sort-help" className="text-xs leading-5 text-slate-400">拖动右上角手柄调整位置，顺序保存在当前浏览器。键盘可使用 Alt＋左右方向键。</p>}
    <span role="status" className="sr-only">{notice}</span>
    <div ref={grid} aria-label="首页工具卡片" className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {visibleTools.map((tool) => {
        const Icon = tool.icon;
        const unavailable = tool.badge === '建设中';
        const navigable = !unavailable && !editing;
        return <div key={tool.id} data-home-tool-id={tool.id} data-drop-target={dropId === tool.id} className={`relative min-w-0 rounded-3xl data-[drop-target=true]:outline-2 data-[drop-target=true]:outline-offset-2 data-[drop-target=true]:outline-orange-400 ${dragId === tool.id ? 'opacity-60' : ''}`}>
          <HomeCardLink href={tool.url} label={tool.name} external={tool.isExternal} disabledReason={unavailable ? '建设中，暂不可用' : editing ? '正在调整顺序' : undefined}>
            <div className={`group relative flex aspect-square w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br ${tool.gradient} p-5 shadow-lg transition-colors sm:p-6 ${navigable ? 'cursor-pointer hover:border-orange-500/50 hover:shadow-orange-500/10' : ''}`}>
              {unavailable ? <ConstructionOverlay /> : tool.badge && <span className="absolute right-3 top-3 rounded-full bg-slate-950/70 px-2 py-1 text-xs text-amber-300">{tool.badge}</span>}
              <div className="flex flex-col items-center justify-center gap-4 text-center sm:gap-5">
                <div className={`flex size-16 items-center justify-center rounded-3xl border border-slate-700/60 bg-slate-900/90 shadow-xl transition-transform sm:size-24 ${navigable ? 'group-hover:scale-110 group-hover:border-orange-500/40' : ''}`}><Icon className="size-8 text-orange-400 sm:size-12" /></div>
                <h3 className={`line-clamp-1 px-1 text-base font-black text-white transition-colors sm:text-lg ${navigable ? 'group-hover:text-orange-400' : ''}`}>{tool.name}</h3>
              </div>
            </div>
          </HomeCardLink>
          {editing && <button type="button" aria-label={`拖动${tool.name}调整顺序`} aria-describedby="home-tool-sort-help" className="absolute right-2 top-2 z-20 flex size-11 touch-none select-none items-center justify-center rounded-xl border border-slate-600 bg-slate-950/95 text-slate-200 hover:text-orange-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 active:cursor-grabbing" style={{ cursor: 'grab' }}
            onClick={(event) => event.preventDefault()}
            onPointerDown={(event) => {
              if (event.button !== 0 || event.isPrimary === false) return;
              drag.current = { id: tool.id, pointerId: event.pointerId, x: event.clientX, y: event.clientY, moved: false, target: null };
              event.currentTarget.setPointerCapture?.(event.pointerId);
            }}
            onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={cancelDrag} onLostPointerCapture={cancelDrag}
            onKeyDown={(event) => {
              if (!event.altKey || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
              event.preventDefault();
              const index = visibleTools.findIndex((entry) => entry.id === tool.id);
              const target = visibleTools[index + (event.key === 'ArrowLeft' ? -1 : 1)];
              if (target) move(tool.id, target.id);
            }}><GripVertical aria-hidden="true" className="size-5" /></button>}
        </div>;
      })}
    </div>
  </section>;
}
