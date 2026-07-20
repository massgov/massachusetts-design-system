import { getSchemaDefaults, getSchemaOptions } from '../shared/schema.js';
import { iconButtonSchema } from './icon-button.schema.js';

export { iconButtonSchema } from './icon-button.schema.js';

const schemaOptions = getSchemaOptions(iconButtonSchema);

export const iconButtonElements = schemaOptions.element;
export const iconButtonTypes = schemaOptions.type;
export const iconButtonColors = schemaOptions.color;
export const iconButtonIcons = schemaOptions.icon;
export const htmlButtonTypes = schemaOptions.htmlType;

export const iconButtonOptions = {
  color: iconButtonColors,
  element: iconButtonElements,
  htmlType: htmlButtonTypes,
  icon: iconButtonIcons,
  type: iconButtonTypes
};

export const iconButtonDefaults = getSchemaDefaults(iconButtonSchema);
