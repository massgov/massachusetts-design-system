import { getSchemaDefaults, getSchemaOptions } from '../shared/schema.js';
import { iconSchema } from './icon.schema.js';

export { iconSchema } from './icon.schema.js';

const schemaOptions = getSchemaOptions(iconSchema);

export const iconWeights = schemaOptions.weight;
export const iconDefaults = getSchemaDefaults(iconSchema);
export const iconOptions = schemaOptions;
