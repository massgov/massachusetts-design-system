import { A } from 'storybook/internal/components';
import {
  stateSealFileTypes,
  stateSealVariants 
} from '../../../../packages/components/src/state-seal/state-seal.data.js';
import { renderStateSeal } from '../../utils/component-renderers.js';

// Storybook render functions return an HTML element.
function createPreview(html, className = '') {
  const preview = document.createElement('div');

  if (className) {
    preview.className = className;
  }

  preview.innerHTML = html;

  return preview;
}

const stateSealControls = {
  sealVariant: {
    control: 'select',
    description: 'State seal variant to render.',
    options: stateSealVariants
  },
  sealFileType: {
    control: 'select',
    description: 'State seal asset file type.',
    options: stateSealFileTypes
  }
};

function renderPlayground(args) {
  return createPreview(renderStateSeal(args));
}

const meta = {
  title: 'Foundations/State Seal',
  render: renderPlayground,
  argTypes: stateSealControls
};

export default meta;

export const Playground = {};
