import { getSchemaDefaults, getSchemaOptions } from '../shared/schema.js';
import { badgeSchema } from './badge.schema.js';

export { badgeSchema } from './badge.schema.js';

export const badgeOptions = getSchemaOptions(badgeSchema);
export const badgeDefaults = getSchemaDefaults(badgeSchema);
