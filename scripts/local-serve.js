const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Building Next.js project...');
try {
  execSync('npm run build', { stdio: 'inherit' });
} catch (err) {
  console.error('Build failed.');
  process.exit(1);
}

const localServeDir = path.join(__dirname, '..', 'local-serve');
const targetDir = path.join(localServeDir, 'paatalashala');

// Clean up old local-serve dir
if (fs.existsSync(localServeDir)) {
  fs.rmSync(localServeDir, { recursive: true, force: true });
}

fs.mkdirSync(targetDir, { recursive: true });

const outDir = path.join(__dirname, '..', 'out');

// Helper function to copy folder recursively
function copyFolderSync(from, to) {
  fs.mkdirSync(to, { recursive: true });
  fs.readdirSync(from).forEach(element => {
    if (fs.lstatSync(path.join(from, element)).isDirectory()) {
      copyFolderSync(path.join(from, element), path.join(to, element));
    } else {
      fs.copyFileSync(path.join(from, element), path.join(to, element));
    }
  });
}

console.log('Structuring build directory for /paatalashala path...');
copyFolderSync(outDir, targetDir);

// ── Fix 1: Wire up custom 404 page ──────────────────────────────────────────
// Next.js static export puts the 404 page at _not-found/index.html
// `serve` looks for 404.html in the root of the served subdirectory
const notFoundSrc = path.join(targetDir, '_not-found', 'index.html');
const notFoundDest = path.join(targetDir, '404.html');
if (fs.existsSync(notFoundSrc)) {
  fs.copyFileSync(notFoundSrc, notFoundDest);
  console.log('✓ Custom 404 page wired (404.html)');
} else {
  console.warn('⚠ _not-found/index.html not found — custom 404 will not show');
}

// ── Fix 2: serve.json — disable directory listing ────────────────────────────
// Prevents /places/ and other directories from showing file tree
const serveConfig = {
  "directoryListing": false,
  "cleanUrls": true
};
fs.writeFileSync(
  path.join(localServeDir, 'serve.json'),
  JSON.stringify(serveConfig, null, 2)
);
console.log('✓ serve.json written (directoryListing: false)');

console.log('\nStarting local serve server → http://localhost:3000/paatalashala\n');
try {
  execSync('npx serve local-serve', { stdio: 'inherit' });
} catch (err) {
  // Graceful shutdown
}
