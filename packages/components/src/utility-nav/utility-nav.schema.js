export const utilityNavSchema = {
  navigationType: {
    type: 'string',
    default: 'menu'
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
