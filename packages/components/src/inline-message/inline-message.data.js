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
  description: 'Lorem ipsum dolor sit amet, , consectetur adipiscing elit. Aliquam sed dolor at <a href="#" rel="noreferrer">quam condimentum interdum</a>.' 
};
