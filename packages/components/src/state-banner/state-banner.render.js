import { createTwigRenderer } from '../shared/twig-renderer.js';
import { stateBannerDefaults } from './state-banner.data.js';
import { stateSealAssetSrcs, stateSealDefaults, stateSealVariants } from '../state-seal/state-seal.data.js';

export function createStateBannerRenderer(templateSource, options = {}) {
  return createTwigRenderer(templateSource, (data = {}) => ({
    stateBannerDefaults,
    stateSealAssetSrcs,
    stateSealDefaults,
    stateSealVariants,
    ...data
  }), {
    templateId: 'state-banner.twig',
    ...options
  });
}
