import { getSchemaDefaults, getSchemaOptions } from '../shared/schema.js';
import { popupMenuSchema } from './popup-menu.schema.js';

export { popupMenuSchema } from './popup-menu.schema.js';

const schemaOptions = getSchemaOptions(popupMenuSchema);

export const popupMenuOptions = {
  icon: schemaOptions.itemIcon,
  itemHtmlType: schemaOptions.itemHtmlType,
  itemType: schemaOptions.itemType,
  triggerHtmlType: schemaOptions.triggerHtmlType
};

export const popupMenuDefaults = getSchemaDefaults(popupMenuSchema);
