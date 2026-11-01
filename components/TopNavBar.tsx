"use client";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
const items = [
  { label: '首页', href: '/' },
  { label: '游戏资料', href: '/#zone-wiki' },
  { label: '弹壳工具', href: '/#zone-tools' },
  { label: '攻略', href: '/strategies' },
  { label: '关于', href: '/about' },
];
export default function TopNavBar(_props: { width?: 'default' | 'wide' }) {
  void _props;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState('');
  useEffect(() => {
    const update = () => {
      if (pathname !== '/') { setSection(''); return; }
      const wiki = document.getElementById('zone-wiki');
      const tools = document.getElementById('zone-tools');
      setSection(wiki && wiki.getBoundingClientRect().top <= 120 ? 'zone-wiki' : tools && tools.getBoundingClientRect().top <= 120 ? 'zone-tools' : '');
    };
    const frame = requestAnimationFrame(update);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('hashchange', update);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update); window.removeEventListener('hashchange', update); };
  }, [pathname]);
  const active = (href: string) => {
    if (href === '/about') return pathname === '/about';
    if (href === '/strategies') return pathname.startsWith('/strategies');
    if (pathname !== '/') return false;
    return href === '/' ? !section : href === `/#${section}`;
  };
  const renderLinks = () => items.map(item => (
    <Link key={item.href} href={item.href} scroll={item.href === '/' ? false : undefined}
      onClick={() => setOpen(false)} aria-current={active(item.href) ? 'location' : undefined}
      className={`rounded-xl px-3 py-2 text-sm font-bold transition-colors ${active(item.href) ? 'bg-orange-500/10 text-orange-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
      {item.label}
    </Link>
  ));
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#0a0f1d]/95 backdrop-blur-xl">
      <div className="site-container flex h-16 items-center justify-between gap-4">
        <Link href="/" scroll={false} className="flex items-center gap-3 font-black"><Image src="/brand/dan-mark.svg" alt="" width={42} height={42} priority className="shrink-0" /><span className="text-lg tracking-wide sm:text-xl">弹壳攻略站</span></Link>
        <nav aria-label="主导航" className="hidden items-center gap-1 lg:flex">{renderLinks()}</nav>
        <button className="rounded-lg border border-slate-700 p-2 lg:hidden" aria-label="切换菜单" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && <nav id="mobile-menu" aria-label="手机导航" className="site-container grid grid-cols-2 gap-2 pb-4 lg:hidden">{renderLinks()}</nav>}
    </header>
  );
}
