export const inputGroupSchema = {
  id: {
    type: 'string',
    default: 'mds-input-group'
  },
  label: {
    type: 'string',
    default: 'Search mass.gov'
  },
  placeholder: {
    type: 'string',
    default: 'search mass.gov'
  },
  selectLabel: {
    type: 'string',
    default: 'Organization'
  },
  searchButtonLabel: {
    type: 'string',
    default: 'Search'
  },
  name: {
    type: 'string',
    default: 'query'
  },
  value: {
    type: 'string',
    default: ''
  },
  showLabel: {
    type: 'boolean',
    default: true
  }
};
