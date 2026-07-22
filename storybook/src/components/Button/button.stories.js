import '@massds/mds-components/button.css';
import './button.examples.css';
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

// These lists build the large Examples story below.
const buttonColorExamples = [
  {
    color: 'Primary',
    label: 'Primary'
  },
  {
    color: 'Secondary',
    label: 'Accent'
  },
  {
    color: 'Light',
    label: 'Light',
    surface: 'dark'
  },
  {
    color: 'Danger',
    label: 'Danger'
  }
];

const ghostButtonColorExamples = [
  ...buttonColorExamples,
  {
    color: 'White',
    label: 'White',
    surface: 'dark'
  }
];

const buttonSizeExamples = [
  {
    label: 'Large',
    size: 'LG'
  },
  {
    label: 'Regular',
    size: 'Regular'
  }
];

const buttonTypeExamples = [
  {
    label: 'Fill',
    type: 'Fill'
  },
  {
    label: 'Outline',
    type: 'Outline'
  },
  {
    label: 'Ghost',
    type: 'Ghost'
  }
];

function renderButtonExample({ color, disabled = false, size, type }) {
  return renderButton({
    color,
    disabled,
    rightIcon: '',
    size,
    text: 'Button',
    type
  });
}

function renderColorExample(colorExample, size, type) {
  const darkSurfaceClass = colorExample.surface === 'dark'
    ? ' mds-button-examples__color-example--dark'
    : '';

  return `
    <div class="mds-button-examples__color-example${darkSurfaceClass}">
      <h5 class="mds-button-examples__color-heading">${colorExample.label}</h5>
      <div class="mds-button-examples__button-stack">
        ${renderButtonExample({
          color: colorExample.color,
          size,
          type
        })}
        ${renderButtonExample({
          color: colorExample.color,
          disabled: true,
          size,
          type
        })}
      </div>
    </div>
  `;
}

function getButtonColorExamples(type) {
  return type === 'Ghost' ? ghostButtonColorExamples : buttonColorExamples;
}

function renderSizeRow(sizeExample, type) {
  let colorExamplesHtml = '';

  for (const colorExample of getButtonColorExamples(type)) {
    colorExamplesHtml += renderColorExample(colorExample, sizeExample.size, type);
  }

  return `
    <div class="mds-button-examples__variant-row">
      <h4 class="mds-button-examples__variant-heading">${sizeExample.label}</h4>
      <div class="mds-button-examples__color-grid">
        ${colorExamplesHtml}
      </div>
    </div>
  `;
}

function renderTypeSection(typeExample) {
  let sizeRowsHtml = '';

  for (const sizeExample of buttonSizeExamples) {
    sizeRowsHtml += renderSizeRow(sizeExample, typeExample.type);
  }

  return `
    <section class="mds-button-examples__group">
      <h3 class="mds-button-examples__group-heading">${typeExample.label}</h3>
      ${sizeRowsHtml}
    </section>
  `;
}

function renderAllExamples() {
  let examplesHtml = '';

  for (const typeExample of buttonTypeExamples) {
    examplesHtml += renderTypeSection(typeExample);
  }

  return createPreview(examplesHtml, 'mds-button-examples');
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
    description: 'White applies to Ghost buttons only.',
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
  htmlType: {
    control: 'select',
    options: buttonOptions.htmlType,
    description: 'Native HTML button type.',
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
