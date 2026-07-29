import '@massds/mds-components/popup-menu.css';
import {
  popupMenuDefaults,
  popupMenuOptions
} from '../../../../packages/components/src/popup-menu/popup-menu.data.js';
import { controlCategories } from '../../utils/controlCategories.js';
import { renderPopupMenu } from '../../utils/component-renderers.js';
import './popup-menu.examples.css';

// Storybook render functions return an HTML element.
function createPreview(html, className = '') {
  const preview = document.createElement('div');

  if (className) {
    preview.className = className;
  }

  preview.innerHTML = html;
  queueMicrotask(() => initializePopupMenus(preview));

  return preview;
}

function getMenuItems(menu) {
  return Array.from(menu.querySelectorAll('[role="menuitem"]')).filter((item) =>
    !item.hasAttribute('disabled') && item.getAttribute('aria-disabled') !== 'true'
  );
}

function setActiveMenuItem(menu, nextItem) {
  getMenuItems(menu).forEach((item) => {
    item.setAttribute('tabindex', item === nextItem ? '0' : '-1');
  });
}

function closeMenu(menu) {
  const trigger = menu.dataset.triggerId
    ? document.getElementById(menu.dataset.triggerId)
    : null;

  menu.style.display = 'none';
  getMenuItems(menu).forEach((item) => item.setAttribute('tabindex', '-1'));

  if (trigger) {
    trigger.setAttribute('aria-expanded', 'false');
  }
}

function positionMenu(menu, trigger) {
  const offset = parseFloat(
    getComputedStyle(menu).getPropertyValue('--mds-popup-menu-offset')
  ) || 4;
  const viewportPadding = parseFloat(
    getComputedStyle(menu).getPropertyValue('--mds-popup-menu-viewport-padding')
  ) || 16;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  menu.style.maxWidth = `${Math.min(480, viewportWidth - viewportPadding * 2)}px`;
  menu.style.maxHeight = `${viewportHeight - viewportPadding * 2}px`;
  menu.style.left = '0px';
  menu.style.top = '0px';

  const triggerRect = trigger.getBoundingClientRect();
  const menuRect = menu.getBoundingClientRect();
  let left = triggerRect.left;
  let top = triggerRect.bottom + offset;

  if (left + menuRect.width > viewportWidth - viewportPadding) {
    left = triggerRect.right - menuRect.width;
  }

  if (top + menuRect.height > viewportHeight - viewportPadding) {
    top = triggerRect.top - offset - menuRect.height;
  }

  menu.style.left = `${Math.max(viewportPadding, left)}px`;
  menu.style.top = `${Math.max(viewportPadding, top)}px`;
}

function openMenu(menu, trigger) {
  const items = getMenuItems(menu);

  menu.style.display = 'flex';
  trigger.setAttribute('aria-expanded', 'true');
  positionMenu(menu, trigger);

  if (items.length) {
    setActiveMenuItem(menu, items[0]);
  }
}

function initializePopupMenus(root) {
  const triggers = root.querySelectorAll('.mds-popup-menu-trigger');

  triggers.forEach((trigger) => {
    if (trigger.dataset.storybookInitialized === 'true') {
      return;
    }

    const menuId = trigger.getAttribute('aria-controls');
    const menu = menuId ? root.querySelector(`#${CSS.escape(menuId)}`) : null;

    if (!menu) {
      return;
    }

    if (!trigger.id) {
      trigger.id = `${menuId}-trigger`;
    }

    trigger.dataset.storybookInitialized = 'true';
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-haspopup', 'menu');
    menu.dataset.triggerId = trigger.id;

    if (!menu.hasAttribute('aria-labelledby') && !menu.hasAttribute('aria-label')) {
      menu.setAttribute('aria-labelledby', trigger.id);
    }

    getMenuItems(menu).forEach((item) => item.setAttribute('tabindex', '-1'));

    trigger.addEventListener('click', () => {
      const isOpen = menu.style.display === 'flex';

      root.querySelectorAll('.mds-popup-menu').forEach(closeMenu);

      if (!isOpen) {
        openMenu(menu, trigger);
      }
    });

    menu.addEventListener('click', (event) => {
      if (event.target.closest('[role="menuitem"]')) {
        closeMenu(menu);
      }
    });

    menu.addEventListener('keydown', (event) => {
      const items = getMenuItems(menu);
      const currentItem = event.target.closest('[role="menuitem"]');
      const currentIndex = items.indexOf(currentItem);

      if (!items.length || currentIndex === -1) {
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        const nextItem = items[(currentIndex + 1) % items.length];
        setActiveMenuItem(menu, nextItem);
        nextItem.focus();
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        const nextItem = items[(currentIndex - 1 + items.length) % items.length];
        setActiveMenuItem(menu, nextItem);
        nextItem.focus();
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu(menu);
        trigger.focus();
      }
    });
  });
}

function renderPlayground(args) {
  return createPreview(renderPopupMenu(args), 'mds-popup-menu-story');
}

const longItemText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non diam sit amet lacus molestie dapibus molestie eu diam.';

const popupMenuExamples = [
  {
    label: 'Default links',
    args: {
      id: 'mds-popup-menu-story-default',
      triggerId: 'mds-popup-menu-story-default-trigger',
      triggerText: 'Open menu',
      items: [
        {
          text: longItemText,
          href: '#',
          icon: 'smiley'
        },
        {
          text: 'Select item',
          href: '#',
          icon: 'smiley'
        },
        {
          text: 'Select item',
          href: '#',
          icon: 'smiley'
        }
      ]
    }
  },
  {
    label: 'Right aligned',
    className: 'mds-popup-menu-story__example--end',
    args: {
      id: 'mds-popup-menu-story-right',
      triggerId: 'mds-popup-menu-story-right-trigger',
      triggerText: 'Open right-aligned menu',
      items: [
        {
          text: longItemText,
          href: '#',
          icon: 'smiley'
        },
        {
          text: 'Select item',
          href: '#',
          icon: 'smiley'
        }
      ]
    }
  },
  {
    label: 'No icons',
    args: {
      id: 'mds-popup-menu-story-no-icons',
      triggerId: 'mds-popup-menu-story-no-icons-trigger',
      triggerText: 'Open menu without icons',
      noIcons: true,
      items: [
        {
          text: longItemText,
          href: '#'
        },
        {
          text: 'Select item',
          href: '#'
        },
        {
          text: 'Select item',
          href: '#'
        }
      ]
    }
  },
  {
    label: 'Mixed icons',
    args: {
      id: 'mds-popup-menu-story-mixed-icons',
      triggerId: 'mds-popup-menu-story-mixed-icons-trigger',
      triggerText: 'Open mixed icon menu',
      items: [
        {
          text: 'Select item with icon',
          href: '#',
          icon: 'smiley'
        },
        {
          text: 'Select item without icon',
          href: '#'
        },
        {
          text: 'Another item with icon',
          href: '#',
          icon: 'smiley'
        }
      ]
    }
  },
  {
    label: 'Disabled buttons',
    args: {
      id: 'mds-popup-menu-story-disabled-buttons',
      triggerId: 'mds-popup-menu-story-disabled-buttons-trigger',
      triggerText: 'Open button menu',
      items: [
        {
          type: 'button',
          text: 'Enabled action',
          icon: 'smiley'
        },
        {
          type: 'button',
          text: 'Disabled action',
          icon: 'smiley',
          disabled: true
        },
        {
          type: 'button',
          text: 'Final enabled action',
          icon: 'smiley'
        }
      ]
    }
  }
];

function renderPopupMenuExample(example) {
  const className = [
    'mds-popup-menu-story__example',
    example.className
  ].filter(Boolean).join(' ');

  return `
    <section class="${className}" aria-label="${example.label}">
      <h3 class="mds-popup-menu-story__heading">${example.label}</h3>
      ${renderPopupMenu({
        ...popupMenuDefaults,
        ...example.args
      })}
    </section>
  `;
}

function renderAllExamples() {
  let examplesHtml = '';

  for (const example of popupMenuExamples) {
    examplesHtml += renderPopupMenuExample(example);
  }

  return createPreview(examplesHtml, 'mds-popup-menu-story mds-popup-menu-story__examples');
}

const popupMenuControls = {
  triggerText: {
    control: 'text',
    table: {
      category: controlCategories.content
    }
  },
  noIcons: {
    control: 'boolean',
    table: {
      category: controlCategories.design
    }
  },
  id: {
    control: 'text',
    table: {
      category: controlCategories.html
    }
  },
  triggerId: {
    control: 'text',
    table: {
      category: controlCategories.html
    }
  },
  triggerHtmlType: {
    control: 'select',
    options: popupMenuOptions.triggerHtmlType,
    table: {
      category: controlCategories.html
    }
  },
  labelledBy: {
    control: 'text',
    table: {
      category: controlCategories.html
    }
  },
  label: {
    control: 'text',
    table: {
      category: controlCategories.html
    }
  },
  items: {
    control: 'object',
    table: {
      category: controlCategories.content
    }
  }
};

const defaultPlaygroundArgs = {
  id: popupMenuDefaults.id,
  triggerId: popupMenuDefaults.triggerId,
  triggerText: popupMenuDefaults.triggerText,
  triggerHtmlType: popupMenuDefaults.triggerHtmlType,
  labelledBy: popupMenuDefaults.labelledBy,
  label: popupMenuDefaults.label,
  noIcons: popupMenuDefaults.noIcons,
  items: popupMenuDefaults.items
};

const meta = {
  title: 'Components/Popup Menu',
  render: renderPlayground,
  argTypes: popupMenuControls,
  args: defaultPlaygroundArgs,
  parameters: {
    layout: 'padded'
  }
};

export default meta;

export const Playground = {
  args: popupMenuDefaults
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
