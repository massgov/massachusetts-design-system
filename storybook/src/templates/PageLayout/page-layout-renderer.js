import {
  footerExampleData
} from '../../../../packages/components/src/footer/footer.data.js';
import {
  siteHeaderDefaults
} from '../../../../packages/components/src/site-header/site-header.data.js';
import {
  stateBannerDefaults
} from '../../../../packages/components/src/state-banner/state-banner.data.js';
import {
  tokensVersion
} from '../../overview/getting-started.mdx';

import {
  renderFooter,
  renderSiteHeader,
  renderStateBanner
} from '../../utils/component-renderers.js';

function createMarkupFragment(html) {
  const template = document.createElement('template');

  template.innerHTML = html;

  return template.content;
}

export const pageLayoutDefaults = {
  siteName: 'Site name',
  subHeading: 'Optional subheading',
  mainContent: 'Place your content here.',
  footerTheme: 'Neutral',
  footerVariant: 'Full'
};

export const pageLayoutOptions = {
  footerVariant: ['Full', 'Simple']
};

function getFooterData(args) {
  const footerData = {
    ...footerExampleData,
    siteName: args.siteName,
    theme: args.footerTheme
  };

  if (args.footerVariant === 'Simple') {
    return {
      ...footerData,
      socialLinks: [],
      description: '',
      contactItems: [],
      linkGroups: [],
      legalLinksOptional: []
    };
  }

  return footerData;
}

export function renderPageLayout(args) {
  const page = document.createElement('div');
  const header = document.createElement('header');
  const main = document.createElement('main');
  const mainContainer = document.createElement('div');

  page.className = 'mds-page-layout';
  header.className = 'mds-page-layout__header';
  main.className = 'mds-page-layout__main';
  mainContainer.className = 'mds-page-layout__main-container';
  const mainContent = document.createElement('div');
  mainContent.textContent = args.mainContent;

  mainContainer.append(mainContent);
  main.append(mainContainer);


  header.append(createMarkupFragment(renderStateBanner({
    ...stateBannerDefaults
  })));
  header.append(createMarkupFragment(renderSiteHeader({
    ...siteHeaderDefaults,
    siteName: args.siteName,
    subHeading: args.subHeading
  })));

  main.append(mainContainer);
  page.append(
    header,
    main,
    createMarkupFragment(renderFooter(getFooterData(args)))
  );



  return page;
}

export function renderPageLayoutDocument(args) {
  const pageMarkup = renderPageLayout(args).outerHTML;

  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
      >
      <title>${args.siteName}</title>

      <link rel="stylesheet" href="https://unpkg.com/@massds/mds-tokens@${tokensVersion}/dist/index.css">
      <!-- Link to the CSS styles copied from the CSS tab here -->
      <!-- <link rel="stylesheet" href="styles.css"> -->
    </head>
    <body>
      ${pageMarkup}
    </body>
  </html>`;
}
