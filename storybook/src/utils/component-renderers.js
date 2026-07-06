import { normalizeIconSvg } from '../../../packages/components/src/icon/icon-svg.js';
import {
  getComponentNameFromTemplateId,
  getModuleContext,
  getRendererContextOptions,
  getStaticIncludeTemplateIds,
  getTemplateId
} from '../../../packages/components/src/shared/component-context.js';
import { createTwigRenderer } from '../../../packages/components/src/shared/twig-renderer.js';

const componentTemplateModules = import.meta.glob('../../../packages/components/src/*/*.twig', {
  eager: true,
  import: 'default',
  query: '?raw'
});

const componentDataModules = import.meta.glob('../../../packages/components/src/*/*.data.js', {
  eager: true
});

const regularIconSvgs = import.meta.glob('../../../packages/assets/src/icons/static/*.svg', {
  eager: true,
  import: 'default',
  query: '?raw'
});

const boldIconSvgs = import.meta.glob('../../../packages/assets/src/icons/static/bold/*.svg', {
  eager: true,
  import: 'default',
  query: '?raw'
});

function getComponentName(filePath) {
  const pathParts = filePath.split('/');

  return pathParts[pathParts.length - 2];
}

function createComponentMap(globResult) {
  return Object.fromEntries(
    Object.entries(globResult).map(([filePath, moduleValue]) => [
      getComponentName(filePath),
      moduleValue
    ])
  );
}

const componentTemplates = createComponentMap(componentTemplateModules);
const dataModules = createComponentMap(componentDataModules);

function getTemplateSource(componentName) {
  const templateSource = componentTemplates[componentName];

  if (typeof templateSource !== 'string') {
    throw new Error(`Missing Twig source for component "${componentName}".`);
  }

  return templateSource;
}

function getDataModule(componentName) {
  return dataModules[componentName] ?? {};
}

function getIncludedComponentContext(componentName, seenTemplateIds = new Set()) {
  const includes = {};
  const dataContext = {};
  const templateId = getTemplateId(componentName);

  seenTemplateIds.add(templateId);

  for (const includedTemplateId of getStaticIncludeTemplateIds(getTemplateSource(componentName))) {
    if (seenTemplateIds.has(includedTemplateId)) {
      continue;
    }

    seenTemplateIds.add(includedTemplateId);

    const includedComponentName = getComponentNameFromTemplateId(includedTemplateId);
    const nestedContext = getIncludedComponentContext(includedComponentName, seenTemplateIds);

    Object.assign(includes, nestedContext.includes, {
      [includedTemplateId]: getTemplateSource(includedComponentName)
    });
    Object.assign(
      dataContext,
      nestedContext.dataContext,
      getModuleContext(getDataModule(includedComponentName))
    );
  }

  return {
    includes,
    dataContext
  };
}

export function createComponentRenderer(componentName, options = {}) {
  const templateSource = getTemplateSource(componentName);
  const includedContext = getIncludedComponentContext(componentName);
  const { includes = {}, templateId = getTemplateId(componentName) } = options;
  const baseContext = {
    ...includedContext.dataContext,
    ...getModuleContext(getDataModule(componentName)),
    ...getRendererContextOptions(options)
  };

  return createTwigRenderer(templateSource, (data = {}) => ({
    ...baseContext,
    ...data
  }), {
    includes: {
      ...includedContext.includes,
      ...includes
    },
    templateId
  });
}

function getIconName(filePath) {
  return filePath
    .split('/')
    .pop()
    .replace(/--bold\.svg$/, '')
    .replace(/\.svg$/, '');
}

function addIconSvg(iconSvgMap, filePath, svg, weight) {
  const iconName = getIconName(filePath);

  iconSvgMap[iconName] = {
    ...iconSvgMap[iconName],
    [weight]: normalizeIconSvg(svg)
  };
}

function createIconSvgMap() {
  const iconSvgMap = {};

  for (const [filePath, svg] of Object.entries(regularIconSvgs)) {
    addIconSvg(iconSvgMap, filePath, svg, 'regular');
  }

  for (const [filePath, svg] of Object.entries(boldIconSvgs)) {
    addIconSvg(iconSvgMap, filePath, svg, 'bold');
  }

  return iconSvgMap;
}

export const iconSvgMap = createIconSvgMap();
export const renderIcon = createComponentRenderer('icon', { iconSvgMap });
export const renderButton = createComponentRenderer('button', { iconSvgMap });
export const renderInputGroup = createComponentRenderer('input-group', { iconSvgMap });
export const renderStateBanner = createComponentRenderer('state-banner', { iconSvgMap });
export const renderStateSeal = createComponentRenderer('state-seal');
