import '@massds/mds-components/button.css';
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
    color: {
      control: 'select',
      options: ['Primary', 'Secondary', 'Light', 'Danger']
    },
    htmlType: {
      control: 'select',
      options: ['button', 'submit', 'reset']
    },
    id: {
      control: 'text'
    },
    leftIcon: {
      control: 'select',
      options: ['', 'arrow-right']
    },
    rightIcon: {
      control: 'select',
      options: ['arrow-right', '']
    },
    size: {
      control: 'inline-radio',
      options: ['Regular', 'LG']
    },
    text: {
      control: 'text'
    },
    type: {
      control: 'select',
      options: ['Fill', 'Outline', 'Ghost']
    }
  },
  args: {
    ariaLabel: '',
    color: 'Primary',
    disabled: false,
    fullWidth: false,
    htmlType: 'button',
    id: '',
    leftIcon: '',
    rightIcon: 'arrow-right',
    size: 'LG',
    text: 'Button',
    type: 'Fill'
  }
};

export default meta;

export const Primary = {
  args: {
    size: "Regular"
  }
};

export const Secondary = {
  args: {
    color: 'Secondary',
    text: 'Secondary button'
  }
};

export const Disabled = {
  args: {
    disabled: true,
    text: 'Disabled button'
  }
};
