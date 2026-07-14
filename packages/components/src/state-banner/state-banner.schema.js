export const stateBannerSchema = {
  sealSrc: {
    type: 'string',
    default: ''
  },
  sealAlt: {
    type: 'string',
    default: 'Massachusetts State Seal'
  },
  panelId: {
    type: 'string',
    default: 'mds-state-banner-panel'
  },
  summaryLabel: {
    type: 'string',
    default: 'Official website banner'
  },
  summaryPrefix: {
    type: 'string',
    default: 'An official website of the Commonwealth of Massachusetts'
  },
  regionLabel: {
    type: 'string',
    default: 'Official website indicators'
  },
  officialWebsitesHeading: {
    type: 'string',
    default: 'Official websites use .mass.gov'
  },
  officialWebsitesDescription: {
    type: 'string',
    default: 'A .mass.gov website belongs to an official government organization in Massachusetts.'
  },
  secureWebsitesHeading: {
    type: 'string',
    default: 'Secure websites use HTTPS'
  },
  secureWebsitesDescription: {
    type: 'string',
    default: "A lock icon or https:// means you've safely connected to the official website. Share sensitive information only on official, secure websites."
  }
};
