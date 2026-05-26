import { initMdsButtons, renderButton } from '@massds/mds-components/button';

const meta = {
  title: 'Components/Button',
  tags: ['autodocs'],
  render: (args) => {
    const preview = document.createElement('div');
    preview.innerHTML = renderButton(args);
    initMdsButtons(preview);

    return preview;
  },
  argTypes: {
    ariaLabel: {
      control: 'text'
    },
    disabled: {
      control: 'boolean'
    },
    fullWidth: {
      control: 'boolean'
    },
    id: {
      control: 'text'
    },
    label: {
      control: 'text'
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset']
    },
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary']
    }
  },
  args: {
    ariaLabel: '',
    disabled: false,
    fullWidth: false,
    id: '',
    label: 'Button',
    type: 'button',
    variant: 'primary'
  }
};

export default meta;

export const Primary = {};

export const Secondary = {
  args: {
    label: 'Secondary button',
    variant: 'secondary'
  }
};

export const Disabled = {
  args: {
    disabled: true,
    label: 'Disabled button'
  }
};
