import buttonTwig from '@massds/mds-components/button.twig?raw';
import iconTwig from '@massds/mds-components/icon.twig?raw';
import stateBannerTwig from '@massds/mds-components/state-banner.twig?raw';
import stateSealTwig from '@massds/mds-components/state-seal.twig?raw';
import { createButtonRenderer } from '../../../packages/components/src/button/button.render.js';
import { createIconRenderer } from '../../../packages/components/src/icon/icon.render.js';
import { createStateBannerRenderer } from '../../../packages/components/src/state-banner/state-banner.render.js';
import { createStateSealRenderer } from '../../../packages/components/src/state-seal/state-seal.render.js';
import { normalizeIconSvg } from '../../../packages/components/src/icon/icon-svg.js';

const regularIconSvgs = import.meta.glob('../../../packages/assets/src/icons/static/*.svg', {
  eager: true,
  import: 'default',
  query: '?raw'
});

const boldIconSvgs = import.meta.glob('../../../packages/assets/src/icons/static/bold/*.svg', {
  eager: true,
  import: 'default',
  query: '?raw'
});

function getIconName(filePath) {
  return filePath
    .split('/')
    .pop()
    .replace(/--bold\.svg$/, '')
    .replace(/\.svg$/, '');
}

function addIconSvg(iconSvgMap, filePath, svg, weight) {
  const iconName = getIconName(filePath);

  iconSvgMap[iconName] = {
    ...iconSvgMap[iconName],
    [weight]: normalizeIconSvg(svg)
  };
}

function createIconSvgMap() {
  const iconSvgMap = {};

  for (const [filePath, svg] of Object.entries(regularIconSvgs)) {
    addIconSvg(iconSvgMap, filePath, svg, 'regular');
  }

  for (const [filePath, svg] of Object.entries(boldIconSvgs)) {
    addIconSvg(iconSvgMap, filePath, svg, 'bold');
  }

  return iconSvgMap;
}

export const iconSvgMap = createIconSvgMap();
export const renderIcon = createIconRenderer(iconTwig, iconSvgMap);
export const renderButton = createButtonRenderer(buttonTwig, {
  iconSvgMap,
  includes: {
    'icon.twig': iconTwig
  }
});
export const renderStateBanner = createStateBannerRenderer(stateBannerTwig, {
  includes: {
    'state-seal.twig': stateSealTwig
  }
});
export const renderStateSeal = createStateSealRenderer(stateSealTwig);
