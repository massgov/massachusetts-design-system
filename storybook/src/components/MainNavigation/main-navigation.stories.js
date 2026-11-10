import { useEffect } from 'storybook/preview-api';
import '@massds/mds-components/main-navigation.css';
import { mainNavigationDefaults, mainNavigationOptions } from '../../../../packages/components/src/main-navigation/main-navigation.data.js';
import { initMainNavigation } from '../../../../packages/components/src/main-navigation/main-navigation.js';
import { renderMainNavigation } from '../../utils/component-renderers.js';
import { controlCategories } from '../../utils/controlCategories.js';

let instance = 0;

function renderPlayground(args) {
  const preview = document.createElement('div');
  preview.innerHTML = renderMainNavigation({ ...args, id: `${args.id || 'main-navigation'}-story-${++instance}` });
  useEffect(() => initMainNavigation(preview), [preview]);
  return preview;
}

export default {
  title: 'Components/Main Navigation',
  render: renderPlayground,
  args: mainNavigationDefaults,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    variant: {
      control: 'select',
      options: mainNavigationOptions.variant,
      description: 'Responsive is horizontal above 768px and stacked at 768px and below. Stacked stays vertical.',
      table: { category: controlCategories.design }
    },
    items: {
      control: 'object',
      description: 'Items accept text, href, children, current, expanded, and optional stackedText.',
      table: { category: controlCategories.content }
    },
    id: { control: 'text', table: { category: controlCategories.html } },
    ariaLabel: { control: 'text', table: { category: controlCategories.html } }
  }
};

export const Playground = {};
