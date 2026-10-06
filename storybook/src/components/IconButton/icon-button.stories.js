import '@massds/mds-components/icon-button.css';
import {
  iconButtonDefaults,
  iconButtonOptions
} from '../../../../packages/components/src/icon-button/icon-button.data.js';
import { renderIconButton } from '../../utils/component-renderers.js';
import { controlCategories } from '../../utils/controlCategories.js';
import './icon-button.examples.css';

// Storybook render functions return an HTML element.
function createPreview(html, className = '') {
  const preview = document.createElement('div');

  if (className) {
    preview.className = className;
  }

  preview.innerHTML = html;

  return preview;
}

function isDarkSurface(color) {
  return color === 'White';
}

function renderPlayground(args) {
  const surfaceClass = isDarkSurface(args.color)
    ? 'mds-icon-button-playground mds-icon-button-playground--dark'
    : 'mds-icon-button-playground';

  return createPreview(renderIconButton(args), surfaceClass);
}

const iconSelectControl = {
  control: {
    type: 'select',
    labels: {
      '': 'None'
    }
  },
  options: iconButtonOptions.icon
};

// Controls are the editable fields in the Storybook UI.
const iconButtonControls = {
  ariaLabel: {
    control: 'text',
    description: 'Accessible label for the icon-only control.',
    table: {
      category: controlCategories.content
    }
  },
  icon: {
    ...iconSelectControl,
    table: {
      category: controlCategories.design
    }
  },
  type: {
    control: 'select',
    options: iconButtonOptions.type,
    table: {
      category: controlCategories.design
    }
  },
  color: {
    control: 'select',
    options: iconButtonOptions.color,
    table: {
      category: controlCategories.design
    }
  },
  href: {
    control: 'text',
    description: 'Link destination - entering a value here will make the element an anchor tag.',
    table: {
      category: controlCategories.content
    }
  },
  disabled: {
    control: 'boolean',
    description: 'Disables the control.'
    table: {
      category: controlCategories.content
    }
  },
};

const defaultPlaygroundArgs = {
  href: iconButtonDefaults.href,
  ariaLabel: iconButtonDefaults.ariaLabel,
  icon: iconButtonDefaults.icon,
  type: iconButtonDefaults.type,
  color: iconButtonDefaults.color
};

const meta = {
  title: 'Components/Icon Button',
  render: renderPlayground,
  argTypes: iconButtonControls,
  args: defaultPlaygroundArgs
};

export default meta;

export const Playground = {
  args: iconButtonDefaults
};

