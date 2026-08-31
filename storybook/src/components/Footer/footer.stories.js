import '@massds/mds-components/action-link.css';
import '@massds/mds-components/footer.css';
import {
  footerDefaults,
  footerExampleData,
  footerOptions
} from '../../../../packages/components/src/footer/footer.data.js';
import { renderFooter } from '../../utils/component-renderers.js';
import { controlCategories } from '../../utils/controlCategories.js';
import './footer.examples.css';

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
  return createPreview(renderFooter(args));
}

const footerExamples = [
  {
    label: 'Neutral',
    args: {
      theme: 'Neutral'
    }
  },
  {
    label: 'Primary',
    args: {
      theme: 'Primary'
    }
  }
];

function renderFooterExample(example) {
  return `
    <section class="mds-footer-examples__item" aria-label="${example.label}">
      <h3 class="mds-footer-examples__heading">${example.label}</h3>
      ${renderFooter({
        ...footerExampleData,
        ...example.args
      })}
    </section>
  `;
}

function renderAllExamples() {
  let examplesHtml = '';

  for (const example of footerExamples) {
    examplesHtml += renderFooterExample(example);
  }

  return createPreview(examplesHtml, 'mds-footer-examples');
}

// Controls are the editable fields in the Storybook UI.
const footerControls = {
  theme: {
    control: 'inline-radio',
    options: footerOptions.theme,
    table: {
      category: controlCategories.design
    }
  },
  showExternalLinkIcon: {
    control: 'boolean',
    description: 'Shows an external-link icon after each link in a link group.',
    table: {
      category: controlCategories.design
    }
  },
  siteName: {
    control: 'text',
    table: {
      category: controlCategories.content
    }
  },
  descriptionHtml: {
    control: 'text',
    table: {
      category: controlCategories.content
    }
  },
  socialLinks: {
    control: 'object',
    table: {
      category: controlCategories.content
    }
  },
  contactHeading: {
    control: 'text',
    table: {
      category: controlCategories.content
    }
  },
  contactItems: {
    control: 'object',
    table: {
      category: controlCategories.content
    }
  },
  linkGroups: {
    control: 'object',
    table: {
      category: controlCategories.content
    }
  },
  legalLinks: {
    control: 'object',
    table: {
      category: controlCategories.content
    }
  },
  fundingText: {
    control: 'text',
    table: {
      category: controlCategories.content
    }
  },
  trademarkHtml: {
    control: 'text',
    table: {
      category: controlCategories.content
    }
  },
  siteNameId: {
    control: 'text',
    table: {
      category: controlCategories.html
    }
  },
  sealAlt: {
    control: 'text',
    table: {
      category: controlCategories.html
    }
  },
  socialLabel: {
    control: 'text',
    table: {
      category: controlCategories.html
    }
  },
  contactHeadingId: {
    control: 'text',
    table: {
      category: controlCategories.html
    }
  },
  legalLabel: {
    control: 'text',
    table: {
      category: controlCategories.html
    }
  }
};

const defaultPlaygroundArgs = {
  theme: footerExampleData.theme,
  showExternalLinkIcon: footerDefaults.showExternalLinkIcon,
  siteNameId: footerExampleData.siteNameId,
  siteName: footerDefaults.siteName,
  sealAlt: footerExampleData.sealAlt,
  socialLabel: footerExampleData.socialLabel,
  socialLinks: footerExampleData.socialLinks,
  descriptionHtml: footerExampleData.descriptionHtml,
  contactHeadingId: footerExampleData.contactHeadingId,
  contactHeading: footerExampleData.contactHeading,
  contactItems: footerExampleData.contactItems,
  linkGroups: footerExampleData.linkGroups,
  legalLabel: footerExampleData.legalLabel,
  legalLinks: footerExampleData.legalLinks,
  fundingText: footerExampleData.fundingText,
  trademarkHtml: footerExampleData.trademarkHtml
};

const meta = {
  title: 'Components/Footer',
  render: renderPlayground,
  argTypes: footerControls,
  args: defaultPlaygroundArgs,
  parameters: {
    layout: 'fullscreen'
  }
};

export default meta;

export const Playground = {
  args: defaultPlaygroundArgs
};

export const Examples = {
  render: renderAllExamples,
  tags: ['!dev'],
  parameters: {
    controls: {
      disable: true
    },
    layout: 'fullscreen'
  }
};
