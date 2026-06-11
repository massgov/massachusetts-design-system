import '@massds/mds-components/button.css';
import './button.examples.css';
import {
  buttonDefaults,
  buttonOptions
} from '../../../../packages/components/src/button/button.data.js';
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

function renderDemo(args) {
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

function renderSizeRow(sizeExample, type) {
  let colorExamplesHtml = '';

  for (const colorExample of buttonColorExamples) {
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
    control: 'text'
  },
  id: {
    control: 'text'
  },
  htmlType: {
    control: 'select',
    options: buttonOptions.htmlType,
    description: 'Native HTML button type.'
  },
  ariaLabel: {
    control: 'text',
    description: 'Accessible label when the visible text is not enough.'
  },
  disabled: {
    control: 'boolean',
    description: 'Disables the native button.'
  },
  type: {
    control: 'select',
    options: buttonOptions.type
  },
  color: {
    control: 'select',
    options: buttonOptions.color
  },
  size: {
    control: 'inline-radio',
    options: buttonOptions.size
  },
  leftIcon: iconSelectControl,
  rightIcon: iconSelectControl
};

const defaultDemoArgs = {
  ariaLabel: buttonDefaults.ariaLabel,
  color: buttonDefaults.color,
  disabled: buttonDefaults.disabled,
  htmlType: buttonDefaults.htmlType,
  id: buttonDefaults.id,
  leftIcon: buttonDefaults.leftIcon,
  rightIcon: buttonDefaults.rightIcon,
  size: buttonDefaults.size,
  text: buttonDefaults.text,
  type: buttonDefaults.type
};

const meta = {
  title: 'Components/Button',
  render: renderDemo,
  argTypes: buttonControls,
  args: defaultDemoArgs
};

export default meta;

export const Demo = {
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
