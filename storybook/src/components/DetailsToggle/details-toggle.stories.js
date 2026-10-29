import '@massds/mds-components/details-toggle.css';
import { detailsToggleDefaults } from '../../../../packages/components/src/details-toggle/details-toggle.data.js';
import { renderDetailsToggle } from '../../utils/component-renderers.js';
import { controlCategories } from '../../utils/controlCategories.js';

function renderPlayground(args) {
  const preview = document.createElement('div');

  preview.innerHTML = renderDetailsToggle(args);

  return preview;
}

const detailsToggleControls = {
  text: {
    control: 'text',
    table: { category: controlCategories.content }
  },
  content: {
    control: 'text',
    description: 'Supports rich text, including links and other inline HTML.',
    table: { category: controlCategories.content }
  }
};

const meta = {
  title: 'Components/Details Toggle',
  render: renderPlayground,
  argTypes: detailsToggleControls,
  args: detailsToggleDefaults,
  parameters: {
    layout: 'padded'
  }
};

export default meta;

export const Playground = {};
