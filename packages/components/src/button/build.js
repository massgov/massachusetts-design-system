import { buttonDefaults } from './button.data.js';
import { createButtonRenderer } from './button.render.js';
import { createComponentBuild } from '../../scripts/component-build.js';
import { readIconSvgMap } from '../../scripts/icon-registry.js';
import { createIconRenderer } from '../icon/icon.render.js';

async function createRenderer({ readSourceFile, templateSource }) {
  const iconTemplateSource = await readSourceFile('../icon/icon.twig');
  const iconSvgMap = await readIconSvgMap();
  const renderIcon = createIconRenderer(iconTemplateSource, iconSvgMap);

  return createButtonRenderer(templateSource, { renderIcon });
}

export const buildComponent = createComponentBuild({
  componentName: 'button',
  createRenderer,
  defaults: buttonDefaults
});
