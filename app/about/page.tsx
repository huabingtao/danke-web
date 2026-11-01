import ReturnHome from '@/components/ReturnHome';
export const metadata = { title: '关于本站与免责说明 | 弹壳攻略站' };
export default function AboutPage() {
  return (
    <main className="site-container pt-6 pb-7 sm:pt-8">
      <ReturnHome />
      <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
        <h1 className="text-2xl font-black text-white sm:text-3xl">关于本站与免责说明</h1>
        <p className="mt-6 max-w-3xl text-sm leading-7 text-slate-300">
          本站为玩家自建攻略站点，数据与策略仅供参考。游戏内所有角色、装备名称与美术素材版权均归开发商 Habby 公司所有。
        </p>
      </section>
    </main>
  );
}
