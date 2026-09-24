export const inlineMessageSchema = {
  type: {
    type: 'enum',
    required: true,
    default: 'Informative',
    options: ['Informative', 'Success', 'Warning', 'Error']
  },
  variant: {
    type: 'enum',
    required: true,
    default: 'Filled',
    options: ['Filled', 'Neutral']
  },
  heading: {
    type: 'string',
    required: true,
    default: 'Inline message title'
  },
  descriptionHtml: {
    type: 'string',
    required: false
  }
};
