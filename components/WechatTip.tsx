"use client";

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function WechatTip() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        trigger.current?.focus();
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);

  return (
    <div ref={root} className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] left-4 z-30 md:bottom-16"
      onPointerEnter={event => { if (event.pointerType === 'mouse') setOpen(true); }}
      onPointerLeave={event => { if (event.pointerType === 'mouse') setOpen(false); }}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
      {open && (
        <div className="absolute bottom-full left-0 pb-3">
          <section id="wechat-tip-panel" aria-label="微信公众号二维码" className="max-h-[calc(100dvh-10rem)] w-[208px] overflow-auto rounded-2xl border border-slate-700 bg-slate-950 p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-sm font-bold text-white">微信公众号</h2>
              <button type="button" aria-label="关闭二维码" className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white" onClick={() => { trigger.current?.focus(); setOpen(false); }}><X className="h-4 w-4" /></button>
            </div>
            <Image src="/wiki-assets/其它/弹壳呱呱微信公众号二维码.png" alt="弹壳呱呱微信公众号二维码" width={168} height={168} unoptimized className="h-[168px] w-[168px] rounded-lg bg-white p-2" />
          </section>
        </div>
      )}
      <button ref={trigger} type="button" aria-label="微信公众号" aria-expanded={open} aria-controls={open ? 'wechat-tip-panel' : undefined}
        onFocus={event => { if (event.currentTarget.matches(':focus-visible')) setOpen(true); }}
        onClick={() => setOpen(current => !current)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/95 text-emerald-400 shadow-lg transition-colors hover:border-emerald-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400">
        <MessageCircle className="h-5 w-5" />
      </button>
    </div>
  );
}
