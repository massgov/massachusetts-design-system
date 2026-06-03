import { buttonDefaults } from './button.data.js';
import { createButtonRenderer } from './button.render.js';

const sourceFiles = ['button.css', 'button.data.js', 'button.js', 'button.render.js', 'button.twig'];

function createTemplateModule(templateSource) {
  return `export const buttonTemplateSource = ${JSON.stringify(templateSource)};\n`;
}

function createIndexModule() {
  return `import { buttonTemplateSource } from './button.template.js';
import { createButtonRenderer } from './button.render.js';

export { initMdsButtons } from './button.js';
export { buttonTemplateSource } from './button.template.js';
export * from './button.data.js';
export * from './button.render.js';

export const renderButton = createButtonRenderer(buttonTemplateSource);
`;
}

export async function buildComponent({ copySourceFiles, readSourceFile, writeOutputFile }) {
  const templateSource = await readSourceFile('button.twig');
  const renderButton = createButtonRenderer(templateSource);

  await copySourceFiles(sourceFiles);
  await writeOutputFile('button.html', `${renderButton(buttonDefaults)}\n`);
  await writeOutputFile('button.template.js', createTemplateModule(templateSource));
  await writeOutputFile('index.js', createIndexModule());
}
