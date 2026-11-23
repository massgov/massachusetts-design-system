import { getSchemaDefaults, getSchemaOptions } from '../shared/schema.js';
import { textInputSchema } from './text-input.schema.js';

export { textInputSchema } from './text-input.schema.js';

export const textInputDefaults = getSchemaDefaults(textInputSchema);
export const textInputTypes = getSchemaOptions(textInputSchema).type;

export const textInputExampleData = {
  ...textInputDefaults,
  helpText: 'Help text goes here'
};
