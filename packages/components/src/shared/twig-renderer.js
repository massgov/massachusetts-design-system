import Twig from 'twig';
import { formatHtml } from './format-html.js';

// Storybook recreates renderers during HMR, so avoid Twig's global ID cache.
Twig.cache(false);

function compileTemplate(templateSource, options = {}) {
  const config = {
    allowInlineIncludes: true,
    data: templateSource
  };

  if (options.id) {
    config.id = options.id;
  }

  return Twig.twig(config);
}

export function createTwigRenderer(templateSource, getContext = (data) => data, options = {}) {
  for (const [id, source] of Object.entries(options.includes ?? {})) {
    compileTemplate(source, { id });
  }

  const template = compileTemplate(templateSource, { id: options.templateId });

  return function renderTwig(data = {}) {
    const context = getContext(data);

    if (context === null) {
      return '';
    }

    return formatHtml(template.render(context));
  };
}
