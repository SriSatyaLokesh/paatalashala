import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure commit ID and version info are dynamically generated on every next build or next dev
let commitHash = 'local-dev';
try {
  commitHash = execSync('git rev-parse --short HEAD', { cwd: __dirname, encoding: 'utf8' }).trim();
} catch (e) {
  if (process.env.GITHUB_SHA) {
    commitHash = process.env.GITHUB_SHA.substring(0, 7);
  }
}

let pkgVersion = '0.1.0';
try {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  if (pkg.version) pkgVersion = pkg.version;
} catch (e) {}

const versionData = {
  version: pkgVersion,
  commit: commitHash,
  buildTime: new Date().toISOString(),
  tag: `v${pkgVersion}-${commitHash}`
};

const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(
  path.join(publicDir, 'version.json'),
  JSON.stringify(versionData, null, 2),
  'utf8'
);

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
  env: {
    NEXT_PUBLIC_APP_VERSION: versionData.version,
    NEXT_PUBLIC_APP_COMMIT: versionData.commit,
    NEXT_PUBLIC_APP_TAG: versionData.tag,
    NEXT_PUBLIC_APP_BUILD_TIME: versionData.buildTime,
  },
};

export default nextConfig;


