import Image from 'next/image';
import { AD_CONFIG, type AdSlotId } from '@/lib/ad-config';
export default function AdSlot({ slot, className = '' }: { slot: AdSlotId; className?: string }) {
  const ad = AD_CONFIG[slot];
  if (!ad.enabled || !ad.imageSrc?.startsWith('/') || ad.imageSrc.startsWith('//') || !ad.href) return null;
  return <div className={className}><aside aria-label="广告" className="relative overflow-hidden rounded-xl border border-slate-800"><span className="absolute left-2 top-1 z-10 rounded bg-slate-950/80 px-2 text-xs text-slate-400">广告</span><a href={ad.href} target="_blank" rel="sponsored noopener noreferrer" className="relative block h-[100px] md:h-[90px]"><Image src={ad.imageSrc} alt={ad.alt || '广告'} fill sizes="100vw" className="object-contain" /></a></aside></div>;
}
