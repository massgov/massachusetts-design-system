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
  footerTheme: 'Neutral'
};

export function renderPageLayout(args) {
  const page = document.createElement('div');
  const header = document.createElement('header');
  const main = document.createElement('main');
  const mainContainer = document.createElement('div');

  page.className = 'mds-page-layout';
  header.className = 'mds-page-layout__header';
  main.className = 'mds-page-layout__main';
  mainContainer.className = 'mds-page-layout__main-container';

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
    createMarkupFragment(renderFooter({
      ...footerExampleData,
      siteName: args.siteName,
      theme: args.footerTheme
    }))
  );

  return page;
}
