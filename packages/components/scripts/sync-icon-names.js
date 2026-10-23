import fs from 'node:fs/promises';
import { createIconNamesModule, getIconNames, readIconSvgMap } from './icon-registry.js';

const outputFile = new URL('../src/icon/icon.names.js', import.meta.url);
const iconSvgMap = await readIconSvgMap();
const contents = createIconNamesModule(iconSvgMap);

await fs.writeFile(outputFile, contents, 'utf8');

console.log(`Synced ${getIconNames(iconSvgMap).length} icon names to src/icon/icon.names.js`);
