import { buttonDefaults } from './button.data.js';
import { createComponentBuild } from '../../scripts/component-build.js';

export const includeComponents = ['icon'];

export const buildComponent = createComponentBuild({
  componentName: 'button',
  defaults: buttonDefaults,
  includeComponents
});
