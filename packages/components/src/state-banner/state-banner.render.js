import { createTwigRenderer } from '../shared/twig-renderer.js';
import { iconDefaults, iconOptions } from '../icon/icon.data.js';
import { stateBannerDefaults } from './state-banner.data.js';
import {
  stateSealAssetSrcs,
  stateSealDefaults,
  stateSealFileTypes,
  stateSealVariants
} from '../state-seal/state-seal.data.js';

export function createStateBannerRenderer(templateSource, options = {}) {
  return createTwigRenderer(templateSource, (data = {}) => ({
    iconDefaults,
    iconOptions,
    iconSvgMap: options.iconSvgMap ?? {},
    stateBannerDefaults,
    stateSealAssetSrcs,
    stateSealDefaults,
    stateSealFileTypes,
    stateSealVariants,
    ...data
  }), {
    templateId: 'state-banner.twig',
    ...options
  });
}
