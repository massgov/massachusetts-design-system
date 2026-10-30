import '@massds/mds-components/semantic-heading.css';
import {
  semanticHeadingDefaults,
  semanticHeadingOptions
} from '../../../../packages/components/src/semantic-heading/semantic-heading.data.js';
import { renderSemanticHeading } from '../../utils/component-renderers.js';
import { controlCategories } from '../../utils/controlCategories.js';

function renderPlayground(args) {
  const preview = document.createElement('div');

  preview.innerHTML = renderSemanticHeading(args);

  return preview;
}

const semanticHeadingControls = {
  text: {
    control: 'text',
    table: { category: controlCategories.content }
  },
  level: {
    control: 'select',
    options: semanticHeadingOptions.level,
    table: { category: controlCategories.design }
  },
  variant: {
    control: 'select',
    options: semanticHeadingOptions.variant,
    table: { category: controlCategories.design }
  }
};

const meta = {
  title: 'Components/Semantic Heading',
  render: renderPlayground,
  argTypes: semanticHeadingControls,
  args: semanticHeadingDefaults,
  parameters: {
    layout: 'padded'
  }
};

export default meta;

export const Playground = {};
