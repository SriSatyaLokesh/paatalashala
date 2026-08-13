/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || '';

// Add /paatalashala prefix ONLY for GitHub subdirectory deployment or local emulation
// Custom domain or localhost: no prefix
const shouldUseBasePath = SITE_URL.includes('srisatyalokesh.is-a.dev') || process.env.LOCAL_SERVE === 'true';
const basePath = isProd && shouldUseBasePath ? '/paatalashala' : undefined;

const nextConfig = {
  output: 'export',
  basePath,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;

