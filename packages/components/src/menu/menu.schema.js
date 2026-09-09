export const menuSchema = {
  id: {
    type: 'string',
    default: 'mds-menu'
  },
  className: {
    type: 'string',
    default: 'mds-popup-menu'
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
        label: 'Select item',
        iconName: 'smiley',
        iconWeight: 'Regular'
      },
      {
        type: 'button',
        buttonType: 'button',
        label: 'Select item',
        iconName: 'smiley',
        iconWeight: 'Regular'
      },
      {
        type: 'button',
        buttonType: 'button',
        label: 'Select item',
        iconName: 'smiley',
        iconWeight: 'Regular'
      },
      {
        type: 'button',
        buttonType: 'button',
        label: 'Select item',
        iconName: 'smiley',
        iconWeight: 'Regular'
      }
    ]
  }
};
