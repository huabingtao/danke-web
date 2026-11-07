import type { NextConfig } from "next";

if (process.env.NODE_ENV === 'production' && process.env.CREATOR_PREVIEW !== '1') {
  if (process.env.NEXT_PUBLIC_CORE_API_URL !== 'https://dankecore.guaguahub.cn') throw new Error('Production requires the configured HTTPS Core endpoint');
  if (process.env.SITE_URL !== 'https://dankeweb.guaguahub.cn') throw new Error('Production requires the configured HTTPS SITE_URL');
}

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
