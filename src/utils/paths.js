const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '/paatalashala' : '';

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
