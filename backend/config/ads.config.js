export const adsConfig = {
  globalScript: {
    enabled: false,
    code: '' // e.g. Google AdSense auto-ads, Popunder script, Adsterra, etc.
  },
  appOpen: {
    enabled: true,
    mode: 'banner', // 'banner' or 'custom_code'
    customCode: '',
    adUnitId: 'demo-app-open-ad',
    displayDuration: 5,
    imageUrl: '/ads/app-open-placeholder.svg',
    clickUrl: '#',
    title: 'Advertisement'
  },
  preRoll: {
    enabled: true,
    mode: 'banner', // 'banner' or 'custom_code'
    customCode: '',
    adUnitId: 'demo-pre-roll-ad',
    displayDuration: 5,
    imageUrl: '/ads/pre-roll-placeholder.svg',
    clickUrl: '#',
    title: 'Your ad here'
  },
  bannerHeader: {
    enabled: false,
    mode: 'custom_code', // 'banner' or 'custom_code'
    customCode: '',
    imageUrl: '',
    clickUrl: '#',
    title: ''
  },
  bannerWatchPage: {
    enabled: false,
    mode: 'custom_code', // 'banner' or 'custom_code'
    customCode: '',
    imageUrl: '',
    clickUrl: '#',
    title: ''
  }
};
