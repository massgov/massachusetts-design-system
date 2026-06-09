import { createIconSvgMapModule, readIconSvgMap } from '../../scripts/icon-registry.js';
import { iconDefaults } from './icon.data.js';
import { createIconRenderer } from './icon.render.js';

const sourceFiles = ['icon.data.js', 'icon.render.js', 'icon.scss', 'icon.twig'];

function createTemplateModule(templateSource) {
  return `export const iconTemplateSource = ${JSON.stringify(templateSource)};\n`;
}

function createIndexModule() {
  return `import { iconTemplateSource } from './icon.template.js';
import { iconSvgMap, iconNames } from './icon.svg.js';
import { createIconRenderer } from './icon.render.js';

export { iconTemplateSource } from './icon.template.js';
export { iconNames, iconSvgMap } from './icon.svg.js';
export * from './icon.data.js';
export * from './icon.render.js';

export const renderIcon = createIconRenderer(iconTemplateSource, iconSvgMap);
`;
}

export async function buildComponent({ copySourceFiles, readSourceFile, writeOutputFile }) {
  const templateSource = await readSourceFile('icon.twig');
  const iconSvgMap = await readIconSvgMap();
  const renderIcon = createIconRenderer(templateSource, iconSvgMap);

  await copySourceFiles(sourceFiles);
  await writeOutputFile('icon.html', `${renderIcon(iconDefaults)}\n`);
  await writeOutputFile('icon.svg.js', createIconSvgMapModule(iconSvgMap));
  await writeOutputFile('icon.template.js', createTemplateModule(templateSource));
  await writeOutputFile('index.js', createIndexModule());
}
