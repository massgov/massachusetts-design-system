import '@massds/mds-components/button.css';
import {
  buttonDefaults,
  buttonOptions
} from '../../../../packages/components/src/button/button.data.js';
import { controlCategories } from '../../utils/controlCategories.js';
import { renderButton } from '../../utils/component-renderers.js';

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
  return createPreview(renderButton(args));
}

const iconSelectControl = {
  control: {
    type: 'select',
    labels: {
      '': 'None'
    }
  },
  options: buttonOptions.icon
};

// Controls are the editable fields in the Storybook UI.
const buttonControls = {
  text: {
    control: 'text',
    table: {
      category: controlCategories.content
    }
  },
  type: {
    control: 'select',
    options: buttonOptions.type,
    table: {
      category: controlCategories.design
    }
  },
  color: {
    control: 'select',
    options: buttonOptions.color,
    table: {
      category: controlCategories.design
    }
  },
  size: {
    control: 'inline-radio',
    options: buttonOptions.size,
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
  id: {
    control: 'text',
    table: {
      category: controlCategories.html
    }
  },
  href: {
    control: 'text',
    description: 'Link destination. When provided, the button renders as an anchor.',
    table: {
      category: controlCategories.html
    }
  },
  htmlType: {
    control: 'select',
    options: buttonOptions.htmlType,
    description: 'Native HTML button type. Applies only when href is empty.',
    table: {
      category: controlCategories.html
    }
  },
  disabled: {
    control: 'boolean',
    description: 'Disables the native button.',
    table: {
      category: controlCategories.html
    }
  }
};

const defaultPlaygroundArgs = {
  text: buttonDefaults.text,
  type: buttonDefaults.type,
  color: buttonDefaults.color,
  size: buttonDefaults.size,
  leftIcon: buttonDefaults.leftIcon,
  rightIcon: buttonDefaults.rightIcon,
  id: buttonDefaults.id,
  href: buttonDefaults.href,
  htmlType: buttonDefaults.htmlType,
  disabled: buttonDefaults.disabled,
};

const meta = {
  title: 'Components/Button',
  render: renderPlayground,
  argTypes: buttonControls,
  args: defaultPlaygroundArgs
};

export default meta;

export const Playground = {
  args: buttonDefaults
};
