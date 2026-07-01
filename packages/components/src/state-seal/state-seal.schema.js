export const stateSealSchema = {
  variant: {
    type: 'enum',
    default: 'white',
    options: ['white', 'black', 'gray', 'color']
  },
  src: {
    type: 'string',
    default: ''
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
