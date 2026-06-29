import { readIconSvgMap } from '../../scripts/icon-registry.js';
import { createComponentBuild } from '../../scripts/component-build.js';
import { iconDefaults } from './icon.data.js';

export async function getRendererOptions() {
  return {
    iconSvgMap: await readIconSvgMap()
  };
}

export const buildComponent = createComponentBuild({
  componentName: 'icon',
  defaults: iconDefaults,
  getRendererOptions
});
