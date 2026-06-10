import { readIconSvgMap } from '../../scripts/icon-registry.js';
import { createComponentBuild } from '../../scripts/component-build.js';
import { iconDefaults } from './icon.data.js';
import { createIconRenderer } from './icon.render.js';

async function createRenderer({ templateSource }) {
  const iconSvgMap = await readIconSvgMap();

  return createIconRenderer(templateSource, iconSvgMap);
}

export const buildComponent = createComponentBuild({
  componentName: 'icon',
  createRenderer,
  defaults: iconDefaults
});
