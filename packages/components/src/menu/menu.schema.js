export const menuSchema = {
  id: {
    type: 'string',
    default: 'mds-menu'
  },
  className: {
    type: 'string',
    default: ''
  },
  ariaLabel: {
    type: 'string',
    default: 'Menu'
  },
  ariaLabelledby: {
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
        type: 'button',
        buttonType: 'button',
        label: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non diam sit amet lacus molestie dapibus molestie eu diam. Donec vitae diam in nunc ultricies euismod.',
        iconName: 'smiley'
      },
      {
        type: 'button',
        buttonType: 'button',
        label: 'Select item',
        iconName: 'smiley'
      },
      {
        type: 'button',
        buttonType: 'button',
        label: 'Select item',
        iconName: 'smiley'
      },
      {
        type: 'button',
        buttonType: 'button',
        label: 'Select item',
        iconName: 'smiley'
      }
    ]
  }
};
