import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const Twig = require('twig');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, '..');
const srcRoot = path.join(packageRoot, 'src');
const distRoot = path.join(packageRoot, 'dist');

const buttonDefaults = {
  ariaLabel: '',
  disabled: false,
  fullWidth: false,
  id: '',
  label: 'Button',
  type: 'button',
  variant: 'primary'
};

function normalizeButtonProps(props = {}) {
  const variant = ['primary', 'secondary'].includes(props.variant)
    ? props.variant
    : buttonDefaults.variant;
  const type = ['button', 'submit', 'reset'].includes(props.type)
    ? props.type
    : buttonDefaults.type;

  return {
    ...buttonDefaults,
    ...props,
    label: props.label || buttonDefaults.label,
    type,
    variant
  };
}

function createRenderModule(templateSource) {
  return `import Twig from 'twig';
export { initMdsButtons } from './button.js';

const templateSource = ${JSON.stringify(templateSource)};
const buttonTemplate = Twig.twig({ data: templateSource });
const buttonDefaults = ${JSON.stringify(buttonDefaults, null, 2)};

function normalizeButtonProps(props = {}) {
  const variant = ['primary', 'secondary'].includes(props.variant)
    ? props.variant
    : buttonDefaults.variant;
  const type = ['button', 'submit', 'reset'].includes(props.type)
    ? props.type
    : buttonDefaults.type;

  return {
    ...buttonDefaults,
    ...props,
    label: props.label || buttonDefaults.label,
    type,
    variant
  };
}

export function renderButton(props = {}) {
  return buttonTemplate.render(normalizeButtonProps(props));
}

export { buttonDefaults, templateSource as buttonTemplateSource };
`;
}

async function copyFile(source, destination) {
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.copyFile(source, destination);
}

async function buildButton() {
  const componentName = 'button';
  const sourceDir = path.join(srcRoot, componentName);
  const outputDir = path.join(distRoot, componentName);
  const templateSource = await fs.readFile(path.join(sourceDir, 'button.twig'), 'utf8');
  const template = Twig.twig({ data: templateSource });

  await fs.mkdir(outputDir, { recursive: true });
  await copyFile(path.join(sourceDir, 'button.css'), path.join(outputDir, 'button.css'));
  await copyFile(path.join(sourceDir, 'button.js'), path.join(outputDir, 'button.js'));
  await copyFile(path.join(sourceDir, 'button.twig'), path.join(outputDir, 'button.twig'));

  await fs.writeFile(
    path.join(outputDir, 'button.html'),
    `${template.render(normalizeButtonProps())}\n`,
    'utf8'
  );
  await fs.writeFile(path.join(outputDir, 'index.js'), createRenderModule(templateSource), 'utf8');
}

async function build() {
  await fs.rm(distRoot, { recursive: true, force: true });
  await buildButton();
  await fs.copyFile(path.join(distRoot, 'button', 'button.css'), path.join(distRoot, 'index.css'));
  await fs.writeFile(path.join(distRoot, 'index.js'), "export * from './button/index.js';\n", 'utf8');
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
