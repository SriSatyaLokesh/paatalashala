const isProd = process.env.NODE_ENV === 'production';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || '';

// Add /paatalashala prefix ONLY for GitHub subdirectory deployment
// Custom domain or localhost: no prefix
const shouldUseBasePath = SITE_URL.includes('srisatyalokesh.is-a.dev');
const basePath = isProd && shouldUseBasePath ? '/paatalashala' : '';

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
