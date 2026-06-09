import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, '..');
const defaultIconsDir = path.resolve(packageRoot, '../assets/src/icons/static');

function normalizeSvg(svg) {
  return svg.trim();
}

function getRegularIconName(fileName) {
  return path.basename(fileName, '.svg');
}

function getBoldIconName(fileName) {
  return path.basename(fileName, '--bold.svg');
}

async function readIconFiles(dirPath, getIconName, weight) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const icons = {};

  await Promise.all(
    entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.svg'))
      .map(async (entry) => {
        const iconName = getIconName(entry.name);
        const svg = await fs.readFile(path.join(dirPath, entry.name), 'utf8');

        icons[iconName] = {
          [weight]: normalizeSvg(svg)
        };
      })
  );

  return icons;
}

export async function readIconSvgMap(iconsDir = defaultIconsDir) {
  const regularIcons = await readIconFiles(iconsDir, getRegularIconName, 'regular');
  const boldIcons = await readIconFiles(path.join(iconsDir, 'bold'), getBoldIconName, 'bold');
  const iconNames = Array.from(
    new Set([...Object.keys(regularIcons), ...Object.keys(boldIcons)])
  ).sort();

  return Object.fromEntries(
    iconNames.map((iconName) => [
      iconName,
      {
        ...regularIcons[iconName],
        ...boldIcons[iconName]
      }
    ])
  );
}

export function getIconNames(iconSvgMap) {
  return Object.keys(iconSvgMap).sort();
}

export function createIconNamesModule(iconSvgMap) {
  return `export const iconNames = Object.freeze(${JSON.stringify(getIconNames(iconSvgMap), null, 2)});\n`;
}

export function createIconSvgMapModule(iconSvgMap) {
  return `export const iconSvgMap = ${JSON.stringify(iconSvgMap, null, 2)};\n\nexport const iconNames = Object.freeze(${JSON.stringify(getIconNames(iconSvgMap), null, 2)});\n`;
}
