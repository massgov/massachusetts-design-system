import Twig from 'twig';
import { buttonDefaults, buttonOptions } from './button.data.js';

export function createButtonRenderer(templateSource, rendererOptions = {}) {
  const buttonTemplate = Twig.twig({ data: templateSource });
  const renderIcon = typeof rendererOptions.renderIcon === 'function'
    ? rendererOptions.renderIcon
    : () => '';

  return function renderButton(data = {}) {
    return buttonTemplate.render({
      buttonDefaults,
      buttonOptions,
      ...data,
      renderIcon
    });
  };
}
