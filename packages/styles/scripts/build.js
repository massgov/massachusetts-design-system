const fs = require('fs/promises');
const path = require('path');
const { spawn } = require('child_process');

const packageRoot = path.resolve(__dirname, '..');
const distDir = path.join(packageRoot, 'dist');
const srcDir = path.join(packageRoot, 'src');

function getSassBin() {
  const sassEntry = require.resolve('sass');
  return path.join(path.dirname(sassEntry), 'sass.js');
}

async function cleanDist() {
  await fs.rm(distDir, { recursive: true, force: true });
  await fs.mkdir(distDir, { recursive: true });
}

function compileSass(inputFile, outputFile) {
  return new Promise((resolve, reject) => {
    const sassBin = getSassBin();
    const child = spawn(
      process.execPath,
      [sassBin, '--no-source-map', '--style=expanded', inputFile, outputFile],
      {
        cwd: packageRoot,
        stdio: 'inherit'
      }
    );

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Sass compilation failed for ${path.basename(inputFile)} with exit code ${code}`));
    });

    child.on('error', reject);
  });
}

async function build() {
  await cleanDist();

  await Promise.all([
    compileSass(path.join(srcDir, 'index.scss'), path.join(distDir, 'index.css')),
    compileSass(path.join(srcDir, 'helpers.scss'), path.join(distDir, 'helpers.css')),
    compileSass(path.join(srcDir, 'utilities.scss'), path.join(distDir, 'utilities.css'))
  ]);
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
