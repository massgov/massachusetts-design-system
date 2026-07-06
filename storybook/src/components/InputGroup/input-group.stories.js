import '@massds/mds-components/input-group.css';
import {
  inputGroupDefaults
} from '../../../../packages/components/src/input-group/input-group.data.js';
import { controlCategories } from '../../utils/controlCategories.js';
import { renderInputGroup } from '../../utils/component-renderers.js';

function createPreview(html, className = '') {
  const preview = document.createElement('div');

  if (className) {
    preview.className = className;
  }

  preview.innerHTML = html;

  return preview;
}

function renderPlayground(args) {
  return createPreview(renderInputGroup(args));
}

const meta = {
  title: 'Components/Input Group',
  render: renderPlayground,
  parameters: {
    layout: 'centered'
  }
};

export default meta;

export const Playground = {
  args: inputGroupDefaults,
  argTypes: {
    label: {
      control: 'text',
      table: {
        category: controlCategories.content
      }
    },
    placeholder: {
      control: 'text',
      table: {
        category: controlCategories.content
      }
    },
    selectLabel: {
      control: 'text',
      table: {
        category: controlCategories.content
      }
    },
    searchButtonLabel: {
      control: 'text',
      table: {
        category: controlCategories.content
      }
    },
    name: {
      control: 'text',
      table: {
        category: controlCategories.html
      }
    },
    value: {
      control: 'text',
      table: {
        category: controlCategories.content
      }
    },
    id: {
      control: 'text',
      table: {
        category: controlCategories.html
      }
    },
    showLabel: {
      control: 'boolean',
      table: {
        category: controlCategories.content
      }
    }
  }
};
