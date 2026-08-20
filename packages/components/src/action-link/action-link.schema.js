import { iconNames } from '../icon/icon.names.js';

const iconOptions = ['', ...iconNames];

export const actionLinkSchema = {
  text: {
    type: 'string',
    //default: 'Action link'
    default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ut sagittis ipsum, et tempus libero. Nulla facilisi. Praesent viverra ornare auctor. '
  },
  href: {
    type: 'string',
    default: '#'
  },
  id: {
    type: 'string',
    default: ''
  },
  color: {
    type: 'enum',
    default: 'Primary',
    options: ['Primary', 'Neutral', 'White']
  },
  size: {
    type: 'enum',
    default: 'Small',
    options: ['Small', 'Medium', 'Large']
  },
  iconWeight: {
    type: 'enum',
    default: 'Bold',
    options: ['Regular', 'Bold']
  },
  leftIcon: {
    type: 'icon',
    default: '',
    options: iconOptions
  },
  rightIcon: {
    type: 'icon',
    default: 'arrow-right',
    options: iconOptions
  },
  rightIconAccessibleText: {
    type: 'string',
    default: 'test',
  },
  className: {
    type: 'string',
    default: ''
  }
};
