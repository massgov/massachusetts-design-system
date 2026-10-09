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
      navigationType: 'none'
    }
  },
  {
    label: 'Mass.gov home link and utility buttons',
    args: {
      ...utilityNavDefaults,
      navigationType: 'home-link'
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
  navigationType: {
    control: 'select',
    options: ['menu', 'home-link', 'none'],
    table: {
      category: controlCategories.design
    }
  },
  homeLinkText: {
    control: 'text',
    description: 'Only applicable when navigationType is set to home-link',
    table: {
      category: controlCategories.content
    }
  },
  homeLinkHref: {
    control: 'text',
    description: 'Only applicable when navigationType is set to home-link',
    table: {
      category: controlCategories.content
    }
  },
  homeLinkAriaLabel: {
    control: 'text',
    description: 'Only applicable when navigationType is set to home-link',
    table: {
      category: controlCategories.content
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
