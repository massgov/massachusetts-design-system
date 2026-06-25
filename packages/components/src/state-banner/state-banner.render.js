import { createTwigRenderer } from '../shared/twig-renderer.js';
import { stateBannerDefaults } from './state-banner.data.js';

export function createStateBannerRenderer(templateSource, options = {}) {
  return createTwigRenderer(templateSource, (data = {}) => ({
    stateBannerDefaults,
    ...data
  }), {
    templateId: 'state-banner.twig',
    ...options
  });
}

