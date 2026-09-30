import { iconNames } from '../icon/icon.names.js';

const iconOptions = ['', ...iconNames];

export const footerSchema = {
  theme: {
    type: 'enum',
    required: false,
    default: 'Neutral',
    options: ['Neutral', 'Primary']
  },
  siteName: {
    type: 'string',
    required: false,
    default: 'Site Name'
  },
  siteLink: {
    type: 'string',
    required: true
  },
  orgLogo: {
    type: 'string',
    required: true
  },
  socialLinks: {
    type: 'array',
    required: false,
    items: {
      type: 'object',
      properties: {
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
  description: {
    type: 'string',
    required: false
  },
  contactHeading: {
    type: 'string',
    required: false
  },
  contactItems: {
    type: 'array',
    required: false,
    items: {
      type: 'object',
      properties: {
        icon: {
          type: 'icon',
          required: false,
          options: iconOptions
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
      properties: {
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
            properties: {
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
  legalLinks: {
    type: 'array',
    required: false,
    items: {
      type: 'object',
      properties: {
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
  legalLinksOptional: {
    type: 'array',
    required: false,
    default: [],
    items: {
      type: 'object',
      properties: {
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
  supportingContent: {
    type: 'string',
    required: false
  },
  trademark: {
    type: 'string',
    required: false
  }
};
