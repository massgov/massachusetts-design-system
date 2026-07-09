import { getSchemaDefaults } from '../shared/schema.js';
import { stateBannerSchema } from './state-banner.schema.js';

export { stateBannerSchema } from './state-banner.schema.js';

export const stateBannerDefaults = getSchemaDefaults(stateBannerSchema);

