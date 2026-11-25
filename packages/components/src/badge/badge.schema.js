export const badgeSchema = {
  text: {
    type: 'string',
    default: 'Press release'
  },
  type: {
    type: 'enum',
    default: 'Neutral',
    options: ['Neutral', 'Informative', 'Success', 'Warning', 'Danger']
  }
};
