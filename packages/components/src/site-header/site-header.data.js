import { getSchemaDefaults } from '../shared/schema.js';
import { siteHeaderSchema } from './site-header.schema.js';

export { siteHeaderSchema } from './site-header.schema.js';

export const siteHeaderDefaults = getSchemaDefaults(siteHeaderSchema);
