/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || '';

// Only use basePath if deploying to subdirectory (srisatyalokesh.is-a.dev/paatalashala)
// If using custom domain (paatalashala.space), don't add basePath
const isCustomDomain = SITE_URL.includes('paatalashala.space') || SITE_URL.includes('localhost') || SITE_URL.includes('127.0.0.1');
const basePath = isProd && !isCustomDomain ? '/paatalashala' : undefined;

const nextConfig = {
  output: 'export',
  basePath,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;

