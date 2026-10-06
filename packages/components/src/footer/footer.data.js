import { iconNames } from '../icon/icon.names.js';
import { getSchemaDefaults, getSchemaOptions } from '../shared/schema.js';
import { footerSchema } from './footer.schema.js';

export { footerSchema } from './footer.schema.js';

const schemaOptions = getSchemaOptions(footerSchema);

export const footerThemes = schemaOptions.theme;
export const footerIcons = ['', ...iconNames];
export const footerOptions = {
  icon: footerIcons,
  theme: footerThemes
};
export const footerDefaults = getSchemaDefaults(footerSchema);

export const footerExampleData = {
  ...footerDefaults,
  theme: 'Neutral',
  siteLink: 'http://www.mass.gov',
  socialLinks: [
    {
      href: '#',
      label: 'Facebook',
      icon: 'facebook-logo'
    },
    {
      href: '#',
      label: 'Twitter',
      icon: 'x-logo'
    },
    {
      href: '#',
      label: 'LinkedIn',
      icon: 'linked-in-logo'
    },
    {
      href: '#',
      label: 'Youtube',
      icon: 'youtube-logo'
    },
    {
      href: '#',
      label: 'Instagram',
      icon: 'instagram-logo'
    }
  ],
  description: 'Optional short description of the site, organization, or product goes here. Use it to help people understand what it does and who it serves.',
  contactItems: [
    {  heading: 'Contact',
    links: [
      {
        icon: 'map-pin',
        text: '123 Main St.\nBoston, MA 02118'
      },
      {
        icon: 'phone-call',
        href: 'tel:+16172223333',
        text: '(617) 222-3333'
      },
      {
        icon: 'globe',
        href: '#',
        text: 'XYZ on Mass.gov'
      },
      {
        icon: 'envelope',
        href: 'mailto:sharedinbox@domain.com',
        text: 'sharedinbox@domain.com'
      }
    ]
  }
],
  linkGroups: [
    {
      headingId: 'mds-footer-links-heading-1',
      heading: 'Optional heading',
      eyebrow: true,
      links: [
        {
          href: '#',
          text: 'Optional link 1'
        },
        {
          href: '#',
          text: 'Optional link 2'
        },
        {
          href: '#',
          text: 'Optional link 3'
        },
        {
          href: '#',
          text: 'Optional link 4'
        },
        {
          href: '#',
          text: 'Optional link 5'
        },
        {
          href: '#',
          text: 'Optional link 6'
        }
      ]
    },
    {
      headingId: 'mds-footer-links-heading-2',
      heading: 'Optional heading',
      links: [
        {
          href: '#',
          text: 'Optional link 1'
        },
        {
          href: '#',
          text: 'Optional link 2'
        },
        {
          href: '#',
          text: 'Optional link 3'
        },
        {
          href: '#',
          text: 'Optional link 4'
        },
        {
          href: '#',
          text: 'Optional link 5'
        },
        {
          href: '#',
          text: 'Optional link 6'
        }
      ]
    }
  ],
  legalLinks: [
    {
      href: 'https://www.mass.gov/info-details/enterprise-digital-accessibility-statement',
      text: 'Digital Accessibility Statement'
    },
    {
      href: 'https://www.mass.gov/policy-advisory/massgov-privacy-policy',
      text: 'Privacy Notice'
    },
  ],
  legalLinksOptional: [
    {
      href: '#',
      text: 'Optional Link'
    },
    {
      href: '#',
      text: 'Optional Link'
    }
  ],
  supportingContent: '',
  trademark: '<strong>&copy; 2026 Commonwealth of Massachusetts.</strong><br />Mass.gov&reg; is a registered service mark of the Commonwealth of Massachusetts.'
};
