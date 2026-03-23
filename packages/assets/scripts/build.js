const fs = require('fs/promises');
const path = require('path');
const prepIcons = require('../src/icons/scripts/prepIcons');

const packageRoot = path.resolve(__dirname, '..');
const distDir = path.join(packageRoot, 'dist');

async function cleanDist() {
  await fs.rm(distDir, { recursive: true, force: true });
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function copyDir(from, to) {
  await ensureDir(path.dirname(to));
  await fs.cp(from, to, { recursive: true });
}

async function build() {
  await cleanDist();

  prepIcons(path.join(packageRoot, 'src/icons/static'));

  await Promise.all([
    copyDir(path.join(packageRoot, 'src/icons/static'), path.join(distDir, 'icons')),
    copyDir(path.join(packageRoot, 'src/animation'), path.join(distDir, 'animation')),
    copyDir(path.join(packageRoot, 'src/state-seal'), path.join(distDir, 'state-seal'))
  ]);
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
