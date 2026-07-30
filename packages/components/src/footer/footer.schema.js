import { iconNames } from '../icon/icon.names.js';

const iconOptions = ['', ...iconNames];

export const footerSchema = {
  theme: {
    type: 'enum',
    required: false,
    default: 'Neutral',
    options: ['Neutral', 'Primary']
  },
  siteNameId: {
    type: 'string',
    required: false,
    default: 'mds-footer-site-name'
  },
  siteName: {
    type: 'string',
    required: true,
    default: 'Site Name'
  },
  sealAlt: {
    type: 'string',
    required: false,
    default: ''
  },
  socialLabel: {
    type: 'string',
    required: false,
    default: 'Social media links'
  },
  socialLinks: {
    type: 'array',
    required: false,
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
    type: 'string',
    required: false
  },
  contactHeadingId: {
    type: 'string',
    required: false,
    default: 'mds-footer-contact-heading'
  },
  contactHeading: {
    type: 'string',
    required: false,
    default: 'Contact'
  },
  contactItems: {
    type: 'array',
    required: false,
    items: {
      type: 'object',
      fields: {
        icon: {
          type: 'icon',
          required: false,
          options: iconOptions
        },
        addressLines: {
          type: 'array',
          required: false,
          items: {
            type: 'string'
          }
        },
        note: {
          type: 'string',
          required: false
        },
        href: {
          type: 'string',
          required: false
        },
        text: {
          type: 'string',
          required: false
        }
      }
    }
  },
  linkGroups: {
    type: 'array',
    required: false,
    items: {
      type: 'object',
      fields: {
        headingId: {
          type: 'string',
          required: false
        },
        heading: {
          type: 'string',
          required: false
        },
        eyebrow: {
          type: 'boolean',
          required: false
        },
        links: {
          type: 'array',
          required: false,
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
    required: false,
    default: 'Required policies'
  },
  legalLinks: {
    type: 'array',
    required: false,
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
    type: 'string',
    required: false
  },
  trademarkHtml: {
    type: 'string',
    required: false
  },
  itemIcon: {
    type: 'icon',
    required: false,
    default: '',
    options: iconOptions
  }
};
