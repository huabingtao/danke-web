import BentoGrid from '@/components/BentoGrid';

type SearchParams = Promise<{ admin?: string }>;

interface PageProps {
  searchParams: SearchParams;
}

export default async function Home(props: PageProps) {
  const searchParams = await props.searchParams;
  const isAdmin = searchParams.admin === 'true';

  return (
    <div className="space-y-8 py-6">
      {/* Brand Hero Heading */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-black tracking-wider text-zinc-100 sm:text-6xl uppercase bg-clip-text text-transparent bg-gradient-to-b from-zinc-100 to-zinc-400">
          呱呱弹壳空间
        </h1>
        <p className="text-sm sm:text-base tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-500 font-bold max-w-2xl mx-auto uppercase">
          弹壳特攻队硬核玩家与自媒体的战术情报中心
        </p>
      </div>

      {/* Bento Grid */}
      <BentoGrid isAdmin={isAdmin} />
    </div>
  );
}
