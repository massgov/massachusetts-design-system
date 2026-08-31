import { getSchemaDefaults, getSchemaOptions } from '../shared/schema.js';
import { actionLinkSchema } from './action-link.schema.js';

export { actionLinkSchema } from './action-link.schema.js';

const schemaOptions = getSchemaOptions(actionLinkSchema);

export const actionLinkOptions = {
  color: schemaOptions.color,
  icon: schemaOptions.leftIcon,
  iconWeight: schemaOptions.iconWeight,
  size: schemaOptions.size
};

export const actionLinkIconSizes = {
  Small: 'XS',
  Medium: 'SM',
  Large: 'MD'
};

export const actionLinkDefaults = getSchemaDefaults(actionLinkSchema);
