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

function getStaticIncludeTemplateIds(templateSource) {
  const includePattern = /{%-?\s*include\s+(['"])([^'"]+)\1/g;
  const templateIds = new Set();
  const sourceWithoutComments = templateSource.replace(/{#[\s\S]*?#}/g, '');
  let match;

  while ((match = includePattern.exec(sourceWithoutComments)) !== null) {
    templateIds.add(match[2]);
  }

  return Array.from(templateIds);
}

function getComponentNameFromTemplateId(templateId) {
  if (path.extname(templateId) !== '.twig') {
    throw new Error(`Static Twig include "${templateId}" must point to a .twig file.`);
  }

  return path.basename(templateId, '.twig');
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
  try {
    return await importModule(path.join(sourceDir, 'build.js'));
  } catch (error) {
    throw new Error(
      `Could not load build.js for included component "${componentName}". Static Twig includes should point to component templates such as "icon.twig".`,
      { cause: error }
    );
  }
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
  const currentTemplateId = `${buildContext.componentName}.twig`;

  seenTemplateIds.add(currentTemplateId);

  for (const includedComponent of getIncludedComponents(buildContext.templateSource)) {
    if (seenTemplateIds.has(includedComponent.templateId)) {
      continue;
    }

    seenTemplateIds.add(includedComponent.templateId);

    const includedSourceDir = path.resolve(buildContext.sourceDir, '..', includedComponent.componentName);
    const includedTemplateSource = await buildContext.readSourceFile(`../${includedComponent.componentName}/${includedComponent.componentName}.twig`);
    const includedBuildModule = await getComponentBuildModule(includedComponent.componentName, includedSourceDir);
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
