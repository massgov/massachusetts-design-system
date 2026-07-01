import '@massds/mds-components/state-banner.css';
import {
  stateBannerDefaults
} from '../../../../packages/components/src/state-banner/state-banner.data.js';
import {
  stateSealFileTypes,
  stateSealVariants
} from '../../../../packages/components/src/state-seal/state-seal.data.js';
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

const stateBannerControls = {
  panelId: {
    control: 'text',
    description: 'The panel id linked from the details element.'
  },
  sealVariant: {
    control: 'select',
    description: 'State seal variant to render.',
    options: stateSealVariants
  },
  sealFileType: {
    control: 'select',
    description: 'State seal asset file type.',
    options: stateSealFileTypes
  },
  summaryLabel: {
    control: 'text',
    description: 'Accessible label for the banner section.'
  }
};

const defaultPlaygroundArgs = {
  panelId: stateBannerDefaults.panelId,
  sealVariant: stateBannerDefaults.sealVariant,
  sealFileType: stateBannerDefaults.sealFileType,
  summaryLabel: stateBannerDefaults.summaryLabel
};

const meta = {
  title: 'Components/State Banner',
  render: renderPlayground,
  argTypes: stateBannerControls,
  args: defaultPlaygroundArgs
};

export default meta;

export const Playground = {
  args: stateBannerDefaults,
  parameters: {
    layout: 'fullscreen'
  }
};
