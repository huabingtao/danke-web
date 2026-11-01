export type AdSlotId = 'home-between-sections' | 'page-bottom';
export interface BannerAd { enabled: boolean; imageSrc?: string; href?: string; alt?: string }
export const AD_CONFIG: Record<AdSlotId, BannerAd> = {
  'home-between-sections': { enabled: false },
  'page-bottom': { enabled: false },
};
