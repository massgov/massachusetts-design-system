import '@massds/mds-components/inline-link.css';
import {
  inlineLinkDefaults,
  inlineLinkOptions
} from '../../../../packages/components/src/inline-link/inline-link.data.js';
import { controlCategories } from '../../utils/controlCategories.js';
import { renderInlineLink } from '../../utils/component-renderers.js';

function createPreview(html, className = '') {
  const preview = document.createElement('div');

  if (className) {
    preview.className = className;
  }

  preview.innerHTML = html;

  return preview;
}

function renderPlayground(args) {
  const previewClassName = args.color === 'White'
    ? 'mds-text-body-lg mds-padding-inline-xs mds-background-section-brand-primary-mid'
    : 'mds-text-body-lg';

  return createPreview(renderInlineLink(args), previewClassName);
}

const inlineLinkControls = {
  text: {
    control: 'text',
    table: { category: controlCategories.content }
  },
  color: {
    control: 'select',
    options: inlineLinkOptions.color,
    table: { category: controlCategories.design }
  },
  trailingIcon: {
    control: {
      type: 'select',
      labels: { '': 'None' }
    },
    options: inlineLinkOptions.trailingIcon,
    table: { category: controlCategories.design }
  },
  href: {
    control: 'text',
    description: 'Link destination.',
    table: { category: controlCategories.html }
  }
};

const meta = {
  title: 'Components/Inline Link',
  render: renderPlayground,
  argTypes: inlineLinkControls,
  args: inlineLinkDefaults
};

export default meta;

export const Playground = {
  args: inlineLinkDefaults
};
