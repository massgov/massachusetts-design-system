import { iconNames } from '../icon/icon.names.js';

const iconOptions = ['', ...iconNames];

export const iconButtonSchema = {
  href: {
    type: 'string',
    default: ''
  },
  disabled: {
    type: 'boolean',
    default: false
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
    options: ['Primary', 'Secondary', 'White', 'Error']
  },
};
