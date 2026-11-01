import ReturnHome from '@/components/ReturnHome';
export const metadata = { title: '活动数据查看器 | 弹壳攻略站' };
export default function Page() {
  return <main className="site-container pt-6 pb-7 sm:pt-8">
        <ReturnHome /><section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 sm:p-12"><h1 className="text-3xl font-black">活动数据查看器</h1><span className="mt-6 inline-block rounded-full bg-orange-500/10 px-3 py-1 text-sm text-orange-400">建设中</span></section></main>;
}
