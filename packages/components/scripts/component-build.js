import path from 'node:path';
import { pathToFileURL } from 'node:url';

function getDefaultSourceFiles(componentName) {
  return [`${componentName}.twig`];
}

function toIdentifier(value) {
  return value.replace(/-([a-z0-9])/g, (_, character) => character.toUpperCase());
}

function toPascalCase(value) {
  const identifier = toIdentifier(value);

  return `${identifier.charAt(0).toUpperCase()}${identifier.slice(1)}`;
}

function getRendererFactoryName(componentName) {
  return `create${toPascalCase(componentName)}Renderer`;
}

function normalizeIncludedComponent(includedComponent) {
  if (typeof includedComponent === 'string') {
    return {
      componentName: includedComponent,
      templateId: `${includedComponent}.twig`
    };
  }

  return {
    ...includedComponent,
    templateId: includedComponent.templateId ?? `${includedComponent.componentName}.twig`
  };
}

async function importModule(filePath) {
  return import(pathToFileURL(filePath).href);
}

async function getRendererFactory(componentName, sourceDir) {
  const renderModule = await importModule(path.join(sourceDir, `${componentName}.render.js`));
  const rendererFactoryName = getRendererFactoryName(componentName);
  const rendererFactory = renderModule[rendererFactoryName];

  if (typeof rendererFactory !== 'function') {
    throw new Error(`${componentName}.render.js must export ${rendererFactoryName}().`);
  }

  return rendererFactory;
}

async function createDefaultRenderer({ componentName, rendererOptions, sourceDir, templateSource }) {
  const rendererFactory = await getRendererFactory(componentName, sourceDir);

  return rendererFactory(templateSource, rendererOptions);
}

async function getComponentBuildModule(componentName, sourceDir) {
  return importModule(path.join(sourceDir, 'build.js'));
}

async function getOwnRendererOptions(getRendererOptions, buildContext) {
  if (typeof getRendererOptions !== 'function') {
    return {};
  }

  return getRendererOptions(buildContext);
}

async function getIncludedComponentContext(includeComponents, buildContext) {
  const includes = {};
  const rendererOptions = {};

  for (const includedComponent of includeComponents) {
    const included = normalizeIncludedComponent(includedComponent);
    const includedSourceDir = path.resolve(buildContext.sourceDir, '..', included.componentName);
    const includedTemplateSource = await buildContext.readSourceFile(`../${included.componentName}/${included.componentName}.twig`);
    const includedBuildModule = await getComponentBuildModule(included.componentName, includedSourceDir);
    const includedBuildContext = {
      ...buildContext,
      componentName: included.componentName,
      sourceDir: includedSourceDir,
      templateSource: includedTemplateSource
    };
    const nestedContext = await getIncludedComponentContext(
      includedBuildModule.includeComponents ?? [],
      includedBuildContext
    );

    Object.assign(includes, nestedContext.includes, {
      [included.templateId]: includedTemplateSource
    });
    Object.assign(
      rendererOptions,
      nestedContext.rendererOptions,
      await getOwnRendererOptions(includedBuildModule.getRendererOptions, includedBuildContext)
    );
  }

  return {
    includes,
    rendererOptions
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
  includeComponents = [],
  sourceFiles = getDefaultSourceFiles(componentName),
  writeAdditionalOutputs = async () => {}
}) {
  return async function buildComponent(context) {
    const templateSource = await context.readSourceFile(`${componentName}.twig`);
    const buildContext = {
      ...context,
      componentName,
      templateSource
    };
    const includedContext = await getIncludedComponentContext(
      includeComponents,
      buildContext
    );
    const rendererOptions = {
      includes: includedContext.includes,
      ...includedContext.rendererOptions,
      ...(await getOwnRendererOptions(getRendererOptions, buildContext))
    };
    const rendererContext = await getRendererContext(createRenderer, {
      ...buildContext,
      rendererOptions
    });

    await context.copySourceFiles(sourceFiles);
    await context.writeOutputFile(`${componentName}.html`, rendererContext.renderComponent(defaults));
    await writeAdditionalOutputs({
      ...context,
      componentName,
      rendererContext,
      renderComponent: rendererContext.renderComponent,
      templateSource
    });
  };
}
