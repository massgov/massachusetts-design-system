import '@massds/mds-styles/index.css';
import '@massds/mds-tokens/dist/index.css';
import '@massds/mds-components/action-link.css';
import '@massds/mds-components/footer.css';
import '@massds/mds-components/icon-button.css';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import { createElement, Fragment, useEffect, useState } from 'react';
import storybookPackage from '../package.json';
import './docs-markdown.css';
import './preview.css';
import { massdsDocsTheme } from './theme';

const footerHtmlUrl = new URL(
  `${import.meta.env.BASE_URL}components/footer/footer.storybook.html`,
  window.location.origin
).href;
const stateAssetsVersion = storybookPackage.dependencies['@massds/mds-assets'];
const footerSealSrc = `https://unpkg.com/@massds/mds-assets@${stateAssetsVersion}/dist/state-seal/state-seal-black.png`;
let footerMarkupPromise;

function loadFooterMarkup() {
  if (!footerMarkupPromise) {
    footerMarkupPromise = fetch(footerHtmlUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Unable to load the Storybook footer: ${response.status}`);
        }

        return response.text();
      })
      .then((markup) => {
        const template = document.createElement('template');

        template.innerHTML = markup;
        template.content.querySelector('.mds-footer__seal')?.setAttribute('src', footerSealSrc);
        return template.innerHTML;
      });
  }

  return footerMarkupPromise;
}

function StorybookDocsContainer({ children, ...props }) {
  const [footerMarkup, setFooterMarkup] = useState('');

  useEffect(() => {
    let isMounted = true;

    loadFooterMarkup()
      .then((markup) => {
        if (isMounted) {
          setFooterMarkup(markup);
        }
      })
      .catch((error) => console.error(error));

    return () => {
      isMounted = false;
    };
  }, []);

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
