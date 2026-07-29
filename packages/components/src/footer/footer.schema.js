import { iconNames } from '../icon/icon.names.js';

const iconOptions = ['', ...iconNames];

export const footerSchema = {
  theme: {
    type: 'enum',
    default: 'Neutral',
    options: ['Neutral', 'Primary']
  },
  siteNameId: {
    type: 'string',
    default: 'mds-footer-site-name'
  },
  siteName: {
    type: 'string',
    default: 'Site Name'
  },
  sealAlt: {
    type: 'string',
    default: ''
  },
  socialLabel: {
    type: 'string',
    default: 'Social media links'
  },
  socialLinks: {
    type: 'array',
    items: {
      type: 'object',
      fields: {
        href: {
          type: 'string',
          required: true
        },
        label: {
          type: 'string',
          required: true
        },
        icon: {
          type: 'icon',
          required: true,
          options: iconOptions
        }
      }
    }
  },
  descriptionHtml: {
    type: 'string'
  },
  contactHeadingId: {
    type: 'string',
    default: 'mds-footer-contact-heading'
  },
  contactHeading: {
    type: 'string',
    default: 'Contact'
  },
  contactItems: {
    type: 'array',
    items: {
      type: 'object',
      fields: {
        icon: {
          type: 'icon',
          options: iconOptions
        },
        addressLines: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        note: {
          type: 'string'
        },
        href: {
          type: 'string'
        },
        text: {
          type: 'string'
        }
      }
    }
  },
  linkGroups: {
    type: 'array',
    items: {
      type: 'object',
      fields: {
        headingId: {
          type: 'string'
        },
        heading: {
          type: 'string'
        },
        eyebrow: {
          type: 'boolean'
        },
        links: {
          type: 'array',
          items: {
            type: 'object',
            fields: {
              href: {
                type: 'string',
                required: true
              },
              text: {
                type: 'string',
                required: true
              }
            }
          }
        }
      }
    }
  },
  legalLabel: {
    type: 'string',
    default: 'Required policies'
  },
  legalLinks: {
    type: 'array',
    items: {
      type: 'object',
      fields: {
        href: {
          type: 'string',
          required: true
        },
        text: {
          type: 'string',
          required: true
        }
      }
    }
  },
  fundingText: {
    type: 'string'
  },
  trademarkHtml: {
    type: 'string'
  },
  itemIcon: {
    type: 'icon',
    default: '',
    options: iconOptions
  }
};
