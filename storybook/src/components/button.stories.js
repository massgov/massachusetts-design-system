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
