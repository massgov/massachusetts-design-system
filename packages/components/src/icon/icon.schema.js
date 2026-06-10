import { iconNames } from './icon.names.js';

export const iconSchema = {
  name: {
    type: 'icon',
    default: 'arrow-right',
    options: iconNames
  },
  weight: {
    type: 'enum',
    default: 'Regular',
    options: ['Regular', 'Bold']
  },
  decorative: {
    type: 'boolean',
    default: true
  },
  ariaLabel: {
    type: 'string',
    default: ''
  },
  className: {
    type: 'string',
    default: ''
  }
};
