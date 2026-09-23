import { iconNames } from '../icon/icon.names.js';

const iconOptions = ['', ...iconNames];

export const buttonSchema = {
  text: {
    type: 'string',
    default: 'Button'
  },
  disabled: {
    type: 'boolean',
    default: false
  },
  href: {
    type: 'string',
    default: ''
  },
  type: {
    type: 'enum',
    default: 'Fill',
    options: ['Fill', 'Outline', 'Ghost']
  },
  color: {
    type: 'enum',
    default: 'Primary',
    options: ['Primary', 'Secondary', 'White', 'Danger']
  },
  size: {
    type: 'enum',
    default: 'MD',
    options: ['MD', 'LG']
  },
  leftIcon: {
    type: 'icon',
    default: '',
    options: iconOptions
  },
  rightIcon: {
    type: 'icon',
    default: '',
    options: iconOptions
  }
};
