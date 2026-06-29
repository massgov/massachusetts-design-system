import { buttonDefaults } from './button.data.js';
import { createComponentBuild } from '../../scripts/component-build.js';

export const buildComponent = createComponentBuild({
  componentName: 'button',
  defaults: buttonDefaults
});
