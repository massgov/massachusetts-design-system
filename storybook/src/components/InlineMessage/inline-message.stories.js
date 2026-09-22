import '@massds/mds-components/inline-message.css';
import {
  inlineMessageExampleData,
  inlineMessageOptions
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
    options: inlineMessageOptions.type,
    table: {
      category: controlCategories.design
    }
  },
  variant: {
    control: 'select',
    options: inlineMessageOptions.variant,
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
  }
};

const meta = {
  title: 'Components/Inline Message',
  render: renderPlayground,
  argTypes: inlineMessageControls,
  args: inlineMessageExampleData,
  parameters: {
    layout: 'padded'
  }
};

export default meta;

export const Playground = {};
