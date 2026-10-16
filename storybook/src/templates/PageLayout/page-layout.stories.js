import '@massds/mds-components/footer.css';
import '@massds/mds-components/site-header.css';
import '@massds/mds-components/state-banner.css';

import {
  footerOptions
} from '../../../../packages/components/src/footer/footer.data.js';
import { controlCategories } from '../../utils/controlCategories.js';
import {
  pageLayoutDefaults,
  pageLayoutOptions,
  renderPageLayout
} from './page-layout-renderer.js';
import './page-layout.css';

const pageLayoutControls = {
  siteName: {
    control: 'text',
    table: {
      category: controlCategories.content
    }
  },
  subHeading: {
    control: 'text',
    table: {
      category: controlCategories.content
    }
  },
  footerTheme: {
    control: 'inline-radio',
    options: footerOptions.theme,
    table: {
      category: controlCategories.design
    }
  },
  footerVariant: {
    control: 'inline-radio',
    options: pageLayoutOptions.footerVariant,
    table: {
      category: controlCategories.design
    }
  }
};

const meta = {
  title: 'Templates/Page Layout',
  render: renderPageLayout,
  argTypes: pageLayoutControls,
  args: pageLayoutDefaults,
  parameters: {
    layout: 'fullscreen'
  }
};

export default meta;

export const Playground = {};
