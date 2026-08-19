import React, { useState, useEffect } from 'react';
import { useAds } from '../hooks/useAds';
import CustomAdRenderer from './CustomAdRenderer';
import './PreRollAd.css';

const PreRollAd = ({ onComplete }) => {
  const { config, loading } = useAds();
  const [timeLeft, setTimeLeft] = useState(0);
  const [canSkip, setCanSkip] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (config?.preRoll?.enabled) {
        setIsVisible(true);
        setTimeLeft(config.preRoll.displayDuration || 5);
      } else {
        onComplete();
      }
    }
  }, [loading, config]);

  useEffect(() => {
    let timer;
    if (isVisible && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (isVisible && timeLeft === 0) {
      setCanSkip(true);
    }
    return () => clearInterval(timer);
  }, [isVisible, timeLeft]);

  const handleSkip = () => {
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible) return null;

  const ad = config?.preRoll;

  return (
    <div className="preroll-ad-container">
      <div className="preroll-ad-content">
        {ad?.title && <h3>{ad.title}</h3>}
        
        {ad?.mode === 'custom_code' && ad?.customCode ? (
          <CustomAdRenderer code={ad.customCode} className="preroll-custom-ad" />
        ) : (
          ad?.imageUrl && (
            <a 
              href={ad.clickUrl && ad.clickUrl !== '#' ? ad.clickUrl : undefined} 
              target={ad.clickUrl && ad.clickUrl !== '#' ? '_blank' : undefined} 
              rel="noopener noreferrer"
            >
              <img src={ad.imageUrl} alt={ad.title || 'Advertisement'} />
            </a>
          )
        )}

        <div className="ad-controls">
          {!canSkip ? (
            <span className="countdown">Ad finishes in {timeLeft}s</span>
          ) : (
            <button className="skip-btn" onClick={handleSkip}>Skip Ad</button>
          )}
        </div>
      </div>
    </div>
  );
};
export default PreRollAd;