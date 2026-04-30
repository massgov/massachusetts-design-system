const path = require('path');

const packageRoot = path.resolve(__dirname, '..');
const distDir = path.join(packageRoot, 'dist');
const srcDir = path.join(packageRoot, 'src');

const sassEntries = [
  ['colors.scss', 'colors.css'],
  ['components.scss', 'components.css'],
  ['index.scss', 'index.css'],
  ['helpers.scss', 'helpers.css'],
  ['utilities.scss', 'utilities.css']
];

function getSassBin() {
  const sassEntry = require.resolve('sass');
  return path.join(path.dirname(sassEntry), 'sass.js');
}

module.exports = {
  distDir,
  getSassBin,
  packageRoot,
  sassEntries,
  srcDir
};
