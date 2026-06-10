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

function getRenderFunctionName(componentName) {
  return `render${toPascalCase(componentName)}`;
}

function getRendererFactoryName(componentName) {
  return `create${toPascalCase(componentName)}Renderer`;
}

function normalizeNestedComponent(nestedComponent) {
  if (typeof nestedComponent === 'string') {
    return {
      componentName: nestedComponent,
      renderFunctionName: getRenderFunctionName(nestedComponent)
    };
  }

  return {
    ...nestedComponent,
    renderFunctionName: nestedComponent.renderFunctionName ?? getRenderFunctionName(nestedComponent.componentName)
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

async function getNestedRendererOptions(nestedComponents, buildContext) {
  const rendererOptions = {};

  for (const nestedComponent of nestedComponents) {
    const nested = normalizeNestedComponent(nestedComponent);
    const nestedSourceDir = path.resolve(buildContext.sourceDir, '..', nested.componentName);
    const nestedTemplateSource = await buildContext.readSourceFile(`../${nested.componentName}/${nested.componentName}.twig`);
    const nestedBuildModule = await getComponentBuildModule(nested.componentName, nestedSourceDir);
    const nestedBuildContext = {
      ...buildContext,
      componentName: nested.componentName,
      sourceDir: nestedSourceDir,
      templateSource: nestedTemplateSource
    };
    const nestedRendererOptions = {
      ...(await getNestedRendererOptions(nestedBuildModule.nestedComponents ?? [], nestedBuildContext)),
      ...(await getOwnRendererOptions(nestedBuildModule.getRendererOptions, nestedBuildContext))
    };

    rendererOptions[nested.renderFunctionName] = await createDefaultRenderer({
      ...nestedBuildContext,
      rendererOptions: nestedRendererOptions
    });
  }

  return rendererOptions;
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
  nestedComponents = [],
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
    const rendererOptions = {
      ...(await getNestedRendererOptions(nestedComponents, buildContext)),
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
