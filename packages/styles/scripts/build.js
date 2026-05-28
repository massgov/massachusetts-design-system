const fs = require('fs/promises');
const path = require('path');
const { spawn } = require('child_process');
const {
  cssDistDir,
  cssEntries,
  distDir,
  getSassBin,
  packageRoot,
  scssDistDir,
  srcDir
} = require('./shared');

async function cleanDist() {
  await fs.rm(distDir, { recursive: true, force: true });
  await fs.mkdir(cssDistDir, { recursive: true });
  await fs.mkdir(scssDistDir, { recursive: true });
}

function compileSass(inputFile, outputFile, style = 'expanded') {
  return new Promise((resolve, reject) => {
    const sassBin = getSassBin();
    const child = spawn(
      process.execPath,
      [sassBin, '--no-source-map', `--style=${style}`, inputFile, outputFile],
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

async function copyScss() {
  await fs.rm(scssDistDir, { recursive: true, force: true });
  await fs.mkdir(path.join(scssDistDir, 'mixins'), { recursive: true });
  await Promise.all([
    fs.copyFile(path.join(srcDir, 'mixins', '_breakpoints.scss'), path.join(scssDistDir, 'mixins', '_breakpoints.scss')),
    fs.copyFile(path.join(srcDir, 'mixins', '_grid.scss'), path.join(scssDistDir, 'mixins', '_grid.scss')),
    fs.copyFile(path.join(srcDir, 'mixins', '_layout.scss'), path.join(scssDistDir, 'mixins', '_layout.scss')),
    fs.copyFile(path.join(srcDir, 'mixins', '_resets.scss'), path.join(scssDistDir, 'mixins', '_resets.scss')),
    fs.copyFile(path.join(srcDir, 'mixins', 'index.scss'), path.join(scssDistDir, 'mixins', 'index.scss'))
  ]);
  await fs.writeFile(
    path.join(scssDistDir, 'index.scss'),
    ['@forward "./mixins";', ''].join('\n'),
    'utf8'
  );
}

async function build() {
  await cleanDist();
  await copyScss();

  await Promise.all(
    cssEntries.map(([inputName, outputName]) =>
      compileSass(path.join(srcDir, inputName), path.join(cssDistDir, outputName), 'expanded')
    )
  );

  await compileSass(path.join(srcDir, 'class-generators', 'index.scss'), path.join(cssDistDir, 'index.min.css'), 'compressed');
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
