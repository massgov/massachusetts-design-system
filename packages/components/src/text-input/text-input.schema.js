export const textInputSchema = {
  label: { type: 'string', default: 'Text input label' },
  required: { type: 'boolean', default: false },
  helpText: { type: 'string', default: '' },
  type: { type: 'enum', values: ['text', 'email', 'number', 'password', 'search', 'tel', 'url'], default: 'text' },
  error: { type: 'boolean', default: false },
  errorMessage: { type: 'string', default: 'There is an error' },
  disabled: { type: 'boolean', default: false },
  placeholder: { type: 'string', default: '' },
  detailsLabel: { type: 'string', default: '' },
  detailsContent: { type: 'string', default: '' },
  detailsOpen: { type: 'boolean', default: false }
};
