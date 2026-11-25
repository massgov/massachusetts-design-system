import '@massds/mds-components/badge.css';
import {
  badgeDefaults,
  badgeOptions
} from '../../../../packages/components/src/badge/badge.data.js';
import { renderBadge } from '../../utils/component-renderers.js';
import { controlCategories } from '../../utils/controlCategories.js';

export default {
  title: 'Components/Badge',
  render: (args) => {
    const preview = document.createElement('div');
    preview.innerHTML = renderBadge(args);
    return preview;
  },
  args: badgeDefaults,
  argTypes: {
    text: {
      control: 'text',
      table: { category: controlCategories.content }
    },
    type: {
      control: 'select',
      options: badgeOptions.type,
      table: { category: controlCategories.design }
    }
  }
};

export const Playground = {};
