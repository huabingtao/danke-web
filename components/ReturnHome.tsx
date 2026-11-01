"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { WIKI_CATEGORIES } from '@/lib/wiki-categories';
const PAGE_NAMES: Record<string, string> = {
  '/items': '物品图鉴', '/wiki': '战术图鉴', '/calculator': '养成消耗表',
  '/strategies': '攻略库', '/events': '活动数据', '/yields': '资源获取',
  '/about': '关于本站与免责说明',
  '/damage-calculator': '弹壳伤害计算器',
};
export default function ReturnHome({ currentPage }: { currentPage?: string }) {
  const pathname = usePathname();
  const category = WIKI_CATEGORIES.find(item => item.linkHref === pathname);
  const label = currentPage || (category ? `${category.label}图鉴` : PAGE_NAMES[pathname]) || '攻略详情';
  return (
    <nav aria-label="面包屑" className="mb-6 flex min-w-0 items-center gap-2 text-sm">
      <Link href="/" scroll={false} className="inline-flex shrink-0 items-center gap-1.5 text-slate-400 hover:text-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
        <ArrowLeft className="h-4 w-4" /><span>返回首页</span>
      </Link>
      <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-slate-600" />
      <span aria-current="page" title={label} className="truncate font-medium text-orange-400">{label}</span>
    </nav>
  );
}
