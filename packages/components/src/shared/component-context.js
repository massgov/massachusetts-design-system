function toIdentifier(value = '') {
  return value.replace(/-([a-z0-9])/g, (_, character) => character.toUpperCase());
}

export function toPascalCase(value = '') {
  const identifier = toIdentifier(value);

  return `${identifier.charAt(0).toUpperCase()}${identifier.slice(1)}`;
}

export function getDefaultsExportName(componentName) {
  return `${toIdentifier(componentName)}Defaults`;
}

export function getTemplateId(componentName) {
  return `${componentName}.twig`;
}

export function getStaticIncludeTemplateIds(templateSource = '') {
  const includePattern = /{%-?\s*include\s+(['"])([^'"]+)\1/g;
  const templateIds = new Set();
  const sourceWithoutComments = templateSource.replace(/{#[\s\S]*?#}/g, '');
  let match;

  while ((match = includePattern.exec(sourceWithoutComments)) !== null) {
    templateIds.add(match[2]);
  }

  return Array.from(templateIds);
}

export function getComponentNameFromTemplateId(templateId) {
  if (!templateId.endsWith('.twig')) {
    throw new Error(`Static Twig include "${templateId}" must point to a .twig file.`);
  }

  const templatePathParts = templateId.split('/');
  const fileName = templatePathParts[templatePathParts.length - 1];

  return fileName.slice(0, -'.twig'.length);
}

export function getModuleContext(moduleExports = {}) {
  return Object.fromEntries(
    Object.entries(moduleExports).filter(([exportName, exportValue]) =>
      exportName !== 'default' &&
      !exportName.endsWith('Schema') &&
      typeof exportValue !== 'function'
    )
  );
}

export function getComponentDefaults(componentName, moduleExports = {}) {
  const defaultsExportName = getDefaultsExportName(componentName);
  const defaults = moduleExports[defaultsExportName];

  if (defaults === undefined) {
    throw new Error(
      `${componentName}.data.js must export ${defaultsExportName} for the default component build.`
    );
  }

  return defaults;
}

export function getRendererContextOptions(options = {}) {
  const {
    includes: _includes,
    templateId: _templateId,
    ...contextOptions
  } = options;

  return contextOptions;
}
