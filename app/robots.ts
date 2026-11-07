import type { MetadataRoute } from 'next';
import { creatorSiteUrl } from '@/lib/creator-content';
export const dynamic = 'force-static';
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: '*', disallow: process.env.CREATOR_PREVIEW === '1' ? '/' : ['/creator-content/', '/content/releases/'] }, sitemap: `${creatorSiteUrl()}/sitemap.xml` }; }
