import type { Metadata } from 'next';
import ReturnHome from '@/components/ReturnHome';
import EventsTimelineClient from '@/components/EventsTimelineClient';

export const metadata: Metadata = {
  title: '活动前瞻与赛季轮转中心 | 弹壳攻略站',
  description: '基于官方游戏数据解密解析，抢先掌握 2026 年 11 月限时活动排期、异世宠物上线时间与 2026-2027 长期赛季轮转。',
  keywords: '弹壳特攻队活动, 异世宠物, 双十一狂欢, 柏青哥弹球, 弹壳赛季时间表, 弹壳呱呱',
};

export default function EventsPage() {
  return (
    <main className="site-container pt-6 pb-7 sm:pt-8 min-h-screen">
      <ReturnHome currentPage="活动前瞻与赛季轮转" />
      <EventsTimelineClient />
    </main>
  );
}
