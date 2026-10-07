import '@massds/mds-styles/index.css';
import '@massds/mds-tokens/dist/index.css';
import '@massds/mds-components/action-link.css';
import '@massds/mds-components/footer.css';
import '@massds/mds-components/icon-button.css';
import '@massds/mds-components/inline-message.css';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import { createElement, Fragment, useEffect } from 'react';
import storybookPackage from '../package.json';
import { renderFooter, renderInlineMessage } from '../src/utils/component-renderers';
import './docs-markdown.css';
import './preview.css';
import { massdsDocsTheme } from './theme';

const stateAssetsVersion = storybookPackage.dependencies['@massds/mds-assets'];
const footerSealSrc = `https://unpkg.com/@massds/mds-assets@${stateAssetsVersion}/dist/state-seal/state-seal-black.png`;

const sharedBetaInlineMessageData = {
  type: 'Informative',
  variant: 'Filled',
  heading: 'The Massachusetts Design System is in beta',
  description: 'The Design System is available to use now and will continue to evolve as the library grows. Learn more about using the Design System progressively and how the resources fit into your project on the <a href="/">Design System introduction page.</a>'
};

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

function renderSharedBetaInlineMessage() {
  return renderInlineMessage({
    ...sharedBetaInlineMessageData,
    className: 'sb-unstyled'
  });
}

function shouldShowBetaInlineMessage(context) {
  const storyId = new URL(window.location.href).searchParams.get('id');

  return context.id !== 'overview-introduction--docs' && storyId !== 'overview-introduction--docs';
}

function getSnippetCopyDetails(event) {
  const button = event.target instanceof Element
    ? event.target.closest('button')
    : null;

  if (!button || button.textContent.trim() !== 'Copy') {
    return null;
  }

  // A Storybook Source block renders its copy action immediately after its
  // scrollable preformatted region. This excludes unrelated buttons named "Copy".
  const code = button.parentElement?.previousElementSibling?.querySelector('pre');

  if (!code) {
    return null;
  }

  const languageElement = code.matches('[class*="language-"]')
    ? code
    : code.querySelector('[class*="language-"]');
  const languageClass = [...(languageElement?.classList || [])]
    .find((className) => className.startsWith('language-'));
  const tabPanel = button.closest('[role="tabpanel"]');
  const tabId = tabPanel?.getAttribute('aria-labelledby');
  const tabLabel = tabId ? document.getElementById(tabId)?.textContent.trim() : null;

  return {
    code_language: languageClass?.replace('language-', '') || 'unknown',
    code_tab: tabLabel || 'unlabeled',
    story_id: new URL(window.location.href).searchParams.get('id') || 'unknown'
  };
}

function trackSnippetCopy(event) {
  const details = getSnippetCopyDetails(event);

  if (!details) {
    return;
  }

  try {
    if (typeof window.parent.gtag === 'function') {
      window.parent.gtag('event', 'storybook_code_copy', details);
    }
  } catch {
    // The parent window may be unavailable when the preview is embedded cross-origin.
  }
}

function StorybookDocsContainer({ children, ...props }) {
  useEffect(() => {
    document.addEventListener('click', trackSnippetCopy);

    return () => document.removeEventListener('click', trackSnippetCopy);
  }, []);

  const betaInlineMessageMarkup = shouldShowBetaInlineMessage(props.context)
    ? renderSharedBetaInlineMessage()
    : '';
  const footerMarkup = renderSharedFooter();

  return createElement(
    Fragment,
    null,
    createElement(
      DocsContainer,
      props,
      createElement(
        Fragment,
        null,
        createElement('div', {
          className: 'mds-docs-beta-inline-message',
          dangerouslySetInnerHTML: { __html: betaInlineMessageMarkup }
        }),
        children
      )
    ),
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
          ['Design Tokens', 'Color Tokens', ['Overview', 'Guidance', 'Code', 'Playground']],
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
