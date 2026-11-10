import { getSchemaDefaults, getSchemaOptions } from '../shared/schema.js';
import { mainNavigationSchema } from './main-navigation.schema.js';

export { mainNavigationSchema } from './main-navigation.schema.js';
export const mainNavigationDefaults = getSchemaDefaults(mainNavigationSchema);
export const mainNavigationOptions = getSchemaOptions(mainNavigationSchema);
