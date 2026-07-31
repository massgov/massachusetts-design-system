import { getSchemaDefaults, getSchemaOptions } from '../shared/schema.js';
import { footerSchema } from './footer.schema.js';

export { footerSchema } from './footer.schema.js';

const schemaOptions = getSchemaOptions(footerSchema);

export const footerThemes = schemaOptions.theme;
export const footerIcons = schemaOptions.itemIcon;
export const footerOptions = {
  icon: footerIcons,
  theme: footerThemes
};
export const footerDefaults = getSchemaDefaults(footerSchema);

export const footerExampleData = {
  ...footerDefaults,
  theme: 'Neutral',
  siteNameId: 'mds-footer-site-name',
  sealAlt: '',
  socialLabel: 'Social media links',
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
  descriptionHtml: 'Short description of the organization goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut <a href="#">link</a> labore et dolore magna aliqua.',
  contactHeadingId: 'mds-footer-contact-heading',
  contactHeading: 'Contact',
  contactItems: [
    {
      icon: 'map-pin',
      addressLines: ['123 Main St.', 'Boston, MA 02118'],
      note: 'Optional descriptive text'
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
  legalLabel: 'Required policies',
  legalLinks: [
    {
      href: '#',
      text: 'Digital Accessibility Statement'
    },
    {
      href: '#',
      text: 'Privacy Notice'
    },
    {
      href: '#',
      text: 'Site Policies'
    },
    {
      href: '#',
      text: 'Public Records Requests'
    }
  ],
  fundingText: 'Funding details lorem ipsum dolor sit amet lorem ipsum dolore sit amet',
  itemIcon: '',
  trademarkHtml: '<strong>&copy; 2026 Commonwealth of Massachusetts.</strong><br />Mass.gov&reg; is a registered service mark of the Commonwealth of Massachusetts.'
};
