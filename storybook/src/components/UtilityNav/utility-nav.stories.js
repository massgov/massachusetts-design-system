import '@massds/mds-components/button.css';
import '@massds/mds-components/utility-nav.css';
import {
  utilityNavDefaults
} from '../../../../packages/components/src/utility-nav/utility-nav.data.js';
import { renderUtilityNav } from '../../utils/component-renderers.js';
import { controlCategories } from '../../utils/controlCategories.js';
import './utility-nav.examples.css';

function createPreview(html, className = '') {
  const preview = document.createElement('div');

  if (className) {
    preview.className = className;
  }

  preview.innerHTML = html;

  return preview;
}

function renderPlayground(args) {
  return createPreview(renderUtilityNav(args));
}

const utilityNavExamples = [
  {
    label: 'Default',
    args: utilityNavDefaults
  },
  {
    label: 'Hamburger menu only',
    args: {
      ...utilityNavDefaults,
      actionButtons: []
    }
  },
  {
    label: 'Utility buttons only',
    args: {
      ...utilityNavDefaults,
      startVariant: 'none'
    }
  },
  {
    label: 'Mass.gov home link and utility buttons',
    args: {
      ...utilityNavDefaults,
      startVariant: 'home-link'
    }
  }
];

function renderUtilityNavExample(example) {
  return `
    <section class="mds-utility-nav-examples__item" aria-label="${example.label}">
      <h3 class="mds-utility-nav-examples__heading">${example.label}</h3>
      ${renderUtilityNav(example.args)}
    </section>
  `;
}

function renderAllExamples() {
  let examplesHtml = '';

  for (const example of utilityNavExamples) {
    examplesHtml += renderUtilityNavExample(example);
  }

  return createPreview(examplesHtml, 'mds-utility-nav-examples');
}

const utilityNavControls = {
  className: {
    control: 'text',
    table: {
      category: controlCategories.html
    }
  },
  startVariant: {
    control: 'select',
    options: ['menu', 'home-link', 'none'],
    table: {
      category: controlCategories.design
    }
  },
  menuButtonText: {
    control: 'text',
    table: {
      category: controlCategories.content
    }
  },
  menuButtonAriaLabel: {
    control: 'text',
    table: {
      category: controlCategories.html
    }
  },
  menuButtonExpanded: {
    control: 'boolean',
    table: {
      category: controlCategories.html
    }
  },
  menuButtonControls: {
    control: 'text',
    table: {
      category: controlCategories.html
    }
  },
  homeLinkText: {
    control: 'text',
    table: {
      category: controlCategories.content
    }
  },
  homeLinkHref: {
    control: 'text',
    table: {
      category: controlCategories.html
    }
  },
  homeLinkAriaLabel: {
    control: 'text',
    table: {
      category: controlCategories.html
    }
  },
  actionButtons: {
    control: 'object',
    table: {
      category: controlCategories.content
    }
  }
};

const meta = {
  title: 'Components/Utility Navigation',
  render: renderPlayground,
  argTypes: utilityNavControls,
  args: utilityNavDefaults,
  parameters: {
    layout: 'fullscreen'
  }
};

export default meta;

export const Playground = {
  args: utilityNavDefaults
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
