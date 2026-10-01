import { getSchemaDefaults, getSchemaOptions } from '../shared/schema.js';
import { inlineLinkSchema } from './inline-link.schema.js';

export { inlineLinkSchema } from './inline-link.schema.js';

const schemaOptions = getSchemaOptions(inlineLinkSchema);

export const inlineLinkOptions = {
  color: schemaOptions.color,
  trailingIcon: schemaOptions.trailingIcon
};

export const inlineLinkDefaults = getSchemaDefaults(inlineLinkSchema);
