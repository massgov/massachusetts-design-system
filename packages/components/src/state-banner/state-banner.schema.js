export const stateBannerSchema = {
  panelId: {
    type: 'string',
    default: 'mds-state-banner-panel'
  },
  sealVariant: {
    type: 'enum',
    default: 'white',
    options: ['white', 'black', 'gray', 'color']
  },
  sealSrc: {
    type: 'string',
    default: ''
  },
  summaryLabel: {
    type: 'string',
    default: 'Official website banner'
  }
};
