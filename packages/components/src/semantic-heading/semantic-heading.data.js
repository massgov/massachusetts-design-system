import { getSchemaDefaults, getSchemaOptions } from '../shared/schema.js';
import { semanticHeadingSchema } from './semantic-heading.schema.js';

export { semanticHeadingSchema } from './semantic-heading.schema.js';

const schemaOptions = getSchemaOptions(semanticHeadingSchema);

export const semanticHeadingOptions = {
  level: schemaOptions.level,
  variant: schemaOptions.variant
};

export const semanticHeadingDefaults = getSchemaDefaults(semanticHeadingSchema);
