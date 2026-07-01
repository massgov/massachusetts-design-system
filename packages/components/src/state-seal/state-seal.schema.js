export const stateSealSchema = {
  variant: {
    type: 'enum',
    default: 'white',
    options: ['white', 'black', 'gray', 'color']
  },
  fileType: {
    type: 'enum',
    default: 'png',
    options: ['png', 'svg']
  },
  className: {
    type: 'string',
    default: ''
  },
  alt: {
    type: 'string',
    default: 'Massachusetts State Seal'
  }
};
