import './state-seal.examples.css';
import {
  stateSealDefaults,
  stateSealFileTypes,
  stateSealColors
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
  color: {
    control: 'select',
    description: 'State seal color to render.',
    options: stateSealColors
  },
  fileType: {
    control: 'select',
    description: 'State seal asset file type.',
    options: stateSealFileTypes
  }
};

function renderPlayground(args) {
  const previewModifierClass = args.color === 'white'
    ? ' mds-state-seal-playground--dark'
    : '';

  return createPreview(
    renderStateSeal(args),
    `mds-state-seal-playground${previewModifierClass}`
  );
}

function renderColorCard(color, fileType) {
  const previewModifierClass = color === 'white'
    ? ' mds-state-seal-gallery__preview--dark'
    : '';

  return `
    <div class="mds-state-seal-gallery__item">
      <div class="mds-state-seal-gallery__preview${previewModifierClass}">
        ${renderStateSeal({
          ...stateSealDefaults,
          fileType,
          color
        })}
      </div>
      <code class="mds-state-seal-gallery__label">${color}</code>
    </div>
  `;
}

function renderAllVariants(args = {}) {
  const requestedFileType = args.fileType;
  const fileType = stateSealFileTypes.includes(requestedFileType)
    ? requestedFileType
    : stateSealDefaults.fileType;
  let galleryHtml = '';

  for (const color of stateSealColors) {
    galleryHtml += renderColorCard(color, fileType);
  }

  return createPreview(galleryHtml, 'mds-state-seal-gallery');
}

const defaultPlaygroundArgs = {
  fileType: stateSealDefaults.fileType,
  color: stateSealDefaults.color
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
  tags: ['!dev'],
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
