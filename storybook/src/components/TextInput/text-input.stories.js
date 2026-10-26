import '@massds/mds-components/text-input.css';
import { textInputExampleData } from '../../../../packages/components/src/text-input/text-input.data.js';
import { renderTextInput } from '../../utils/component-renderers.js';
import { controlCategories } from '../../utils/controlCategories.js';

function renderPlayground(args) {
  const preview = document.createElement('div');

  preview.style.inlineSize = '260px';
  preview.style.maxInlineSize = '100%';
  preview.innerHTML = renderTextInput(args);

  return preview;
}

const textInputControls = {
  label: {
    control: 'text',
    table: { category: controlCategories.content }
  },
  required: {
    control: 'boolean',
    table: { category: controlCategories.design }
  },
    helpText: {
    control: 'text',
    table: { category: controlCategories.content }
  },
  type: {
    control: 'select',
    options: ['text', 'email', 'password', 'tel', 'url'],
    table: { category: controlCategories.design }
  },
  error: {
    control: 'boolean',
    table: { category: controlCategories.design }
  },
  errorMessage: {
    control: 'text',
    table: { category: controlCategories.design }
  },
  disabled: {
    control: 'boolean',
    table: { category: controlCategories.design }
  },
  placeholder: {
    control: 'text',
    table: { category: controlCategories.content }
  },
  detailsLabel: {
    control: 'text',
    table: { category: controlCategories.content }
  },
  detailsContent: {
    control: 'text',
    description: 'Supports rich text.',
    table: { category: controlCategories.content }
  },
  detailsOpen: {
    control: 'boolean',
    table: { category: controlCategories.design }
  }
};

const meta = {
  title: 'Components/Text Input',
  render: renderPlayground,
  argTypes: textInputControls,
  args: textInputExampleData,
  parameters: {
    layout: 'padded'
  }
};

export default meta;

export const Playground = {};
