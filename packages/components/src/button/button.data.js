import { getSchemaDefaults, getSchemaOptions } from '../shared/schema.js';
import { buttonSchema } from './button.schema.js';

export { buttonSchema } from './button.schema.js';

const schemaOptions = getSchemaOptions(buttonSchema);

export const buttonTypes = schemaOptions.type;
export const buttonColors = schemaOptions.color;
export const buttonSizes = schemaOptions.size;
export const buttonIcons = schemaOptions.leftIcon;

export const buttonOptions = {
  color: buttonColors,
  icon: buttonIcons,
  size: buttonSizes,
  type: buttonTypes
};

export const buttonDefaults = getSchemaDefaults(buttonSchema);
