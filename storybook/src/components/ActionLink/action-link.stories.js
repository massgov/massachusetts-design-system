import '@massds/mds-components/action-link.css';
import {
  actionLinkDefaults,
  actionLinkOptions
} from '../../../../packages/components/src/action-link/action-link.data.js';
import { controlCategories } from '../../utils/controlCategories.js';
import { renderActionLink } from '../../utils/component-renderers.js';

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

  return createPreview(renderActionLink(args), previewClassName);
}

const iconSelectControl = {
  control: {
    type: 'select',
    labels: {
      '': 'None'
    }
  },
  options: actionLinkOptions.icon
};

const actionLinkControls = {
  text: {
    control: 'text',
    table: {
      category: controlCategories.content
    }
  },
  color: {
    control: 'select',
    options: actionLinkOptions.color,
    table: {
      category: controlCategories.design
    }
  },
  size: {
    control: 'inline-radio',
    options: actionLinkOptions.size,
    table: {
      category: controlCategories.design
    }
  },
  iconWeight: {
    control: 'inline-radio',
    options: actionLinkOptions.iconWeight,
    table: {
      category: controlCategories.design
    }
  },
  leftIcon: {
    ...iconSelectControl,
    table: {
      category: controlCategories.design
    }
  },
  rightIcon: {
    ...iconSelectControl,
    table: {
      category: controlCategories.design
    }
  },
  rightIconAccessibleText: {
    control: 'text',
    description: 'Accessible text for the right icon when it conveys information not included in the link label.',
    table: {
      category: controlCategories.content
    }
  },
  href: {
    control: 'text',
    description: 'Link destination.',
    table: {
      category: controlCategories.html
    }
  },
  id: {
    control: 'text',
    table: {
      category: controlCategories.html
    }
  },
  className: {
    control: 'text',
    table: {
      category: controlCategories.html
    }
  }
};

const defaultPlaygroundArgs = {
  text: actionLinkDefaults.text,
  color: actionLinkDefaults.color,
  size: actionLinkDefaults.size,
  iconWeight: actionLinkDefaults.iconWeight,
  leftIcon: actionLinkDefaults.leftIcon,
  rightIcon: actionLinkDefaults.rightIcon,
  rightIconAccessibleText: actionLinkDefaults.rightIconAccessibleText,
  href: actionLinkDefaults.href,
  id: actionLinkDefaults.id,
  className: actionLinkDefaults.className
};

const meta = {
  title: 'Components/Action Link',
  render: renderPlayground,
  argTypes: actionLinkControls,
  args: defaultPlaygroundArgs
};

export default meta;

export const Playground = {
  args: actionLinkDefaults
};
