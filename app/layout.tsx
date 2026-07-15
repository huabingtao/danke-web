import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: '呱呱弹壳空间 | 弹壳特攻队攻略数据中心',
  description: '《弹壳特攻队》自媒体博主“弹壳呱呱”的战术情报与攻略资产数据中心，包含月度产出明细、物品图鉴、活动时间轴与伤害计算器。',
  keywords: '弹壳特攻队, 弹壳特攻队攻略, 弹壳特攻队伤害计算器, 弹壳特攻队月度产出, 弹壳特攻队活动, 弹壳呱呱',
  authors: [{ name: '弹壳呱呱' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="bg-zinc-950 text-zinc-100">
      <body className="min-h-screen font-sans antialiased bg-zinc-950 text-zinc-100 relative overflow-x-hidden">
        {/* Ambient Glowing Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-orange-600/10 blur-[120px] pointer-events-none z-0" />
        <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none z-0" />
        
        {/* Content Wrapper */}
        <div className="relative z-10 min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="bg-zinc-950/60 border-t border-zinc-900 py-6 text-center text-zinc-500 text-sm backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4">
              <p>© {new Date().getFullYear()} 呱呱弹壳空间 | 由 弹壳呱呱 驱动</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
