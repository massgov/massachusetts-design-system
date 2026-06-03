import '@massds/mds-components/button.css';
import {
  buttonDefaults,
  buttonExamples,
  buttonOptions,
  initMdsButtons,
  renderButton
} from '@massds/mds-components/button';

function renderButtonStory(args) {
  const preview = document.createElement('div');
  preview.innerHTML = renderButton(args);
  initMdsButtons(preview);

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
const exampleTypes = ['Fill', 'Outline', 'Ghost'];

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

function renderExampleGroup({ color, label, surface }) {
  const rows = exampleSizes.map(({ label: sizeLabel, size }) => {
    const buttons = exampleTypes
      .map((type) =>
        renderExampleButton({
          color,
          size,
          text: type,
          type
        })
      )
      .join('');
    const disabledButtons = exampleTypes
      .map((type) =>
        renderExampleButton({
          color,
          disabled: true,
          size,
          text: `${type} disabled`,
          type
        })
      )
      .join('');

    return `
      <div class="mds-button-examples__variant-row">
        <h4 class="mds-button-examples__variant-heading">${sizeLabel}</h4>
        <div class="mds-button-examples__button-row">${buttons}</div>
        <div class="mds-button-examples__button-row">${disabledButtons}</div>
      </div>
    `;
  });

  return `
    <section class="mds-button-examples__group${
      surface === 'dark' ? ' mds-button-examples__group--dark' : ''
    }">
      <h3 class="mds-button-examples__group-heading">${label}</h3>
      ${rows.join('')}
    </section>
  `;
}

function renderExamplesStory() {
  const preview = document.createElement('div');
  preview.className = 'mds-button-examples';
  preview.innerHTML = `
    <style>
      .mds-button-examples {
        display: grid;
        gap: 32px;
        width: min(100%, 1280px);
      }

      .mds-button-examples__group {
        display: grid;
        gap: 24px;
        padding: 24px;
        border: 1px solid var(--mds-border-brand-neutral-low);
        border-radius: var(--mds-radius-md);
        background: var(--mds-background-section-utility-static-white);
      }

      .mds-button-examples__group--dark {
        background: var(--mds-background-section-brand-neutral-highest);
      }

      .mds-button-examples__group-heading,
      .mds-button-examples__variant-heading {
        margin: 0;
        color: var(--mds-text-and-icons-brand-neutral-default);
      }

      .mds-button-examples__group--dark .mds-button-examples__group-heading,
      .mds-button-examples__group--dark .mds-button-examples__variant-heading {
        color: var(--mds-text-and-icons-utility-static-white);
      }

      .mds-button-examples__variant-row {
        display: grid;
        gap: 12px;
      }

      .mds-button-examples__button-row {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        align-items: center;
      }
    </style>
    ${exampleColors.map(renderExampleGroup).join('')}
  `;

  initMdsButtons(preview);

  return preview;
}

const meta = {
  title: 'Components/Button',
  render: renderButtonStory,
  argTypes: {
    ariaLabel: {
      control: 'text',
      description: 'Accessible label when the visible text is not enough.'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the native button.'
    },
    fullWidth: {
      control: 'boolean',
      description: 'Expands the button to the width of its container.'
    },
    color: {
      control: 'select',
      options: buttonOptions.color
    },
    htmlType: {
      control: 'select',
      options: buttonOptions.htmlType,
      description: 'Native HTML button type.'
    },
    id: {
      control: 'text'
    },
    leftIcon: {
      control: 'select',
      options: buttonOptions.icon
    },
    rightIcon: {
      control: 'select',
      options: buttonOptions.icon
    },
    size: {
      control: 'inline-radio',
      options: buttonOptions.size
    },
    text: {
      control: 'text'
    },
    type: {
      control: 'select',
      options: buttonOptions.type
    }
  },
  args: buttonDefaults
};

export default meta;

export const Primary = {
  args: buttonExamples.primary
};

export const Secondary = {
  args: buttonExamples.secondary
};

export const Disabled = {
  args: buttonExamples.disabled
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
