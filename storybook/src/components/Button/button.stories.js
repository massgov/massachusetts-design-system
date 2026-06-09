import '@massds/mds-components/button.css';
import './button.examples.css';
import {
  buttonDefaults,
  buttonExamples,
  buttonOptions,
  renderButton
} from '@massds/mds-components/button';

function renderButtonStory(args) {
  const preview = document.createElement('div');
  preview.innerHTML = renderButton(args);

  return preview;
}

const exampleColors = [
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
const exampleSizes = [
  {
    label: 'Large',
    size: 'LG'
  },
  {
    label: 'Regular',
    size: 'Regular'
  }
];
const exampleTypes = [
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

function renderExampleButton({ color, disabled = false, size, text, type }) {
  return renderButton({
    color,
    disabled,
    rightIcon: '',
    size,
    text,
    type
  });
}

function renderColorExample({ color, label, size, surface, type }) {
  return `
    <div class="mds-button-examples__color-example${
      surface === 'dark' ? ' mds-button-examples__color-example--dark' : ''
    }">
      <h5 class="mds-button-examples__color-heading">${label}</h5>
      <div class="mds-button-examples__button-stack">
        ${renderExampleButton({
          color,
          size,
          text: 'Button',
          type
        })}
        ${renderExampleButton({
          color,
          disabled: true,
          size,
          text: 'Button',
          type
        })}
      </div>
    </div>
  `;
}

function renderExampleGroup({ label, type }) {
  const rows = exampleSizes.map(({ label: sizeLabel, size }) => {
    return `
      <div class="mds-button-examples__variant-row">
        <h4 class="mds-button-examples__variant-heading">${sizeLabel}</h4>
        <div class="mds-button-examples__color-grid">
          ${exampleColors
            .map((colorExample) =>
              renderColorExample({
                ...colorExample,
                size,
                type
              })
            )
            .join('')}
        </div>
      </div>
    `;
  });

  return `
    <section class="mds-button-examples__group">
      <h3 class="mds-button-examples__group-heading">${label}</h3>
      ${rows.join('')}
    </section>
  `;
}

function renderExamplesStory() {
  const preview = document.createElement('div');
  preview.className = 'mds-button-examples';
  preview.innerHTML = exampleTypes.map(renderExampleGroup).join('');

  return preview;
}

const buttonArgTypes = {
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
  leftIcon: {
    control: 'select',
    options: buttonOptions.icon
  },
  rightIcon: {
    control: 'select',
    options: buttonOptions.icon
  }
};

const buttonArgs = Object.fromEntries(
  Object.keys(buttonArgTypes).map((key) => [key, buttonDefaults[key]])
);

const meta = {
  title: 'Components/Button',
  render: renderButtonStory,
  argTypes: buttonArgTypes,
  args: buttonArgs
};

export default meta;

export const Demo = {
  args: buttonExamples.primary
};

export const Examples = {
  render: renderExamplesStory,
  parameters: {
    controls: {
      disable: true
    },
    layout: 'padded'
  }
};
