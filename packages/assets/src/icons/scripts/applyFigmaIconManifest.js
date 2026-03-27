const fs = require('fs');
const path = require('path');
const prepIcons = require('./prepIcons');

const rootDir = path.resolve(__dirname, '..', 'static');
const boldDir = path.join(rootDir, 'bold');
const defaultManifestPath = path.join(__dirname, 'figma-unsynced-manifest.json');

function parseArgs(argv) {
  const args = {
    manifest: defaultManifestPath,
    prune: false,
    dryRun: false,
    skipOptimize: false,
    removeRepoOnly: '',
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--manifest') {
      args.manifest = argv[i + 1] || '';
      i += 1;
    } else if (arg === '--prune') {
      args.prune = true;
    } else if (arg === '--dry-run') {
      args.dryRun = true;
    } else if (arg === '--skip-optimize') {
      args.skipOptimize = true;
    } else if (arg === '--remove-repo-only') {
      args.removeRepoOnly = argv[i + 1] || '';
      i += 1;
    }
  }

  return args;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function listSvgFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((file) => file.endsWith('.svg'));
}

function normalizeFileBaseName(name) {
  return name
    .replace(/ /g, '-')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/--+/g, '-')
    .toLowerCase();
}

function normalizeSvg(svg) {
  return svg.replace(/\r\n/g, '\n').trimEnd().concat('\n');
}

function writeFileMaybe(filePath, contents, dryRun) {
  const next = normalizeSvg(contents);
  const prev = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;

  if (prev === next) return 'unchanged';
  if (!dryRun) fs.writeFileSync(filePath, next);
  return prev === null ? 'created' : 'updated';
}

function removeFileMaybe(filePath, dryRun) {
  if (!fs.existsSync(filePath)) return false;
  if (!dryRun) fs.unlinkSync(filePath);
  return true;
}

function removeRepoOnlyFromInventory(inventoryPath, dryRun) {
  if (!inventoryPath) return 0;

  const raw = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), inventoryPath), 'utf8'));
  const staleItems = Array.isArray(raw.repo_only_stale) ? raw.repo_only_stale : [];

  let removed = 0;

  for (const item of staleItems) {
    const fileBaseName = normalizeFileBaseName(item.repo_name || '');
    if (!fileBaseName) continue;

    if (removeFileMaybe(path.join(rootDir, `${fileBaseName}.svg`), dryRun)) {
      removed += 1;
    }

    if (removeFileMaybe(path.join(boldDir, `${fileBaseName}--bold.svg`), dryRun)) {
      removed += 1;
    }
  }

  return removed;
}

function main() {
  const { manifest, prune, dryRun, skipOptimize, removeRepoOnly } = parseArgs(process.argv);
  const manifestPath = path.resolve(process.cwd(), manifest);
  const raw = fs.readFileSync(manifestPath, 'utf8');
  const icons = JSON.parse(raw);

  if (!Array.isArray(icons)) {
    throw new Error('Manifest must be a JSON array');
  }

  ensureDir(rootDir);
  ensureDir(boldDir);

  const expectedRegular = new Set();
  const expectedBold = new Set();
  const summary = {
    created: 0,
    updated: 0,
    unchanged: 0,
    pruned: 0,
    removedRepoOnly: 0,
  };

  for (const icon of icons) {
    const fileBaseName = normalizeFileBaseName(icon.fileBaseName || icon.name || '');
    if (!fileBaseName) {
      throw new Error(`Missing fileBaseName/name in manifest entry: ${JSON.stringify(icon)}`);
    }

    if (icon.regularSvg) {
      const filename = `${fileBaseName}.svg`;
      expectedRegular.add(filename);
      const result = writeFileMaybe(path.join(rootDir, filename), icon.regularSvg, dryRun);
      summary[result] += 1;
    }

    if (icon.boldSvg) {
      const filename = `${fileBaseName}--bold.svg`;
      expectedBold.add(filename);
      const result = writeFileMaybe(path.join(boldDir, filename), icon.boldSvg, dryRun);
      summary[result] += 1;
    }
  }

  if (prune) {
    for (const file of listSvgFiles(rootDir)) {
      if (!expectedRegular.has(file) && removeFileMaybe(path.join(rootDir, file), dryRun)) {
        summary.pruned += 1;
      }
    }

    for (const file of listSvgFiles(boldDir)) {
      if (!expectedBold.has(file) && removeFileMaybe(path.join(boldDir, file), dryRun)) {
        summary.pruned += 1;
      }
    }
  }

  summary.removedRepoOnly = removeRepoOnlyFromInventory(removeRepoOnly, dryRun);

  if (!dryRun && !skipOptimize) {
    prepIcons(rootDir);
  }

  console.log(
    JSON.stringify(
      {
        manifest: manifestPath,
        manifestEntries: icons.length,
        prune,
        dryRun,
        skipOptimize,
        removeRepoOnly: removeRepoOnly ? path.resolve(process.cwd(), removeRepoOnly) : '',
        ...summary,
      },
      null,
      2
    )
  );
}

main();
