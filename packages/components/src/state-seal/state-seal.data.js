import packageConfig from '../../package.json' with { type: 'json' };
import { getSchemaDefaults, getSchemaOptions } from '../shared/schema.js';
import { stateSealSchema } from './state-seal.schema.js';

export { stateSealSchema } from './state-seal.schema.js';

const cdnOrigin = 'https://unpkg.com';
const stateSealAssetNames = {
  white: 'state-seal-white.png',
  black: 'state-seal-black.png',
  gray: 'state-seal-gray.png',
  color: 'state-seal-color.png'
};

function normalizeDependencyVersion(packageName, rawVersion) {
  const normalizedVersion = rawVersion.trim().replace(/^workspace:/, '');
  const versionMatch = normalizedVersion.match(
    /^[~^=v]*(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?)$/
  );

  if (!versionMatch) {
    throw new Error(
      `${packageName} must use an exact, caret, or tilde semver in devDependencies to build CDN URLs. Received: ${rawVersion}`
    );
  }

  return versionMatch[1];
}

function getDependencyVersion(packageName) {
  const rawVersion = packageConfig.devDependencies?.[packageName];

  if (!rawVersion) {
    throw new Error(`${packageName} is referenced in the state seal component but is missing from devDependencies.`);
  }

  return normalizeDependencyVersion(packageName, rawVersion);
}

function toCdnUrl(packageName, assetPath) {
  return `${cdnOrigin}/${packageName}@${getDependencyVersion(packageName)}/${assetPath}`;
}

const stateSealAssetBaseUrl = toCdnUrl('@massds/mds-assets', 'dist/state-seal');
const stateSealOptions = getSchemaOptions(stateSealSchema);

export const stateSealAssetSrcs = Object.fromEntries(
  Object.entries(stateSealAssetNames).map(([variant, fileName]) => [
    variant,
    `${stateSealAssetBaseUrl}/${fileName}`
  ])
);

export const stateSealVariants = stateSealOptions.variant;
export const stateSealDefaults = getSchemaDefaults(stateSealSchema);
