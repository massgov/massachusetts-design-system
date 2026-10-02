import { iconNames } from '../icon/icon.names.js';

const rightIconOptions = ['', ...iconNames.filter((name) => [
  'arrow-square-out',
  'file-pdf',
  'arrow-elbow-right-down',
  'file-doc',
  'file-jpg',
  'file-xls',
  'file'
].includes(name))];

export const inlineLinkSchema = {
  text: {
    type: 'string',
    default: 'inline link'
  },
  href: {
    type: 'string',
    default: '#'
  },
  color: {
    type: 'enum',
    default: 'Primary',
    options: ['Primary', 'Neutral', 'White']
  },
  rightIcon: {
    type: 'icon',
    default: '',
    options: rightIconOptions
  }
};
