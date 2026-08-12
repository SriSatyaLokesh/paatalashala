const isProd = process.env.NODE_ENV === 'production';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || '';

// Only add /paatalashala prefix if deployed to subdirectory, not on custom domain
const isCustomDomain = SITE_URL.includes('paatalashala.space') || SITE_URL.includes('localhost') || SITE_URL.includes('127.0.0.1');
const basePath = isProd && !isCustomDomain ? '/paatalashala' : '';

export function prefixPath(path) {
  if (!path) return '';
  
  // Handle CSS url('/path') backgrounds
  if (path.startsWith('url(')) {
    const match = path.match(/url\(['"]?([^'"]+)['"]?\)/);
    if (match) {
      const innerPath = match[1];
      if (innerPath.startsWith('/')) {
        return `url('${basePath}${innerPath}')`;
      }
    }
    return path;
  }
  
  if (path.startsWith('/')) {
    return `${basePath}${path}`;
  }
  return path;
}
