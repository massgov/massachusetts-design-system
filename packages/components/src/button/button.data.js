import { iconNames } from '../icon/icon.names.js';

export const buttonTypes = ['Fill', 'Outline', 'Ghost'];
export const buttonColors = ['Primary', 'Secondary', 'Light', 'Danger'];
export const buttonSizes = ['Regular', 'LG'];
export const buttonIcons = ['', ...iconNames];
export const htmlButtonTypes = ['button', 'submit', 'reset'];

export const buttonOptions = {
  color: buttonColors,
  htmlType: htmlButtonTypes,
  icon: buttonIcons,
  size: buttonSizes,
  type: buttonTypes
};

export const buttonDefaults = {
  ariaLabel: '',
  color: 'Primary',
  disabled: false,
  htmlType: 'button',
  id: '',
  leftIcon: '',
  rightIcon: '',
  size: 'LG',
  text: 'Button',
  type: 'Fill'
};

export const buttonExamples = {
  primary: {
    size: 'Regular'
  },
  secondary: {
    color: 'Secondary',
    text: 'Secondary button'
  },
  disabled: {
    disabled: true,
    text: 'Disabled button'
  }
};
