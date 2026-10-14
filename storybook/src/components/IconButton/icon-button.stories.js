import '@massds/mds-components/icon-button.css';
import {
  iconButtonDefaults,
  iconButtonOptions
} from '../../../../packages/components/src/icon-button/icon-button.data.js';
import { renderIconButton } from '../../utils/component-renderers.js';
import { controlCategories } from '../../utils/controlCategories.js';

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
  const previewClassName = args.color === 'White'
    ? 'mds-padding-inline-xs mds-padding-block-xs mds-background-section-brand-primary-highest'
    : '';

  return createPreview(renderIconButton(args), previewClassName);
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
    description: 'Accessible label for the button',
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
    description: 'Link destination. When provided, the icon button renders as a link element.',
    table: {
      category: controlCategories.content
    }
  },
  disabled: {
    control: 'boolean',
    description: 'Disables the button.',
    table: {
      category: controlCategories.design
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

