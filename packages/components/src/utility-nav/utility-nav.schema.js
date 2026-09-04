export const utilityNavSchema = {
  className: {
    type: 'string',
    default: ''
  },
  startVariant: {
    type: 'string',
    default: 'menu'
  },
  menuButtonText: {
    type: 'string',
    default: 'Menu'
  },
  menuButtonAriaLabel: {
    type: 'string',
    default: 'Open menu'
  },
  menuButtonExpanded: {
    type: 'boolean',
    default: false
  },
  menuButtonControls: {
    type: 'string',
    default: 'primary-navigation'
  },
  homeLinkText: {
    type: 'string',
    default: 'Mass.gov'
  },
  homeLinkHref: {
    type: 'string',
    default: 'https://www.mass.gov/'
  },
  homeLinkAriaLabel: {
    type: 'string',
    default: 'Go to Mass.gov home'
  },
  actionButtons: {
    type: 'array',
    default: [
      {
        text: 'Language',
        href: '',
        iconName: 'translate',
        iconWeight: 'Regular'
      },
      {
        text: 'Log in',
        href: '',
        iconName: 'signin',
        iconWeight: 'Regular'
      }
    ]
  }
};
