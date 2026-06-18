const buttonIconNames = [
  'arrow-right',
  'arrow-up',
  'arrows-counter-clockwise',
  'caret-down',
  'caret-up',
  'download-simple',
  'export',
  'file-arrow-down',
  'file-pdf',
  'file-xls',
  'file-zip',
  'gear',
  'magnifying-glass',
  'play',
  'signin',
  'signout',
  'thumbs-down',
  'thumbs-up',
  'trash',
  'upload-simple',
  'x'
];

const iconOptions = ['', ...buttonIconNames];

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
