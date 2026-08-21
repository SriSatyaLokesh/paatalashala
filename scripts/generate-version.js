const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');

let commitHash = 'local-dev';
try {
  commitHash = execSync('git rev-parse --short HEAD', { cwd: rootDir, encoding: 'utf8' }).trim();
} catch (e) {
  if (process.env.GITHUB_SHA) {
    commitHash = process.env.GITHUB_SHA.substring(0, 7);
  }
}

let pkgVersion = '0.1.0';
try {
  const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
  if (pkg.version) pkgVersion = pkg.version;
} catch (e) {}

const versionData = {
  version: pkgVersion,
  commit: commitHash,
  buildTime: new Date().toISOString(),
  tag: `v${pkgVersion}-${commitHash}`
};

const publicDir = path.join(rootDir, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(
  path.join(publicDir, 'version.json'),
  JSON.stringify(versionData, null, 2),
  'utf8'
);

console.log(`[version-generator] Generated public/version.json: ${versionData.tag} (${versionData.buildTime})`);

