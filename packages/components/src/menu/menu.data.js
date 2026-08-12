import { getSchemaDefaults } from '../shared/schema.js';
import { menuSchema } from './menu.schema.js';

export { menuSchema } from './menu.schema.js';

export const menuItemTypes = ['button', 'link'];
export const menuButtonTypes = ['button', 'submit', 'reset'];
export const menuDefaults = getSchemaDefaults(menuSchema);
