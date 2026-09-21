import { getSchemaDefaults, getSchemaOptions } from '../shared/schema.js';
import { inlineMessageSchema } from './inline-message.schema.js';

export { inlineMessageSchema } from './inline-message.schema.js';

const schemaOptions = getSchemaOptions(inlineMessageSchema);

export const inlineMessageOptions = {
  type: schemaOptions.type
};

export const inlineMessageIcons = {
  Informative: 'info',
  Success: 'check-circle',
  Warning: 'warning',
  Error: 'warning-circle',
  Neutral: 'info'
};

export const inlineMessageDefaults = getSchemaDefaults(inlineMessageSchema);
