function toTemplateLiteral(value) {
  return value.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

function getPropertyCombinations(properties) {
  return properties.reduce(
    (combinations, property) =>
      combinations.flatMap((combination) =>
        Object.entries(property.options).map(([, data]) => ({
          data: {
            ...combination.data,
            ...data
          },
          values: [...combination.values, JSON.stringify(data)]
        }))
      ),
    [{ data: {}, values: [] }]
  );
}

function createPropertyAccessors(properties) {
  return properties
    .map(
      (property, index) => `const property${index} = instance.getEnum('${property.figmaName}', ${JSON.stringify(
        Object.fromEntries(
          Object.entries(property.options).map(([option, data]) => [option, JSON.stringify(data)])
        )
      )})`
    )
    .join('\n');
}

function createVariantTemplate({ componentName, config, defaults, renderComponent }) {
  const htmlByProperties = Object.fromEntries(
    getPropertyCombinations(config.properties).map(({ data, values }) => [
      JSON.stringify(values),
      `<link rel="stylesheet" href="${config.stylesheet}">\n\n${renderComponent({ ...defaults, ...data })}`
    ])
  );
  const accessors = createPropertyAccessors(config.properties);
  const propertyValues = config.properties.map((_, index) => `property${index}`).join(', ');

  return `// Generated from src/${componentName}/${componentName}.twig. Do not edit.\n// url=${config.url}\nimport figma from 'figma'\n\nconst instance = figma.selectedInstance\n${accessors}\n\nconst htmlByProperties = ${JSON.stringify(htmlByProperties, null, 2)}\nconst html = htmlByProperties[JSON.stringify([${propertyValues}])]\n\nexport default {\n  id: '${config.id}',\n  example: figma.html\`\${html}\`\n}\n`;
}

function createDefaultTemplate({ componentName, config, defaults, renderComponent }) {
  const html = `<link rel="stylesheet" href="${config.stylesheet}">\n\n${renderComponent(defaults)}`;

  return `// Generated from src/${componentName}/${componentName}.twig. Do not edit.\n// url=${config.url}\nimport figma from 'figma'\n\nexport default {\n  id: '${config.id}',\n  example: figma.html\`\n${toTemplateLiteral(html)}\n\`\n}\n`;
}

export function createCodeConnectTemplate({ componentName, config, defaults, renderComponent }) {
  if (config.properties?.length) {
    return createVariantTemplate({ componentName, config, defaults, renderComponent });
  }

  return createDefaultTemplate({ componentName, config, defaults, renderComponent });
}
