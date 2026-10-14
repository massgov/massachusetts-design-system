import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import semver from 'semver';

const packageDirectories = ['assets', 'components', 'styles', 'tokens'];
const dependencySections = ['dependencies', 'peerDependencies', 'devDependencies'];

function refreshLockfile(repositoryRoot) {
  const npmCli = process.env.npm_execpath;
  const result = spawnSync(
    npmCli ? process.execPath : 'npm',
    [
      ...(npmCli ? [npmCli] : []),
      'install', '--package-lock-only', '--ignore-scripts', '--no-audit', '--no-fund'
    ],
    { cwd: repositoryRoot, stdio: 'inherit' }
  );

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error('Could not refresh package-lock.json. Storybook dependencies were restored.');
  }
}

export function prepareStorybookRelease(repositoryRoot, updateLockfile = refreshLockfile) {
  const manifests = packageDirectories.map((directory) => {
    const manifest = JSON.parse(readFileSync(
      resolve(repositoryRoot, 'packages', directory, 'package.json'), 'utf8'
    ));

    if (manifest.name !== `@massds/mds-${directory}` || !semver.valid(manifest.version)) {
      throw new Error(`Invalid package name or version in packages/${directory}/package.json.`);
    }

    return manifest;
  });
  const versions = Object.fromEntries(manifests.map(({ name, version }) => [name, version]));
  const errors = [];

  for (const manifest of manifests) {
    for (const section of dependencySections) {
      for (const [name, range] of Object.entries(manifest[section] ?? {})) {
        if (versions[name] && (!semver.validRange(range) || !semver.satisfies(versions[name], range))) {
          errors.push(`${manifest.name} ${section} requires ${name}@${range}, but the workspace is ${versions[name]}.`);
        }
      }
    }
  }

  if (errors.length) {
    throw new Error(`Incompatible Storybook release dependencies:\n${errors.join('\n')}\nUpdate the package versions or dependency ranges before preparing the release.`);
  }

  const storybookPath = resolve(repositoryRoot, 'storybook/package.json');
  const lockfilePath = resolve(repositoryRoot, 'package-lock.json');
  const originalStorybook = readFileSync(storybookPath, 'utf8');
  const originalLockfile = readFileSync(lockfilePath, 'utf8');
  const storybook = JSON.parse(originalStorybook);
  storybook.dependencies = { ...storybook.dependencies, ...versions };

  try {
    writeFileSync(storybookPath, `${JSON.stringify(storybook, null, 2)}\n`);
    updateLockfile(repositoryRoot);
  } catch (error) {
    writeFileSync(storybookPath, originalStorybook);
    writeFileSync(lockfilePath, originalLockfile);
    throw error;
  }

  return versions;
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
    const versions = prepareStorybookRelease(repositoryRoot);
    console.log('Prepared Storybook release dependencies:');
    for (const [name, version] of Object.entries(versions)) {
      console.log(`  ${name}@${version}`);
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
