import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { adsConfig } from '../config/ads.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const adsDataFile = path.join(__dirname, '../config/ads.data.json');

let currentAdsConfig = { ...adsConfig };

// Try loading persisted config from file
try {
  if (fs.existsSync(adsDataFile)) {
    const raw = fs.readFileSync(adsDataFile, 'utf8');
    const parsed = JSON.parse(raw);
    currentAdsConfig = {
      ...adsConfig,
      ...parsed,
      globalScript: { ...adsConfig.globalScript, ...(parsed.globalScript || {}) },
      appOpen: { ...adsConfig.appOpen, ...(parsed.appOpen || {}) },
      preRoll: { ...adsConfig.preRoll, ...(parsed.preRoll || {}) },
      bannerHeader: { ...adsConfig.bannerHeader, ...(parsed.bannerHeader || {}) },
      bannerWatchPage: { ...adsConfig.bannerWatchPage, ...(parsed.bannerWatchPage || {}) }
    };
  }
} catch (err) {
  console.error('Failed to load persisted ads.data.json:', err);
}

export const getAdsConfig = () => {
  return currentAdsConfig;
};

export const updateAdsConfig = (newConfig) => {
  currentAdsConfig = {
    ...currentAdsConfig,
    ...newConfig,
    globalScript: {
      ...currentAdsConfig.globalScript,
      ...(newConfig.globalScript || {})
    },
    appOpen: {
      ...currentAdsConfig.appOpen,
      ...(newConfig.appOpen || {})
    },
    preRoll: {
      ...currentAdsConfig.preRoll,
      ...(newConfig.preRoll || {})
    },
    bannerHeader: {
      ...currentAdsConfig.bannerHeader,
      ...(newConfig.bannerHeader || {})
    },
    bannerWatchPage: {
      ...currentAdsConfig.bannerWatchPage,
      ...(newConfig.bannerWatchPage || {})
    }
  };

  // Persist to file
  try {
    fs.writeFileSync(adsDataFile, JSON.stringify(currentAdsConfig, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write ads.data.json:', err);
  }

  return currentAdsConfig;
};
