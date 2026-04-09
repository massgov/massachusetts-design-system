const fs = require('fs/promises');
const path = require('path');

const packageRoot = path.resolve(__dirname, '..');
const distDir = path.join(packageRoot, 'dist');
const srcDir = path.join(packageRoot, 'src');

async function cleanDist() {
  await fs.rm(distDir, { recursive: true, force: true });
}

async function build() {
  await cleanDist();
  await fs.cp(srcDir, distDir, { recursive: true });
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
