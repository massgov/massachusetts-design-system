import '@massds/mds-components/icon-button.css';
import './icon-button.examples.css';
import {
  iconButtonDefaults,
  iconButtonOptions
} from '../../../../packages/components/src/icon-button/icon-button.data.js';
import { controlCategories } from '../../utils/controlCategories.js';
import { renderIconButton } from '../../utils/component-renderers.js';

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
  return color === 'Light';
}

function renderPlayground(args) {
  const surfaceClass = isDarkSurface(args.color)
    ? 'mds-icon-button-playground mds-icon-button-playground--dark'
    : 'mds-icon-button-playground';

  return createPreview(renderIconButton(args), surfaceClass);
}

const iconButtonExamples = [
  {
    label: 'Primary link',
    args: {
      ariaLabel: 'Facebook',
      color: 'Primary',
      element: 'a',
      icon: 'facebook-logo',
      type: 'Fill'
    }
  },
  {
    label: 'Secondary link',
    args: {
      ariaLabel: 'Visit the Commonwealth on X',
      color: 'Secondary',
      element: 'a',
      icon: 'x-logo',
      type: 'Fill'
    }
  },
  {
    label: 'Light link',
    surface: 'dark',
    args: {
      ariaLabel: 'Instagram',
      color: 'Light',
      element: 'a',
      icon: 'instagram-logo',
      type: 'Fill'
    }
  },
  {
    label: 'Button action',
    args: {
      ariaLabel: 'More options',
      color: 'Primary',
      element: 'button',
      icon: 'dots-three',
      type: 'Fill'
    }
  }
];

function renderIconButtonExample(example) {
  const surfaceClass = example.surface === 'dark'
    ? ' mds-icon-button-examples__item--dark'
    : '';

  return `
    <div class="mds-icon-button-examples__item${surfaceClass}">
      <h3 class="mds-icon-button-examples__heading">${example.label}</h3>
      ${renderIconButton({
        ...iconButtonDefaults,
        ...example.args
      })}
    </div>
  `;
}

function renderAllExamples() {
  let examplesHtml = '';

  for (const example of iconButtonExamples) {
    examplesHtml += renderIconButtonExample(example);
  }

  return createPreview(examplesHtml, 'mds-icon-button-examples');
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
  element: {
    control: 'inline-radio',
    options: iconButtonOptions.element,
    table: {
      category: controlCategories.html
    }
  },
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
    description: 'Link destination when element is a.',
    table: {
      category: controlCategories.html
    }
  },
  htmlType: {
    control: 'select',
    options: iconButtonOptions.htmlType,
    description: 'Native HTML button type when element is button.',
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
  element: iconButtonDefaults.element,
  href: iconButtonDefaults.href,
  htmlType: iconButtonDefaults.htmlType,
  id: iconButtonDefaults.id,
  ariaLabel: iconButtonDefaults.ariaLabel,
  icon: iconButtonDefaults.icon,
  type: iconButtonDefaults.type,
  color: iconButtonDefaults.color,
  className: iconButtonDefaults.className
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

export const Examples = {
  render: renderAllExamples,
  tags: ['!dev'],
  parameters: {
    controls: {
      disable: true
    },
    layout: 'padded'
  }
};
