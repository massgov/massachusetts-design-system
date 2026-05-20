const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const { spawn } = require('child_process');
const { startDemoServer } = require('./demo-server');
const {
  distDir,
  getSassBin,
  getWorkspacePackageRoot,
  packageRoot,
  sassEntries,
  srcDir
} = require('./shared');

let shuttingDown = false;
const children = new Set();
const watchers = new Set();
const demoRoot = path.join(packageRoot, 'demo');
const tokensPackageRoot = getWorkspacePackageRoot('@massds/mds-tokens');
const tokensDistDir = path.join(tokensPackageRoot, 'dist');
const tokensSrcDir = path.join(tokensPackageRoot, 'src');
let demoServer;

async function ensureDist() {
  await fsPromises.mkdir(distDir, { recursive: true });
}

async function syncTokenDist() {
  await fsPromises.rm(tokensDistDir, { recursive: true, force: true });
  await fsPromises.cp(tokensSrcDir, tokensDistDir, { recursive: true });
  console.log('Synced token CSS from src to dist.');
}

function debounceTask(task, delay = 150) {
  let timeout;

  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      task().catch((error) => {
        console.error(error);
        stopWatchers(1);
      });
    }, delay);
  };
}

function debounce(callback, delay = 150) {
  let timeout;

  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(callback, delay);
  };
}

function getDisplayPath(directory) {
  const repoRoot = path.resolve(packageRoot, '..', '..');
  return path.relative(repoRoot, directory);
}

function watchDirectory(directory, label, onChange) {
  const watcher = fs.watch(directory, { recursive: true }, (_eventType, fileName) => {
    if (fileName && path.basename(fileName) === '.DS_Store') {
      return;
    }

    onChange();
  });

  watchers.add(watcher);

  watcher.on('error', (error) => {
    console.error(`Watcher failed for ${label}: ${error.message}`);
    stopWatchers(1);
  });

  console.log(`Watching ${label}: ${getDisplayPath(directory)}`);
}

function stopWatchers(exitCode = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  for (const child of children) {
    child.kill('SIGINT');
  }

  for (const watcher of watchers) {
    watcher.close();
  }

  if (demoServer) {
    demoServer.server.close();
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
  await syncTokenDist();

  for (const [inputName, outputName] of sassEntries) {
    watchSass(path.join(srcDir, inputName), path.join(distDir, outputName));
  }

  demoServer = await startDemoServer({ liveReload: true, open: true });

  const reloadDemo = debounce(() => {
    demoServer.reload();
  });
  const syncTokensAndReload = debounceTask(async () => {
    await syncTokenDist();
    demoServer.reload();
  });

  watchDirectory(distDir, 'compiled style CSS', reloadDemo);
  watchDirectory(demoRoot, 'styles demo files', reloadDemo);
  watchDirectory(tokensSrcDir, 'token source CSS', syncTokensAndReload);
}

process.on('SIGINT', () => stopWatchers(0));
process.on('SIGTERM', () => stopWatchers(0));

watch().catch((error) => {
  console.error(error);
  stopWatchers(1);
});
