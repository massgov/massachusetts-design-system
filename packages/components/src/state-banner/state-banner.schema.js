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
  sealFileType: {
    type: 'enum',
    default: 'png',
    options: ['png', 'svg']
  },
  summaryLabel: {
    type: 'string',
    default: 'Official website banner'
  }
};
