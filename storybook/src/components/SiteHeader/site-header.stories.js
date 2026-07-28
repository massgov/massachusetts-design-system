import '@massds/mds-components/site-header.css';
import {
  siteHeaderDefaults
} from '../../../../packages/components/src/site-header/site-header.data.js';
import { renderSiteHeader } from '../../utils/component-renderers.js';
import { controlCategories } from '../../utils/controlCategories.js';
import './site-header.examples.css';

// Storybook render functions return an HTML element.
function createPreview(html, className = '') {
  const preview = document.createElement('div');

  if (className) {
    preview.className = className;
  }

  preview.innerHTML = html;

  return preview;
}

function renderPlayground(args) {
  return createPreview(renderSiteHeader(args));
}

const siteHeaderExamples = [
  {
    label: 'Site name only',
    args: {
      siteName: 'Site name',
      subHeading: ''
    }
  },
  {
    label: 'With subheading',
    args: {
      siteName: 'Site name',
      subHeading: 'Subheading (Optional)'
    }
  }
];

function renderSiteHeaderExample(example) {
  return `
    <section class="mds-site-header-examples__item" aria-label="${example.label}">
      <h3 class="mds-site-header-examples__heading">${example.label}</h3>
      ${renderSiteHeader({
        ...siteHeaderDefaults,
        ...example.args
      })}
    </section>
  `;
}

function renderAllExamples() {
  let examplesHtml = '';

  for (const example of siteHeaderExamples) {
    examplesHtml += renderSiteHeaderExample(example);
  }

  return createPreview(examplesHtml, 'mds-site-header-examples');
}

// Controls are the editable fields in the Storybook UI.
const siteHeaderControls = {
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
  href: {
    control: 'text',
    description: 'Brand link destination.',
    table: {
      category: controlCategories.html
    }
  },
  sealSrc: {
    control: 'text',
    description: 'Optional state seal image override.',
    table: {
      category: controlCategories.html
    }
  },
  sealAlt: {
    control: 'text',
    table: {
      category: controlCategories.content
    }
  }
};

const defaultPlaygroundArgs = {
  href: siteHeaderDefaults.href,
  sealSrc: siteHeaderDefaults.sealSrc,
  sealAlt: siteHeaderDefaults.sealAlt,
  siteName: siteHeaderDefaults.siteName,
  subHeading: siteHeaderDefaults.subHeading
};

const meta = {
  title: 'Components/Site Header',
  render: renderPlayground,
  argTypes: siteHeaderControls,
  args: defaultPlaygroundArgs,
  parameters: {
    layout: 'fullscreen'
  }
};

export default meta;

export const Playground = {
  args: siteHeaderDefaults
};

export const Examples = {
  render: renderAllExamples,
  tags: ['!dev'],
  parameters: {
    controls: {
      disable: true
    },
    layout: 'padded'
  }
};
