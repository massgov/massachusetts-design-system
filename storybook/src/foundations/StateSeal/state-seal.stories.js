import './state-seal.examples.css';
import {
  stateSealDefaults,
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
  variant: {
    control: 'select',
    description: 'State seal variant to render.',
    options: stateSealVariants
  },
  fileType: {
    control: 'select',
    description: 'State seal asset file type.',
    options: stateSealFileTypes
  }
};

function renderPlayground(args) {
  return createPreview(renderStateSeal(args), 'mds-state-seal-playground');
}

function renderVariantCard(variant, fileType) {
  const previewModifierClass = variant === 'white'
    ? ' mds-state-seal-gallery__preview--dark'
    : '';

  return `
    <div class="mds-state-seal-gallery__item">
      <div class="mds-state-seal-gallery__preview${previewModifierClass}">
        ${renderStateSeal({
          ...stateSealDefaults,
          fileType,
          variant
        })}
      </div>
      <code class="mds-state-seal-gallery__label">${variant}</code>
    </div>
  `;
}

function renderAllVariants(args = {}) {
  const requestedFileType = args.fileType;
  const fileType = stateSealFileTypes.includes(requestedFileType)
    ? requestedFileType
    : stateSealDefaults.fileType;
  let galleryHtml = '';

  for (const variant of stateSealVariants) {
    galleryHtml += renderVariantCard(variant, fileType);
  }

  return createPreview(galleryHtml, 'mds-state-seal-gallery');
}

const defaultPlaygroundArgs = {
  fileType: stateSealDefaults.fileType,
  variant: stateSealDefaults.variant
};

const meta = {
  title: 'Foundations/State Seal',
  render: renderPlayground,
  argTypes: stateSealControls,
  args: defaultPlaygroundArgs
};

export default meta;

export const Playground = {};

export const AllVariants = {
  render: renderAllVariants,
  args: {
    fileType: stateSealDefaults.fileType
  },
  parameters: {
    controls: {
      include: ['fileType']
    },
    layout: 'padded'
  }
};
