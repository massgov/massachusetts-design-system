import '@massds/mds-components/inline-message.css';
import {
  inlineMessageDefaults
} from '../../../../packages/components/src/inline-message/inline-message.data.js';
import { renderInlineMessage } from '../../utils/component-renderers.js';
import { controlCategories } from '../../utils/controlCategories.js';

function createPreview(html) {
  const preview = document.createElement('div');

  preview.innerHTML = html;

  return preview;
}

function renderPlayground(args) {
  return createPreview(renderInlineMessage(args));
}

const inlineMessageControls = {
  type: {
    control: 'select',
    options: ['Informative', 'Success', 'Warning', 'Error', 'Neutral'],
    table: {
      category: controlCategories.design
    }
  },
  heading: {
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
  className: {
    control: 'text',
    table: {
      category: controlCategories.html
    }
  }
};

const meta = {
  title: 'Components/Inline Message',
  render: renderPlayground,
  argTypes: inlineMessageControls,
  args: inlineMessageDefaults,
  parameters: {
    layout: 'padded'
  }
};

export default meta;

export const Playground = {};
