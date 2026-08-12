import '@massds/mds-components/menu.css';
import '../../../../packages/components/src/menu/menu.js';
import {
  menuDefaults
} from '../../../../packages/components/src/menu/menu.data.js';
import { renderMenu } from '../../utils/component-renderers.js';
import { controlCategories } from '../../utils/controlCategories.js';
import './menu.examples.css';

let menuStoryInstanceCount = 0;

// Storybook render functions return an HTML element.
function createPreview(html, className = '') {
  const preview = document.createElement('div');

  if (className) {
    preview.className = className;
  }

  preview.innerHTML = html;

  return preview;
}

function createUniqueMenuArgs(args) {
  menuStoryInstanceCount += 1;

  return {
    ...args,
    id: `${args.id || 'mds-menu'}-story-${menuStoryInstanceCount}`
  };
}

function createInteractiveMenuMarkup(args) {
  return `
    <button
      type="button"
      class="mds-popup-menu-trigger"
      aria-haspopup="true"
      aria-controls="${args.id}"
    >
      Open Menu
    </button>
    ${renderMenu(args)}
  `;
}

function renderMenuPreview(args) {
  const renderedArgs = createUniqueMenuArgs(args);
  const preview = createPreview(
    createInteractiveMenuMarkup(renderedArgs),
    'mds-menu-story-playground'
  );

  queueMicrotask(() => {
    if (!window.popupMenu) {
      return;
    }

    window.popupMenu.init(preview);
  });

  return preview;
}

function renderDocsMenuPreview(args) {
  const renderedArgs = createUniqueMenuArgs(args);

  return createPreview(
    renderMenu(renderedArgs),
    'mds-menu-story-preview'
  );
}

const menuExamples = [
  {
    label: 'Default menu example',
    args: menuDefaults
  },
  {
    label: 'Menu items without icons',
    args: {
      ...menuDefaults,
      noIcons: true
    }
  },
  {
    label: 'Menu with disabled items',
    args: {
      ...menuDefaults,
      items: [
        {
          type: 'button',
          buttonType: 'button',
          label: 'Primary action',
          iconName: 'smiley'
        },
        {
          type: 'button',
          buttonType: 'button',
          label: 'Primary disabled action',
          iconName: 'smiley',
          disabled: true
        },
        {
          type: 'button',
          buttonType: 'button',
          label: 'Secondary action',
          iconName: 'smiley'
        },
        {
          type: 'button',
          buttonType: 'button',
          label: 'Secondary disabled action',
          iconName: '',
          disabled: true
        }
      ]
    }
  }
];

function renderMenuExample(example) {
  const renderedArgs = createUniqueMenuArgs(example.args);

  return `
    <section class="mds-menu-story-examples__item" aria-label="${example.label}">
      <h3 class="mds-menu-story-examples__heading">${example.label}</h3>
      <div class="mds-menu-story-preview">
        ${renderMenu(renderedArgs)}
      </div>
    </section>
  `;
}

function renderAllExamples() {
  let examplesHtml = '';

  for (const example of menuExamples) {
    examplesHtml += renderMenuExample(example);
  }

  return createPreview(examplesHtml, 'mds-menu-story-examples');
}

const menuControls = {
  id: {
    control: 'text',
    table: {
      category: controlCategories.html
    }
  },
  className: {
    control: 'text',
    table: {
      category: controlCategories.html
    }
  },
  ariaLabel: {
    control: 'text',
    table: {
      category: controlCategories.content
    }
  },
  ariaLabelledby: {
    control: 'text',
    description: 'Optional element id used instead of aria-label.',
    table: {
      category: controlCategories.html
    }
  },
  noIcons: {
    control: 'boolean',
    table: {
      category: controlCategories.design
    }
  },
  items: {
    control: 'object',
    description: 'Menu items rendered as links or buttons.',
    table: {
      category: controlCategories.content
    }
  }
};

const meta = {
  title: 'Components/Menu',
  render: renderMenuPreview,
  argTypes: menuControls,
  args: menuDefaults,
  parameters: {
    layout: 'padded'
  }
};

export default meta;

export const Playground = {
  args: {
    id: "mds-menu-5-story-2"
  }
};

export const DocsPreview = {
  render: renderDocsMenuPreview,
  tags: ['!dev']
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
