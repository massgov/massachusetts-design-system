const path = require('path');

const packageRoot = path.resolve(__dirname, '..');
const distDir = path.join(packageRoot, 'dist');
const cssDistDir = path.join(distDir, 'css');
const scssDistDir = path.join(distDir, 'scss');
const srcDir = path.join(packageRoot, 'src');

const cssEntries = [['class-generators/index.scss', 'index.css']];

function getSassBin() {
  const sassEntry = require.resolve('sass');
  return path.join(path.dirname(sassEntry), 'sass.js');
}

function getWorkspacePackageRoot(packageName) {
  const packageJsonPath = require.resolve(`${packageName}/package.json`, {
    paths: [packageRoot]
  });

  return path.dirname(packageJsonPath);
}

module.exports = {
  cssDistDir,
  cssEntries,
  distDir,
  getSassBin,
  getWorkspacePackageRoot,
  packageRoot,
  scssDistDir,
  srcDir
};
