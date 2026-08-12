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

console.log('Starting local serve server on local-serve directory...');
try {
  execSync('npx serve local-serve', { stdio: 'inherit' });
} catch (err) {
  // Graceful shutdown
}
