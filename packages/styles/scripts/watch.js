const fs = require('fs/promises');
const path = require('path');
const { spawn } = require('child_process');
const { startDemoServer } = require('./demo-server');
const { distDir, getSassBin, packageRoot, sassEntries, srcDir } = require('./shared');

let shuttingDown = false;
const children = new Set();

async function ensureDist() {
  await fs.mkdir(distDir, { recursive: true });
}

function stopWatchers(exitCode = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  for (const child of children) {
    child.kill('SIGINT');
  }

  process.exitCode = exitCode;
}

function watchSass(inputFile, outputFile) {
  const sassBin = getSassBin();
  const child = spawn(
    process.execPath,
    [
      sassBin,
      '--watch',
      '--no-source-map',
      '--style=expanded',
      inputFile,
      outputFile
    ],
    {
      cwd: packageRoot,
      stdio: 'inherit'
    }
  );

  children.add(child);

  child.on('exit', (code, signal) => {
    children.delete(child);

    if (shuttingDown) {
      return;
    }

    if (code === 0 || signal === 'SIGINT') {
      return;
    }

    console.error(
      `Sass watcher stopped for ${path.basename(inputFile)} with ${
        signal ? `signal ${signal}` : `exit code ${code}`
      }`
    );
    stopWatchers(code ?? 1);
  });

  child.on('error', (error) => {
    console.error(error);
    stopWatchers(1);
  });
}

async function watch() {
  await ensureDist();

  for (const [inputName, outputName] of sassEntries) {
    watchSass(path.join(srcDir, inputName), path.join(distDir, outputName));
  }

  await startDemoServer({ open: true });
}

process.on('SIGINT', () => stopWatchers(0));
process.on('SIGTERM', () => stopWatchers(0));

watch().catch((error) => {
  console.error(error);
  stopWatchers(1);
});
