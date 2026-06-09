import { createTwigRenderer } from '../shared/twig-renderer.js';
import { buttonDefaults, buttonOptions } from './button.data.js';

export function createButtonRenderer(templateSource, { renderIcon = () => '' } = {}) {
  return createTwigRenderer(templateSource, (data = {}) => ({
    buttonDefaults,
    buttonOptions,
    ...data,
    renderIcon
  }));
}
