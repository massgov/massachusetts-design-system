import '@massds/mds-components/icon.css';
import './icon.examples.css';
import {
  iconDefaults,
  iconOptions,
  renderIcon
} from '@massds/mds-components/icon';

// Storybook render functions return an HTML element.
function createPreview(html, className = '') {
  const preview = document.createElement('div');

  if (className) {
    preview.className = className;
  }

  preview.innerHTML = html;

  return preview;
}

function renderDemo(args) {
  return createPreview(renderIcon(args), 'mds-icon-demo');
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

const defaultDemoArgs = {
  ariaLabel: 'Arrow right',
  className: iconDefaults.className,
  decorative: false,
  name: iconDefaults.name,
  weight: iconDefaults.weight
};

const meta = {
  title: 'Base/Icon',
  render: renderDemo,
  argTypes: iconControls,
  args: defaultDemoArgs
};

export default meta;

export const Demo = {};

export const AllIcons = {
  render: renderAllIcons,
  parameters: {
    controls: {
      disable: true
    },
    layout: 'padded'
  }
};
