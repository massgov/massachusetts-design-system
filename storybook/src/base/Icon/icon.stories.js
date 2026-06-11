import '@massds/mds-components/icon.css';
import './icon.examples.css';
import {
  iconDefaults,
  iconOptions
} from '../../../../packages/components/src/icon/icon.data.js';
import { renderIcon } from '../../utils/component-renderers.js';
import { Tag } from 'storybook/manager-api';

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
    size,
    ...iconArgs
  } = args;
  const PlaygroundColor = iconPlaygroundColors[color] || color || iconPlaygroundColors.Primary;
  const PlaygroundSize = typeof size === 'string' && size.trim() ? size.trim() : '48px';
  const preview = createPreview(renderIcon(iconArgs), 'mds-icon-Playground');

  preview.style.setProperty('--mds-icon-Playground-color', PlaygroundColor);
  preview.style.setProperty('--mds-icon-Playground-size', PlaygroundSize);

  return preview;
}

function renderGalleryItem(iconName) {
  return `
    <div class="mds-icon-gallery__item">
      ${renderIcon({
        decorative: true,
        name: iconName,
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
    control: 'text',
    description: 'Playground-only CSS dimension, such as 24px, 1.5rem, or 2em.'
  },
  color: {
    control: 'select',
    options: Object.keys(iconPlaygroundColors),
    description: 'Playground-only CSS color.'
  },
  decorative: {
    control: 'boolean',
    description: 'When true, the icon is hidden from assistive technology.'
  },
  ariaLabel: {
    control: 'text',
    description: 'Accessible label for non-decorative icons.'
  },
  className: {
    control: 'text',
    description: 'Optional CSS class added to the icon wrapper.'
  }
};

const defaultPlaygroundArgs = {
  ariaLabel: 'Arrow right',
  className: iconDefaults.className,
  color: 'Neutral',
  decorative: true,
  name: iconDefaults.name,
  size: '48px',
  weight: iconDefaults.weight
};

const meta = {
  title: 'Base/Icon',
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
