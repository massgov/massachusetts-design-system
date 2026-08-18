import '@massds/mds-components/icon.css';
import './icon.examples.css';
import {
  iconDefaults,
  iconOptions
} from '../../../../packages/components/src/icon/icon.data.js';
import { renderIcon } from '../../utils/component-renderers.js';

const iconPlaygroundColors = {
  'Neutral default': 'var(--mds-content-brand-neutral-default)',
  'Neutral muted': 'var(--mds-content-brand-neutral-muted)',
  'Neutral disabled': 'var(--mds-content-brand-neutral-disabled)',
  Primary: 'var(--mds-content-brand-primary-mid)',
  Secondary: 'var(--mds-content-brand-secondary-mid)',
  White: 'var(--mds-base-white)',
  Informative: 'var(--mds-content-utility-informative-mid)',
  Danger: 'var(--mds-content-utility-danger-mid)',
  Warning: 'var(--mds-content-utility-warning-mid)',
  Success: 'var(--mds-content-utility-success-mid)'
};

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
  const {
    color,
    ...iconArgs
  } = args;
  const PlaygroundColor = iconPlaygroundColors[color] || color || iconPlaygroundColors.Primary;
  const preview = createPreview(renderIcon(iconArgs), 'mds-icon-Playground');

  preview.style.setProperty('--mds-icon-Playground-color', PlaygroundColor);

  return preview;
}

function renderGalleryItem(iconName) {
  return `
    <div class="mds-icon-gallery__item">
      ${renderIcon({
        name: iconName,
        size: 'LG',
        weight: 'Regular'
      })}
      <code class="mds-icon-gallery__name">${iconName}</code>
    </div>
  `;
}

function renderAllIcons() {
  let iconsHtml = '';

  for (const iconName of iconOptions.name) {
    iconsHtml += renderGalleryItem(iconName);
  }

  return createPreview(iconsHtml, 'mds-icon-gallery');
}

// Controls are the editable fields in the Storybook UI.
const iconControls = {
  name: {
    control: 'select',
    options: iconOptions.name
  },
  weight: {
    control: 'inline-radio',
    options: iconOptions.weight
  },
  size: {
    control: 'inline-radio',
    options: iconOptions.size
  },
  color: {
    control: 'select',
    options: Object.keys(iconPlaygroundColors),
    description: 'Playground-only CSS color.'
  }
};

const defaultPlaygroundArgs = {
  color: 'Neutral default',
  name: iconDefaults.name,
  size: iconDefaults.size,
  weight: iconDefaults.weight
};

const meta = {
  title: 'Foundations/Icon',
  render: renderPlayground,
  argTypes: iconControls,
  args: defaultPlaygroundArgs
};

export default meta;

export const Playground = {};

export const AllIcons = {
  render: renderAllIcons,
  tags: ['!dev'],
  parameters: {
    controls: {
      disable: true
    },
    layout: 'padded'
  }
};
