import { getSchemaDefaults } from '../shared/schema.js';
import { textInputSchema } from './text-input.schema.js';

export { textInputSchema } from './text-input.schema.js';

export const textInputDefaults = getSchemaDefaults(textInputSchema);

export const textInputExampleData = {
  ...textInputDefaults,
  helpText: 'Help text goes here',
  errorMessage: 'Error message goes here'
};
