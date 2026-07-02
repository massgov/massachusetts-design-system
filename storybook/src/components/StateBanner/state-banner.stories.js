import '@massds/mds-components/state-banner.css';
import {
  stateBannerDefaults
} from '../../../../packages/components/src/state-banner/state-banner.data.js';
import { renderStateBanner } from '../../utils/component-renderers.js';

// Storybook render functions return an HTML element.
function createPreview(html, className = '') {
  const preview = document.createElement('div');

  if (className) {
    preview.className = className;
  }

  preview.innerHTML = html;

  return preview;
}

function renderPlayground(args) {
  return createPreview(renderStateBanner(args));
}

const meta = {
  title: 'Components/State Banner',
  render: renderPlayground
};

export default meta;

export const Playground = {
  args: stateBannerDefaults,
  parameters: {
    layout: 'fullscreen'
  }
};
