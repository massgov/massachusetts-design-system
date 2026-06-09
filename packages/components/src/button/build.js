import { buttonDefaults } from './button.data.js';
import { createButtonRenderer } from './button.render.js';
import { readIconSvgMap } from '../../scripts/icon-registry.js';
import { createIconRenderer } from '../icon/icon.render.js';

const sourceFiles = ['button.data.js', 'button.js', 'button.render.js', 'button.scss', 'button.twig'];

function createTemplateModule(templateSource) {
  return `export const buttonTemplateSource = ${JSON.stringify(templateSource)};\n`;
}

function createIndexModule() {
  return `import { buttonTemplateSource } from './button.template.js';
import { createButtonRenderer } from './button.render.js';
import { renderIcon } from '../icon/index.js';

export { initMdsButtons } from './button.js';
export { buttonTemplateSource } from './button.template.js';
export * from './button.data.js';
export * from './button.render.js';

export const renderButton = createButtonRenderer(buttonTemplateSource, { renderIcon });
`;
}

export async function buildComponent({ copySourceFiles, readSourceFile, writeOutputFile }) {
  const templateSource = await readSourceFile('button.twig');
  const iconTemplateSource = await readSourceFile('../icon/icon.twig');
  const iconSvgMap = await readIconSvgMap();
  const renderIcon = createIconRenderer(iconTemplateSource, iconSvgMap);
  const renderButton = createButtonRenderer(templateSource, { renderIcon });

  await copySourceFiles(sourceFiles);
  await writeOutputFile('button.html', `${renderButton(buttonDefaults)}\n`);
  await writeOutputFile('button.template.js', createTemplateModule(templateSource));
  await writeOutputFile('index.js', createIndexModule());
}
