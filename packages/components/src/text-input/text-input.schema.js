export const textInputSchema = {
  label: { type: 'string', default: 'Text input label' },
  required: { type: 'boolean', default: false },
  helpText: { type: 'string', default: '' },
  type: { type: 'enum', options: ['text', 'email', 'number', 'password', 'search', 'tel', 'url'], default: 'text' },
  error: { type: 'boolean', default: false },
  errorMessage: { type: 'string', default: 'There is an error' },
  disabled: { type: 'boolean', default: false },
  placeholder: { type: 'string', default: '' },
  detailsText: { type: 'string', default: '' },
  detailsContent: { type: 'string', default: '' }
};
