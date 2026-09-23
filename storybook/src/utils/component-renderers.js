import { normalizeIconSvg } from '../../../packages/components/src/icon/icon-svg.js';
import {
  getComponentNameFromTemplateId,
  getModuleContext,
  getRendererContextOptions,
  isSharedTemplateId,
  getStaticIncludeTemplateIds,
  getTemplateId
} from '../../../packages/components/src/shared/component-context.js';
import { createTwigRenderer } from '../../../packages/components/src/shared/twig-renderer.js';

const componentTemplateModules = import.meta.glob('../../../packages/components/src/*/*.twig', {
  eager: true,
  import: 'default',
  query: '?raw'
});

const sharedTemplateModules = import.meta.glob('../../../packages/components/src/shared/*.twig', {
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
const sharedTemplates = Object.fromEntries(
  Object.entries(sharedTemplateModules).map(([filePath, templateSource]) => [
    `shared/${filePath.split('/').pop()}`,
    templateSource
  ])
);

function getTemplateSource(componentName) {
  const templateSource = componentTemplates[componentName];

  if (typeof templateSource !== 'string') {
    throw new Error(`Missing Twig source for component "${componentName}".`);
  }

  return templateSource;
}

function getTemplateSourceById(templateId) {
  if (isSharedTemplateId(templateId)) {
    const templateSource = sharedTemplates[templateId];

    if (typeof templateSource !== 'string') {
      throw new Error(`Missing Twig source for template "${templateId}".`);
    }

    return templateSource;
  }

  return getTemplateSource(getComponentNameFromTemplateId(templateId));
}

function getDataModule(componentName) {
  return dataModules[componentName] ?? {};
}

function getIncludedComponentName(templateId) {
  return isSharedTemplateId(templateId)
    ? null
    : getComponentNameFromTemplateId(templateId);
}

function getIncludedComponentContext(componentName, seenTemplateIds = new Set()) {
  return getIncludedTemplateContext(getTemplateId(componentName), seenTemplateIds);
}

function getIncludedTemplateContext(templateId, seenTemplateIds) {
  const includes = {};
  const dataContext = {};

  seenTemplateIds.add(templateId);

  for (const includedTemplateId of getStaticIncludeTemplateIds(getTemplateSourceById(templateId))) {
    if (seenTemplateIds.has(includedTemplateId)) {
      continue;
    }

    seenTemplateIds.add(includedTemplateId);

    const includedComponentName = getIncludedComponentName(includedTemplateId);
    const nestedContext = getIncludedTemplateContext(includedTemplateId, seenTemplateIds);

    Object.assign(includes, nestedContext.includes, {
      [includedTemplateId]: getTemplateSourceById(includedTemplateId)
    });
    Object.assign(
      dataContext,
      nestedContext.dataContext,
      includedComponentName === null ? {} : getModuleContext(getDataModule(includedComponentName))
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
export const renderActionLink = createComponentRenderer('action-link', { iconSvgMap });
export const renderButton = createComponentRenderer('button', { iconSvgMap });
export const renderIconButton = createComponentRenderer('icon-button', { iconSvgMap });
export const renderMenu = createComponentRenderer('menu', { iconSvgMap });
export const renderFooter = createComponentRenderer('footer', { iconSvgMap });
export const renderSiteHeader = createComponentRenderer('site-header');
export const renderStateBanner = createComponentRenderer('state-banner', { iconSvgMap });
export const renderStateSeal = createComponentRenderer('state-seal');
export const renderUtilityNav = createComponentRenderer('utility-nav', { iconSvgMap });
