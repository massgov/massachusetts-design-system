import { stateSealDefaults } from './state-seal.data.js';
import { createComponentBuild } from '../../scripts/component-build.js';

export const buildComponent = createComponentBuild({
  componentName: 'state-seal',
  defaults: stateSealDefaults
});
