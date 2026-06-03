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
const buttonTypes = ['Fill', 'Outline', 'Ghost'];
const buttonColors = ['Primary', 'Secondary', 'Light', 'Danger'];
const buttonSizes = ['Regular', 'LG'];
const buttonIcons = ['', 'arrow-right'];
const htmlButtonTypes = ['button', 'submit', 'reset'];

const buttonDefaults = {
  ariaLabel: '',
  color: 'Primary',
  disabled: false,
  htmlType: 'button',
  id: '',
  leftIcon: '',
  rightIcon: 'arrow-right',
  size: 'LG',
  text: 'Button',
  type: 'Fill'
};

function normalizeOption(value, options, fallback) {
  if (typeof value !== 'string') {
    return fallback;
  }

  const match = options.find((option) => option.toLowerCase() === value.toLowerCase());

  return match === undefined ? fallback : match;
}

function getLegacyVariantDefaults(variant) {
  if (variant === 'secondary') {
    return {
      color: 'Primary',
      size: buttonDefaults.size,
      type: 'Outline'
    };
  }

  return {
    color: buttonDefaults.color,
    size: buttonDefaults.size,
    type: buttonDefaults.type
  };
}

function normalizeButtonProps(props = {}) {
  const legacyVariantDefaults = getLegacyVariantDefaults(props.variant);
  const legacyHtmlType = htmlButtonTypes.includes(props.type) ? props.type : '';
  const htmlType = htmlButtonTypes.includes(props.htmlType)
    ? props.htmlType
    : legacyHtmlType || buttonDefaults.htmlType;
  const type = normalizeOption(
    legacyHtmlType ? legacyVariantDefaults.type : props.type,
    buttonTypes,
    legacyVariantDefaults.type
  );
  const color = normalizeOption(props.color, buttonColors, legacyVariantDefaults.color);
  const size = normalizeOption(props.size, buttonSizes, legacyVariantDefaults.size);
  const leftIcon = normalizeOption(props.leftIcon, buttonIcons, buttonDefaults.leftIcon);
  const rightIcon = normalizeOption(props.rightIcon, buttonIcons, buttonDefaults.rightIcon);

  return {
    ...buttonDefaults,
    ...props,
    color,
    htmlType,
    leftIcon,
    rightIcon,
    size,
    text: props.text || props.label || buttonDefaults.text,
    type
  };
}

function createRenderModule(templateSource) {
  return `import Twig from 'twig';
export { initMdsButtons } from './button.js';

const templateSource = ${JSON.stringify(templateSource)};
const buttonTemplate = Twig.twig({ data: templateSource });
const buttonTypes = ${JSON.stringify(buttonTypes)};
const buttonColors = ${JSON.stringify(buttonColors)};
const buttonSizes = ${JSON.stringify(buttonSizes)};
const buttonIcons = ${JSON.stringify(buttonIcons)};
const htmlButtonTypes = ${JSON.stringify(htmlButtonTypes)};
const buttonDefaults = ${JSON.stringify(buttonDefaults, null, 2)};

function normalizeOption(value, options, fallback) {
  if (typeof value !== 'string') {
    return fallback;
  }

  const match = options.find((option) => option.toLowerCase() === value.toLowerCase());

  return match === undefined ? fallback : match;
}

function getLegacyVariantDefaults(variant) {
  if (variant === 'secondary') {
    return {
      color: 'Primary',
      size: buttonDefaults.size,
      type: 'Outline'
    };
  }

  return {
    color: buttonDefaults.color,
    size: buttonDefaults.size,
    type: buttonDefaults.type
  };
}

function normalizeButtonProps(props = {}) {
  const legacyVariantDefaults = getLegacyVariantDefaults(props.variant);
  const legacyHtmlType = htmlButtonTypes.includes(props.type) ? props.type : '';
  const htmlType = htmlButtonTypes.includes(props.htmlType)
    ? props.htmlType
    : legacyHtmlType || buttonDefaults.htmlType;
  const type = normalizeOption(
    legacyHtmlType ? legacyVariantDefaults.type : props.type,
    buttonTypes,
    legacyVariantDefaults.type
  );
  const color = normalizeOption(props.color, buttonColors, legacyVariantDefaults.color);
  const size = normalizeOption(props.size, buttonSizes, legacyVariantDefaults.size);
  const leftIcon = normalizeOption(props.leftIcon, buttonIcons, buttonDefaults.leftIcon);
  const rightIcon = normalizeOption(props.rightIcon, buttonIcons, buttonDefaults.rightIcon);

  return {
    ...buttonDefaults,
    ...props,
    color,
    htmlType,
    leftIcon,
    rightIcon,
    size,
    text: props.text || props.label || buttonDefaults.text,
    type
  };
}

export function renderButton(props = {}) {
  return buttonTemplate.render(normalizeButtonProps(props));
}

export {
  buttonColors,
  buttonDefaults,
  buttonIcons,
  buttonSizes,
  buttonTypes,
  htmlButtonTypes,
  templateSource as buttonTemplateSource
};
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
