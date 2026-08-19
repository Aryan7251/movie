import React from 'react';
import { useAds } from '../hooks/useAds';
import CustomAdRenderer from './CustomAdRenderer';
import './BannerAd.css';

const BannerAd = ({ placement = 'bannerHeader', className = '' }) => {
  const { config, loading } = useAds();

  if (loading || !config || !config[placement] || !config[placement].enabled) {
    return null;
  }

  const ad = config[placement];

  return (
    <div className={`banner-ad-wrapper ${placement} ${className}`}>
      <span className="banner-ad-label">Advertisement</span>
      
      {ad.mode === 'custom_code' && ad.customCode ? (
        <CustomAdRenderer code={ad.customCode} className="banner-custom-content" />
      ) : (
        ad.imageUrl && (
          <a 
            href={ad.clickUrl && ad.clickUrl !== '#' ? ad.clickUrl : undefined} 
            target={ad.clickUrl && ad.clickUrl !== '#' ? '_blank' : undefined} 
            rel="noopener noreferrer"
            className="banner-image-link"
          >
            <img src={ad.imageUrl} alt={ad.title || 'Advertisement'} className="banner-ad-img" />
          </a>
        )
      )}
    </div>
  );
};

export default BannerAd;
