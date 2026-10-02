import '@massds/mds-components/action-link.css';
import '@massds/mds-components/footer.css';
import '@massds/mds-components/icon-button.css';

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
  siteName: {
    control: 'text',
    table: {
      category: controlCategories.content
    }
  },
  siteLink: {
    control: 'text',
    table: {
      category: controlCategories.content
    }
  },
  orgLogo: {
    type: {
    name: 'string',
    required: false
    },
    control: {
      type: 'text'
    },
    description: 'This is an optional second logo rendered at 56px height to represent the organization',
    table: {
      category: controlCategories.content
    }
  },
  description: {
    control: 'text',
    description: 'Can include rich text',
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
  legalLinksOptional: {
    control: 'object',
    table: {
      category: controlCategories.content
    }
  },
  supportingContent: {
    control: 'text',
    description: 'Can include rich text',
    table: {
      category: controlCategories.content
    }
  },
  trademark: {
    control: 'text',
    description: 'Can include rich text',
    table: {
      category: controlCategories.content
    }
  },
};

const defaultPlaygroundArgs = {
  theme: footerExampleData.theme,
  siteName: footerDefaults.siteName,
  siteLink: footerExampleData.siteLink,
  orgLogo: footerExampleData.orgLogo,
  socialLinks: footerExampleData.socialLinks,
  description: footerExampleData.description,
  contactItems: footerExampleData.contactItems,
  linkGroups: footerExampleData.linkGroups,
  legalLinks: footerExampleData.legalLinks,
  legalLinksOptional: footerExampleData.legalLinksOptional,
  supportingContent: footerExampleData.supportingContent,
  trademark: footerExampleData.trademark
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
