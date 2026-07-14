import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  getComponentDefaults,
  getComponentNameFromTemplateId,
  getModuleContext,
  getRendererContextOptions,
  getStaticIncludeTemplateIds,
  getTemplateId,
  toPascalCase
} from '../src/shared/component-context.js';
import { createTwigRenderer } from '../src/shared/twig-renderer.js';

function getDefaultSourceFiles(componentName) {
  return [`${componentName}.twig`];
}

function getRendererFactoryName(componentName) {
  return `create${toPascalCase(componentName)}Renderer`;
}

function createIncludedComponent(templateId) {
  return {
    componentName: getComponentNameFromTemplateId(templateId),
    templateId
  };
}

function getIncludedComponents(templateSource) {
  const includedComponents = new Map();

  for (const templateId of getStaticIncludeTemplateIds(templateSource)) {
    const includedComponent = createIncludedComponent(templateId);

    includedComponents.set(includedComponent.templateId, includedComponent);
  }

  return Array.from(includedComponents.values());
}

async function importModule(filePath) {
  return import(pathToFileURL(filePath).href);
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function getComponentDataModule(componentName, sourceDir) {
  const dataModulePath = path.join(sourceDir, `${componentName}.data.js`);

  if (!(await pathExists(dataModulePath))) {
    return {};
  }

  return importModule(dataModulePath);
}

async function getRendererFactory(componentName, sourceDir) {
  const renderModulePath = path.join(sourceDir, `${componentName}.render.js`);

  if (!(await pathExists(renderModulePath))) {
    return null;
  }

  const renderModule = await importModule(renderModulePath);
  const rendererFactoryName = getRendererFactoryName(componentName);
  const rendererFactory = renderModule[rendererFactoryName];

  if (typeof rendererFactory !== 'function') {
    throw new Error(`${componentName}.render.js must export ${rendererFactoryName}().`);
  }

  return rendererFactory;
}

async function createDefaultRenderer({
  baseContext,
  componentName,
  rendererOptions,
  sourceDir,
  templateSource
}) {
  const rendererFactory = await getRendererFactory(componentName, sourceDir);

  if (rendererFactory) {
    return rendererFactory(templateSource, rendererOptions);
  }

  const { includes = {}, templateId = getTemplateId(componentName) } = rendererOptions;
  const baseRendererContext = {
    ...baseContext,
    ...getRendererContextOptions(rendererOptions)
  };

  return createTwigRenderer(templateSource, (data = {}) => ({
    ...baseRendererContext,
    ...data
  }), {
    includes,
    templateId
  });
}

async function getComponentBuildModule(sourceDir) {
  const buildModulePath = path.join(sourceDir, 'build.js');

  if (!(await pathExists(buildModulePath))) {
    return null;
  }

  return importModule(buildModulePath);
}

async function getOwnRendererOptions(getRendererOptions, buildContext) {
  if (typeof getRendererOptions !== 'function') {
    return {};
  }

  return getRendererOptions(buildContext);
}

async function getIncludedComponentContext(buildContext, seenTemplateIds = new Set()) {
  const includes = {};
  const rendererOptions = {};
  const dataContext = {};
  const currentTemplateId = getTemplateId(buildContext.componentName);

  seenTemplateIds.add(currentTemplateId);

  for (const includedComponent of getIncludedComponents(buildContext.templateSource)) {
    if (seenTemplateIds.has(includedComponent.templateId)) {
      continue;
    }

    seenTemplateIds.add(includedComponent.templateId);

    const includedSourceDir = path.resolve(buildContext.sourceDir, '..', includedComponent.componentName);
    const includedTemplateSource = await buildContext.readSourceFile(`../${includedComponent.componentName}/${includedComponent.componentName}.twig`);
    const includedBuildModule = await getComponentBuildModule(includedSourceDir);
    const includedDataModule = await getComponentDataModule(includedComponent.componentName, includedSourceDir);
    const includedBuildContext = {
      ...buildContext,
      componentName: includedComponent.componentName,
      sourceDir: includedSourceDir,
      templateSource: includedTemplateSource
    };
    const nestedContext = await getIncludedComponentContext(
      includedBuildContext,
      seenTemplateIds
    );

    Object.assign(includes, nestedContext.includes, {
      [includedComponent.templateId]: includedTemplateSource
    });
    Object.assign(
      rendererOptions,
      nestedContext.rendererOptions,
      await getOwnRendererOptions(includedBuildModule?.getRendererOptions, includedBuildContext)
    );
    Object.assign(
      dataContext,
      nestedContext.dataContext,
      getModuleContext(includedDataModule)
    );
  }

  return {
    includes,
    rendererOptions,
    dataContext
  };
}

async function getRendererContext(createRenderer, buildContext) {
  const rendererContext = await createRenderer(buildContext);

  if (typeof rendererContext === 'function') {
    return {
      renderComponent: rendererContext
    };
  }

  if (typeof rendererContext?.renderComponent !== 'function') {
    throw new Error('createRenderer must return a render function or an object with renderComponent.');
  }

  return rendererContext;
}

export function createComponentBuild({
  componentName,
  createRenderer = createDefaultRenderer,
  defaults,
  getRendererOptions,
  sourceFiles = getDefaultSourceFiles(componentName),
  writeAdditionalOutputs = async () => {}
}) {
  return async function buildComponent(context) {
    const templateSource = await context.readSourceFile(`${componentName}.twig`);
    const ownDataModule = await getComponentDataModule(componentName, context.sourceDir);
    const buildContext = {
      ...context,
      componentName,
      templateSource
    };
    const includedContext = await getIncludedComponentContext(
      buildContext
    );
    const rendererOptions = {
      includes: includedContext.includes,
      ...includedContext.rendererOptions,
      ...(await getOwnRendererOptions(getRendererOptions, buildContext))
    };
    const componentDefaults = defaults ?? getComponentDefaults(componentName, ownDataModule);
    const rendererContext = await getRendererContext(createRenderer, {
      ...buildContext,
      baseContext: {
        ...includedContext.dataContext,
        ...getModuleContext(ownDataModule)
      },
      rendererOptions
    });

    await context.copySourceFiles(sourceFiles);
    await context.writeOutputFile(`${componentName}.html`, rendererContext.renderComponent(componentDefaults));
    await writeAdditionalOutputs({
      ...context,
      componentName,
      defaults: componentDefaults,
      rendererContext,
      renderComponent: rendererContext.renderComponent,
      templateSource
    });
  };
}
