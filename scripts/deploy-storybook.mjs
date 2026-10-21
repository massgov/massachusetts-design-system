import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const retentionMs = 7 * 24 * 60 * 60 * 1000;
const stateName = '_deployment/retired-assets.json';

export function planRetention(remoteKeys, currentKeys, previous, now) {
  const current = new Set(currentKeys);
  const retired = {};
  const expired = [];
  for (const key of remoteKeys) {
    if (!key.startsWith('assets/') || key.includes('..')) throw new Error(`Invalid asset key: ${key}`);
    if (current.has(key)) continue;
    const since = previous[key] ?? now;
    if (!Number.isFinite(since) || since > now) throw new Error(`Invalid retirement timestamp: ${key}`);
    retired[key] = since;
    if (now - since >= retentionMs) expired.push(key);
  }
  return { retired, expired };
}

function filesUnder(directory, prefix = '') {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const name = prefix + entry.name;
    if (entry.isSymbolicLink()) throw new Error(`Unexpected symlink: ${name}`);
    return entry.isDirectory() ? filesUnder(join(directory, entry.name), `${name}/`) : [name];
  });
}

function aws(args) {
  return execFileSync('aws', [...args, '--no-cli-pager'], {
    encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'], maxBuffer: 32 * 1024 * 1024
  });
}

export function deployStorybook({ directory, bucket, prefix = '', run = aws, now = Date.now() }) {
  if (!bucket || !/^[a-z0-9][a-z0-9.-]+$/.test(bucket)) throw new Error('A valid S3 bucket is required');
  if (prefix && (!/^(branch|version)\/[A-Za-z0-9._+/-]+$/.test(prefix) || prefix.split('/').some((part) => !part || part === '.' || part === '..'))) {
    throw new Error('Invalid deployment prefix');
  }
  directory = resolve(directory);
  const files = filesUnder(directory);
  for (const required of ['index.html', 'iframe.html', 'index.json']) {
    if (!files.includes(required)) throw new Error(`Build is missing ${required}`);
  }
  if (files.some((file) => /^(branch|version|_deployment)\//.test(file))) {
    throw new Error('Build contains a reserved deployment directory');
  }
  const current = files.filter((file) => file.startsWith('assets/'));
  if (!current.length) throw new Error('Build has no assets');
  const keyPrefix = prefix ? `${prefix}/` : '';
  const destination = `s3://${bucket}/${keyPrefix}`;
  const list = (objectPrefix) => JSON.parse(run([
    's3api', 'list-objects-v2', '--bucket', bucket, '--prefix', `${keyPrefix}${objectPrefix}`, '--output', 'json'
  ])).Contents ?? [];
  const temporary = mkdtempSync(join(tmpdir(), 'storybook-deploy-'));
  try {
    const stateFile = join(temporary, 'retired-assets.json');
    let previous = {};
    if (list(stateName).some((object) => object.Key === keyPrefix + stateName)) {
      run(['s3api', 'get-object', '--bucket', bucket, '--key', keyPrefix + stateName, stateFile]);
      previous = JSON.parse(readFileSync(stateFile, 'utf8'));
      if (!previous || typeof previous !== 'object' || Array.isArray(previous)) throw new Error('Invalid retention state');
    }
    const remote = list('assets/').map((object) => {
      if (!object.Key.startsWith(keyPrefix)) throw new Error('Asset outside deployment prefix');
      return object.Key.slice(keyPrefix.length);
    });
    const { retired, expired } = planRetention(remote, current, previous, now);

    // Separate hashed assets from fixed filenames so only immutable URLs get a year-long TTL.
    for (const group of ['immutable', 'mutable']) mkdirSync(join(temporary, group));
    for (const file of current) {
      const group = /-[A-Za-z0-9_-]{8}\.(js|css)$/.test(file) ? 'immutable' : 'mutable';
      const target = join(temporary, group, file);
      mkdirSync(dirname(target), { recursive: true });
      cpSync(join(directory, file), target);
    }
    for (const group of ['immutable', 'mutable']) {
      if (!existsSync(join(temporary, group, 'assets'))) continue;
      run(['s3', 'cp', join(temporary, group) + '/', destination, '--recursive',
        '--cache-control', group === 'immutable' ? 'public,max-age=31536000,immutable' : 'no-cache', '--only-show-errors']);
    }
    // Copy all supporting files before publishing HTML. No broad --delete: older
    // chunks, branch previews and versioned releases must remain available.
    run(['s3', 'cp', directory + '/', destination, '--recursive', '--exclude', 'assets/*',
      '--exclude', '*.html', '--cache-control', 'no-cache', '--only-show-errors']);
    run(['s3', 'cp', directory + '/', destination, '--recursive', '--exclude', '*',
      '--include', '*.html', '--cache-control', 'no-cache', '--only-show-errors']);

    // Start the retention clock when a chunk leaves the active build, rather than
    // using S3 LastModified (which might already be months old). First deployment
    // safely adopts existing assets; a failed publish never triggers cleanup.
    writeFileSync(stateFile, JSON.stringify(retired));
    run(['s3', 'cp', stateFile, destination + stateName, '--content-type', 'application/json',
      '--cache-control', 'no-store', '--only-show-errors']);
    for (let offset = 0; offset < expired.length; offset += 1000) {
      const deletionFile = join(temporary, 'delete.json');
      writeFileSync(deletionFile, JSON.stringify({
        Objects: expired.slice(offset, offset + 1000).map((key) => ({ Key: keyPrefix + key })), Quiet: true
      }));
      const result = JSON.parse(run(['s3api', 'delete-objects', '--bucket', bucket, '--delete', `file://${deletionFile}`, '--output', 'json']));
      if (result.Errors?.length) throw new Error(`Asset cleanup failed: ${JSON.stringify(result.Errors)}`);
    }
    console.log(`Published ${destination}; retained ${Object.keys(retired).length - expired.length} retired assets; removed ${expired.length}.`);
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  deployStorybook({ directory: process.argv[2] ?? 'storybook/storybook-static', bucket: process.env.SITE_BUCKET, prefix: process.env.S3_PREFIX ?? '' });
}
