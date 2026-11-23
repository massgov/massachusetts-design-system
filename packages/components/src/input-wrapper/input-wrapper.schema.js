export const inputWrapperSchema = {
  //id: { type: 'string', default: '' },
  label: { type: 'string', default: 'Input label' },
  labelPosition: { type: 'enum', options: ['above', 'after'], default: 'above' },
  required: { type: 'boolean', default: false },
  helpText: { type: 'string', default: '' },
  detailsText: { type: 'string', default: '' },
  detailsContent: { type: 'string', default: '' },
  error: { type: 'boolean', default: false },
  errorMessage: { type: 'string', default: 'There is an error' },
  disabled: { type: 'boolean', default: false },
  controlMarkup: { type: 'string', default: '' },
 // htmlAttributes: { type: 'object', default: {} }
};
