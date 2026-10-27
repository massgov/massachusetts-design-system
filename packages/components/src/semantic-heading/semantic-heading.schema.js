export const semanticHeadingSchema = {
  text: {
    type: 'string',
    required: true,
    default: 'Heading text'
  },
  level: {
    type: 'enum',
    required: true,
    default: 'H2',
    options: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6']
  },
  variant: {
    type: 'enum',
    required: true,
    default: 'Mass.gov',
    options: ['Mass.gov', 'Plain']
  }
};
