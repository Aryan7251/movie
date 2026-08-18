import { adsConfig } from '../config/ads.config.js';

let currentAdsConfig = { ...adsConfig };

export const getAdsConfig = () => {
  return currentAdsConfig;
};

export const updateAdsConfig = (newConfig) => {
  currentAdsConfig = {
    ...currentAdsConfig,
    ...newConfig,
    appOpen: {
      ...currentAdsConfig.appOpen,
      ...(newConfig.appOpen || {})
    },
    preRoll: {
      ...currentAdsConfig.preRoll,
      ...(newConfig.preRoll || {})
    }
  };
  return currentAdsConfig;
};
