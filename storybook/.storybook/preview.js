import '@massds/mds-styles/index.css';
import '@massds/mds-tokens/dist/index.css';
import '@massds/mds-components/action-link.css';
import '@massds/mds-components/footer.css';
import '@massds/mds-components/icon-button.css';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import { createElement, Fragment } from 'react';
import storybookPackage from '../package.json';
import { renderFooter } from '../src/utils/component-renderers';
import './docs-markdown.css';
import './preview.css';
import { massdsDocsTheme } from './theme';

const stateAssetsVersion = storybookPackage.dependencies['@massds/mds-assets'];
const footerSealSrc = `https://unpkg.com/@massds/mds-assets@${stateAssetsVersion}/dist/state-seal/state-seal-black.png`;

const sharedFooterData = {
  theme: 'Neutral',
  siteNameId: 'storybook-footer-site-name',
  siteName: 'Massachusetts Design System',
  sealAlt: '',
  socialLinks: [],
  descriptionHtml: 'Storybook is the implementation reference for the Massachusetts Design System. It provides reusable components, design tokens, accessibility guidance, and code examples for Commonwealth digital products.',
  contactHeadingId: 'storybook-footer-contact-heading',
  contactHeading: 'Contact',
  contactItems: [
    {
      icon: 'star',
      href: 'mailto:designsystem@mass.gov',
      text: 'Share feedback'
    },
    {
      icon: 'globe',
      href: 'https://mass.gov/designsystem',
      text: 'mass.gov/designsystem'
    },
    {
      icon: 'envelope',
      href: 'mailto:designsystem@mass.gov',
      text: 'designsystem@mass.gov'
    }
  ],
  linkGroups: [],
  legalLabel: 'Footer links',
  legalLinks: [
    {
      href: 'https://www.mass.gov/info-details/commonwealth-of-massachusetts-executive-department-digital-accessibility-statement',
      text: 'Digital Accessibility Statement'
    },
    {
      href: 'https://www.mass.gov/policy-advisory/massgov-privacy-policy',
      text: 'Privacy Notice'
    }
  ],
  showOptionalLegalLinks: false,
  legalLinksOptional: [],
  fundingText: '',
  trademarkHtml: '<strong>&copy; 2026 Commonwealth of Massachusetts.</strong><br />Mass.gov&reg; is a registered service mark of the Commonwealth of Massachusetts.'
};

function renderSharedFooter() {
  const template = document.createElement('template');

  template.innerHTML = renderFooter(sharedFooterData);
  template.content.querySelector('.mds-footer__seal')?.setAttribute('src', footerSealSrc);

  return template.innerHTML;
}

function StorybookDocsContainer({ children, ...props }) {
  const footerMarkup = renderSharedFooter();

  return createElement(
    Fragment,
    null,
    createElement(DocsContainer, props, children),
    footerMarkup
      ? createElement('div', {
        id: 'storybook-docs-footer',
        dangerouslySetInnerHTML: { __html: footerMarkup }
      })
      : null
  );
}

const preview = {
  parameters: {
    options: {
      storySort: {
        method: 'alphabetical',
        order: [
          'Overview',
          ['Introduction', 'Getting Started'],
          'Foundations',
          ['Design Tokens', 'Color Tokens', 'Type Styles', ['Overview', 'Guidance', 'Code', 'Playground']],
          'Components',
          ['*', ['Overview', 'Guidance', 'Code', 'Playground']]
        ],
        includeNames: true
      }
    },
    controls: {
      sort: 'none',
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    docs: {
      theme: massdsDocsTheme,
      container: StorybookDocsContainer,
      toc: {
        headingSelector: 'h2',
        title: null
      }
    },
    layout: 'centered'
  }
};

export default preview;
