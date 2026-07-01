import { createTwigRenderer } from '../shared/twig-renderer.js';
import { stateSealAssetSrcs, stateSealDefaults, stateSealVariants } from './state-seal.data.js';

export function createStateSealRenderer(templateSource, options = {}) {
  return createTwigRenderer(templateSource, (data = {}) => ({
    stateSealAssetSrcs,
    stateSealDefaults,
    stateSealVariants,
    ...data
  }), {
    templateId: 'state-seal.twig',
    ...options
  });
}
