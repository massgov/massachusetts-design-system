export const inlineMessageSchema = {
  type: {
    type: 'enum',
    default: 'Informative',
    options: ['Informative', 'Success', 'Warning', 'Error']
  },
  variant: {
    type: 'enum',
    default: 'Filled',
    options: ['Filled', 'Neutral']
  },
  heading: {
    type: 'string',
    default: 'Inline message title'
  },
  descriptionHtml: {
    type: 'string',
    default: 'Inline message description goes here which can be up to 150 characters and includes rich text. Lorem ipsum dolor sit amet, <a href="#" noreferer>consectetur adipisicing el</a>.'
  },
  className: {
    type: 'string',
    default: ''
  }
};
