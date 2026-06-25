import { createTwigRenderer } from '../shared/twig-renderer.js';
import { iconDefaults, iconOptions } from '../icon/icon.data.js';
import { buttonDefaults, buttonOptions } from './button.data.js';

export function createButtonRenderer(templateSource, options = {}) {
  const { iconSvgMap = {}, includes = {} } = options;

  return createTwigRenderer(templateSource, (data = {}) => ({
    buttonDefaults,
    buttonOptions,
    iconDefaults,
    iconOptions,
    iconSvgMap,
    ...data
  }), {
    includes,
    templateId: 'button.twig'
  });
}
