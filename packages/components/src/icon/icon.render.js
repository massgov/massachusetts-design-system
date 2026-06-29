import { createTwigRenderer } from '../shared/twig-renderer.js';
import { iconDefaults, iconOptions } from './icon.data.js';

export function createIconRenderer(templateSource, options = {}) {
  const iconSvgMap = options.iconSvgMap ?? options;

  return createTwigRenderer(templateSource, (data = {}) => ({
    iconDefaults,
    iconOptions,
    iconSvgMap,
    ...data
  }), {
    templateId: 'icon.twig'
  });
}
