import { inputWrapperSchema } from '../input-wrapper/input-wrapper.schema.js';

// These fields belong to the wrapper's internal composition API.
const { controlMarkup, labelPosition, ...sharedInputSchema } = inputWrapperSchema;

export const textInputSchema = {
  ...sharedInputSchema,
  label: { type: 'string', default: 'Text input label' },
  type: { type: 'enum', options: ['text', 'email', 'number', 'password', 'search', 'tel', 'url'], default: 'text' },
  placeholder: { type: 'string', default: '' }
};
