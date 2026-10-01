import { iconNames } from '../icon/icon.names.js';

const trailingIconOptions = ['', ...iconNames.filter((name) => [
  'arrow-square-out',
  'file-pdf',
  'arrow-elbow-right-down'
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
  trailingIcon: {
    type: 'icon',
    default: '',
    options: trailingIconOptions
  }
};
