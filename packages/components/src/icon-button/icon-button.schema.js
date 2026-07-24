import { iconNames } from '../icon/icon.names.js';

const iconOptions = ['', ...iconNames];

export const iconButtonSchema = {
  element: {
    type: 'enum',
    default: 'a',
    options: ['a', 'button']
  },
  href: {
    type: 'string',
    default: '#'
  },
  htmlType: {
    type: 'enum',
    default: 'button',
    options: ['button', 'submit', 'reset']
  },
  disabled: {
    type: 'boolean',
    default: false
  },
  id: {
    type: 'string',
    default: ''
  },
  ariaLabel: {
    type: 'string',
    default: 'Close'
  },
  icon: {
    type: 'icon',
    default: 'x',
    options: iconOptions
  },
  type: {
    type: 'enum',
    default: 'Fill',
    options: ['Fill', 'Outline', 'Ghost']
  },
  color: {
    type: 'enum',
    default: 'Primary',
    options: ['Primary', 'Secondary', 'Light', 'Error', 'White']
  },
  className: {
    type: 'string',
    default: ''
  }
};
