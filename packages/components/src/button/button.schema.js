import { iconNames } from '../icon/icon.names.js';

const iconOptions = ['', ...iconNames];

export const buttonSchema = {
  text: {
    type: 'string',
    default: 'Button'
  },
  id: {
    type: 'string',
    default: ''
  },
  htmlType: {
    type: 'enum',
    default: 'button',
    options: ['button', 'submit', 'reset']
  },
  ariaLabel: {
    type: 'string',
    default: ''
  },
  disabled: {
    type: 'boolean',
    default: false
  },
  type: {
    type: 'enum',
    default: 'Fill',
    options: ['Fill', 'Outline', 'Ghost']
  },
  color: {
    type: 'enum',
    default: 'Primary',
    options: ['Primary', 'Secondary', 'Light', 'Danger']
  },
  size: {
    type: 'enum',
    default: 'Regular',
    options: ['Regular', 'LG']
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
