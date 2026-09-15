import type { Metadata } from 'next';
import './globals.css';
import AtmosphericBackground from '@/components/AtmosphericBackground';

export const metadata: Metadata = {
  title: '呱呱弹壳空间 | 弹壳特攻队全体系攻略与战术门户',
  description: '《弹壳特攻队》自媒体博主“弹壳呱呱”的战术情报与攻略资产数据中心，包含特工图鉴、活动阶梯精算、回响之战打法、卖菜看板与并列发车大厅。',
  keywords: '弹壳特攻队, 弹壳特攻队攻略, 弹壳特攻队特工图鉴, 弹壳特攻队活动精算, 弹壳特攻队回响之战, 弹壳呱呱, 卖菜看板, 并列发车',
  authors: [{ name: '弹壳呱呱' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark bg-[#0a0f1d] text-slate-100 selection:bg-orange-500 selection:text-slate-950">
      <body className="min-h-screen font-sans antialiased bg-[#0a0f1d] text-slate-100 relative">
        {/* Dynamic Atmospheric Background (Pure CSS & Grids, Zero Video) */}
        <AtmosphericBackground />
        
        {/* Main Content Area */}
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
