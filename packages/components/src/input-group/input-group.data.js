import { getSchemaDefaults } from '../shared/schema.js';
import { inputGroupSchema } from './input-group.schema.js';

export { inputGroupSchema } from './input-group.schema.js';

export const inputGroupDefaults = getSchemaDefaults(inputGroupSchema);
