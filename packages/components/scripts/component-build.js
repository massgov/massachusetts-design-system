function getDefaultSourceFiles(componentName) {
  return [`${componentName}.twig`];
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
  createRenderer,
  defaults,
  sourceFiles = getDefaultSourceFiles(componentName),
  writeAdditionalOutputs = async () => {}
}) {
  return async function buildComponent(context) {
    const templateSource = await context.readSourceFile(`${componentName}.twig`);
    const rendererContext = await getRendererContext(createRenderer, {
      ...context,
      componentName,
      templateSource
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
