import { stateBannerDefaults } from './state-banner.data.js';
import { createComponentBuild } from '../../scripts/component-build.js';

export const buildComponent = createComponentBuild({
  componentName: 'state-banner',
  defaults: stateBannerDefaults
});

