import { getSchemaDefaults, getSchemaOptions } from '../shared/schema.js';
import { inlineMessageSchema } from './inline-message.schema.js';

export { inlineMessageSchema } from './inline-message.schema.js';

const schemaOptions = getSchemaOptions(inlineMessageSchema);

export const inlineMessageOptions = {
  type: schemaOptions.type,
  variant: schemaOptions.variant
};

export const inlineMessageIcons = {
  Informative: 'info',
  Success: 'check-circle',
  Warning: 'warning',
  Error: 'warning-circle'
};

export const inlineMessageDefaults = getSchemaDefaults(inlineMessageSchema);

export const inlineMessageExampleData = {
  ...inlineMessageDefaults,
  descriptionHtml: 'Inline message description goes here which can be up to 150 characters and includes rich text. Lorem ipsum dolor sit amet, <a href="#" noreferer>consectetur adipisicing el</a>.'
};
