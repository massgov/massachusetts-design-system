import { iconNames } from '../icon/icon.names.js';

const iconOptions = ['', ...iconNames];

export const popupMenuSchema = {
  id: {
    type: 'string',
    default: 'mds-popup-menu'
  },
  triggerId: {
    type: 'string',
    default: 'mds-popup-menu-trigger'
  },
  triggerText: {
    type: 'string',
    default: 'Open Menu'
  },
  triggerHtmlType: {
    type: 'enum',
    default: 'button',
    options: ['button', 'submit', 'reset']
  },
  labelledBy: {
    type: 'string',
    default: ''
  },
  label: {
    type: 'string',
    default: ''
  },
  noIcons: {
    type: 'boolean',
    default: false
  },
  items: {
    type: 'array',
    default: [
      {
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non diam sit amet lacus molestie dapibus molestie eu diam. Donec vitae diam in nunc ultricies euismod.',
        href: '#',
        icon: 'smiley'
      },
      {
        text: 'Select item',
        href: '#',
        icon: 'smiley'
      },
      {
        text: 'Select item',
        href: '#',
        icon: 'smiley'
      }
    ]
  },
  itemType: {
    type: 'enum',
    default: 'link',
    options: ['link', 'button']
  },
  itemIcon: {
    type: 'icon',
    default: '',
    options: iconOptions
  },
  itemHtmlType: {
    type: 'enum',
    default: 'button',
    options: ['button', 'submit', 'reset']
  }
};
