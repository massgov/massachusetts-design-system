import { getSchemaDefaults, getSchemaOptions } from '../shared/schema.js';
import { iconButtonSchema } from './icon-button.schema.js';

export { iconButtonSchema } from './icon-button.schema.js';

const schemaOptions = getSchemaOptions(iconButtonSchema);

export const iconButtonOptions = {
  color: schemaOptions.color,
  element: schemaOptions.element,
  htmlType: schemaOptions.htmlType,
  icon: schemaOptions.icon,
  type: schemaOptions.type
};

export const iconButtonDefaults = getSchemaDefaults(iconButtonSchema);
