const fs = require('fs/promises');
const path = require('path');
const { spawn } = require('child_process');
const { distDir, getSassBin, packageRoot, sassEntries, srcDir } = require('./shared');

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

  await Promise.all(
    sassEntries.map(([inputName, outputName]) =>
      compileSass(path.join(srcDir, inputName), path.join(distDir, outputName))
    )
  );
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
