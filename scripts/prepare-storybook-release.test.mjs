import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { prepareStorybookRelease } from './prepare-storybook-release.mjs';

const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));
const versions = { assets: '1.2.0', components: '0.1.0-beta.0', styles: '2.0.0-beta.1', tokens: '3.0.0-beta.1' };
const read = (root, file) => readFileSync(resolve(root, file), 'utf8');
const json = (root, file) => JSON.parse(read(root, file));
const write = (root, file, value) => writeFileSync(resolve(root, file), `${JSON.stringify(value, null, 2)}\n`);

function fixture(t) {
  const root = mkdtempSync(resolve(tmpdir(), 'mds-release-test-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const [directory, version] of Object.entries(versions)) {
    mkdirSync(resolve(root, 'packages', directory), { recursive: true });
    write(root, `packages/${directory}/package.json`, { name: `@massds/mds-${directory}`, version });
  }
  const components = json(root, 'packages/components/package.json');
  components.peerDependencies = { '@massds/mds-assets': '^1.2.0', '@massds/mds-tokens': '^3.0.0-beta.1' };
  components.devDependencies = { '@massds/mds-styles': '^2.0.0-beta.1' };
  write(root, 'packages/components/package.json', components);
  mkdirSync(resolve(root, 'storybook'));
  write(root, 'storybook/package.json', {
    name: '@massds/storybook', version: '0.0.0', private: true,
    dependencies: { '@massds/mds-components': '^0.1.0-beta.0', twig: '^3.0.0' },
    devDependencies: { vite: '^8.0.16' }, scripts: { dev: 'storybook dev' }
  });
  write(root, 'package.json', { private: true, workspaces: [...Object.keys(versions).map(name => `packages/${name}`), 'storybook'] });
  write(root, 'package-lock.json', { lockfileVersion: 3, packages: {} });
  return root;
}

test('pins the workspace versions and preserves Storybook tooling and metadata', (t) => {
  const root = fixture(t);
  let refreshed = false;
  prepareStorybookRelease(root, (target) => { assert.equal(target, root); refreshed = true; });
  const storybook = json(root, 'storybook/package.json');
  for (const [name, version] of Object.entries(versions)) {
    assert.equal(storybook.dependencies[`@massds/mds-${name}`], version);
  }
  assert.equal(storybook.dependencies.twig, '^3.0.0');
  assert.deepEqual(storybook.devDependencies, { vite: '^8.0.16' });
  assert.deepEqual(storybook.scripts, { dev: 'storybook dev' });
  assert.equal(storybook.version, '0.0.0');
  assert(refreshed);
});

for (const version of ['2.0.0', '2.0.0-rc.1']) {
  test(`follows a components version bump to ${version}`, (t) => {
    const root = fixture(t);
    const components = json(root, 'packages/components/package.json');
    components.version = version;
    write(root, 'packages/components/package.json', components);
    prepareStorybookRelease(root, () => {});
    assert.equal(json(root, 'storybook/package.json').dependencies['@massds/mds-components'], version);
  });
}

test('restores the Storybook manifest and lockfile when npm fails', (t) => {
  const root = fixture(t);
  const before = read(root, 'storybook/package.json');
  const lock = read(root, 'package-lock.json');
  assert.throws(() => prepareStorybookRelease(root, () => {
    write(root, 'package-lock.json', { changed: true });
    throw new Error('npm failed');
  }), /npm failed/);
  assert.equal(read(root, 'storybook/package.json'), before);
  assert.equal(read(root, 'package-lock.json'), lock);
});

test('can be rerun without changing aligned dependencies', (t) => {
  const root = fixture(t);
  prepareStorybookRelease(root, () => {});
  const before = read(root, 'storybook/package.json');
  prepareStorybookRelease(root, () => {});
  assert.equal(read(root, 'storybook/package.json'), before);
});

for (const version of ['0.1.0-beta.1', '2.0.0', versions.components]) {
  test(`production deployment aligns a tagged snapshot to components ${version}`, (t) => {
    const root = fixture(t);
    const storybook = json(root, 'storybook/package.json');
    storybook.dependencies = Object.fromEntries(
      Object.entries(versions).map(([name, pin]) => [`@massds/mds-${name}`, pin])
    );
    storybook.devDependencies = {};
    write(root, 'storybook/package.json', storybook);
    const env = { ...process.env, npm_config_offline: 'true', npm_config_cache: resolve(root, 'cache') };
    const initial = spawnSync('npm', [
      'install', '--package-lock-only', '--ignore-scripts', '--no-audit', '--no-fund'
    ], { cwd: root, encoding: 'utf8', env });
    assert.equal(initial.status, 0, `${initial.stdout}\n${initial.stderr}`);
    const components = json(root, 'packages/components/package.json');
    components.version = version;
    write(root, 'packages/components/package.json', components);
    const releaseLock = json(root, 'package-lock.json');
    releaseLock.packages['packages/components'].version = version;
    write(root, 'package-lock.json', releaseLock);
    const workflow = read(repositoryRoot, '.github/workflows/deploy-prod.yml');
    const step = workflow.split('      - name: Align versioned Storybook components dependency\n')[1]
      .split('\n      - name: Verify Storybook components version pin')[0];
    assert.match(step, /if: needs\.prepare\.outputs\.components_version != ''/);
    const command = step.split('        run: |\n')[1].replace(/^          /gm, '');
    const before = read(root, 'package-lock.json');
    const result = spawnSync('bash', ['-c', command], { cwd: root, encoding: 'utf8', env });
    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
    assert.deepEqual(json(root, 'storybook/package.json').dependencies, {
      ...storybook.dependencies, '@massds/mds-components': version
    });
    const lock = json(root, 'package-lock.json');
    assert.equal(lock.packages.storybook.dependencies['@massds/mds-components'], version);
    assert.equal(lock.packages['packages/components'].version, version);
    assert.equal(lock.packages['node_modules/@massds/mds-components'].link, true);
    assert.deepEqual(json(root, 'packages/components/package.json'), components);
    if (version === versions.components) {
      assert.equal(read(root, 'package-lock.json'), before);
    }
    const install = spawnSync('npm', ['ci', '--ignore-scripts', '--no-audit', '--no-fund'], {
      cwd: root, encoding: 'utf8', env
    });
    assert.equal(install.status, 0, `${install.stdout}\n${install.stderr}`);
  });
}

test('the real npm pre-hook aligns dependencies before compiling changelog fragments', (t) => {
  const root = fixture(t);
  const components = json(root, 'packages/components/package.json');
  const actualScripts = json(repositoryRoot, 'packages/components/package.json').scripts;
  components.scripts = {
    'prechangelog:release': actualScripts['prechangelog:release'],
    'changelog:release': actualScripts['changelog:release']
  };
  write(root, 'packages/components/package.json', components);
  const storybook = json(root, 'storybook/package.json');
  delete storybook.dependencies.twig;
  storybook.devDependencies = {};
  write(root, 'storybook/package.json', storybook);
  mkdirSync(resolve(root, 'scripts'));
  for (const file of ['prepare-storybook-release.mjs', 'compile-package-changelog.sh']) {
    writeFileSync(resolve(root, 'scripts', file), read(repositoryRoot, `scripts/${file}`));
  }
  mkdirSync(resolve(root, 'packages/components/changelog.d'));
  writeFileSync(resolve(root, 'packages/components/CHANGELOG.md'), '# Components\n\n## Unreleased\n');
  writeFileSync(resolve(root, 'packages/components/changelog.d/release.md'), '## Added\n\n- Fixture release change.\n');
  const npmCli = process.env.npm_execpath;
  const result = spawnSync(npmCli ? process.execPath : 'npm', [
    ...(npmCli ? [npmCli] : []), 'run', 'changelog:release', '--workspace', '@massds/mds-components'
  ], {
    cwd: root, encoding: 'utf8',
    env: { ...process.env, npm_config_offline: 'true', npm_config_cache: resolve(root, 'cache') }
  });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  const lock = json(root, 'package-lock.json');
  for (const [name, version] of Object.entries(versions)) {
    assert.equal(lock.packages.storybook.dependencies[`@massds/mds-${name}`], version);
  }
  assert.match(read(root, 'packages/components/CHANGELOG.md'), /## 0\.1\.0-beta\.0 \(/);
  assert.match(read(root, 'packages/components/CHANGELOG.md'), /Fixture release change\./);
  assert.throws(() => read(root, 'packages/components/changelog.d/release.md'), { code: 'ENOENT' });
  assert(result.stdout.indexOf('Prepared Storybook release dependencies:') < result.stdout.indexOf('Compiled changelog fragments'));
});
