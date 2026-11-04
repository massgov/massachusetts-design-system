import { iconNames } from '../icon/icon.names.js';

const rightIconOptions = ['', ...iconNames.filter((name) => [
  'arrow-square-out',
  'file-pdf',
  'arrow-elbow-right-down',
  'file-doc',
  'file-csv',
  'file-ppt',
  'file-zip',
  'file-jpg',
  'file-png',
  'file-svg',
  'file-image',
  'file-video',
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
  target: {
    type: 'enum',
    default: 'none',
    options: ['none', '_blank']
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
