import { getSchemaDefaults, getSchemaOptions } from '../shared/schema.js';
import { inputWrapperSchema } from './input-wrapper.schema.js';

export { inputWrapperSchema } from './input-wrapper.schema.js';

export const inputWrapperDefaults = getSchemaDefaults(inputWrapperSchema);
export const inputWrapperLabelPositions = getSchemaOptions(inputWrapperSchema).labelPosition;

export const inputWrapperExampleData = {
  ...inputWrapperDefaults,
  id: 'example-input',
  helpText: 'Help text goes here',
  controlMarkup: '<input id="example-input" name="example" type="text" aria-describedby="example-input-help">'
};
