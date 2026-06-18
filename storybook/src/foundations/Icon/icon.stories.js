import '@massds/mds-components/icon.css';
import './icon.examples.css';
import {
  iconDefaults,
  iconOptions
} from '../../../../packages/components/src/icon/icon.data.js';
import { renderIcon } from '../../utils/component-renderers.js';

const iconPlaygroundColors = {
  Neutral: 'var(--mds-text-and-icons-brand-neutral-default)',
  Primary: 'var(--mds-text-and-icons-brand-primary-mid)',
  Secondary: 'var(--mds-text-and-icons-brand-secondary-mid)',
  Danger: 'var(--mds-text-and-icons-utility-danger-mid)'
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
  color: 'Neutral',
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
