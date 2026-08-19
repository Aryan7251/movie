import React, { useEffect, useState } from 'react';
import { useAds } from '../hooks/useAds';
import CustomAdRenderer from './CustomAdRenderer';
import './AppOpenAd.css';

const AppOpenAd = () => {
  const { config, loading, appOpenShown, markAppOpenShown } = useAds();
  const [timeLeft, setTimeLeft] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    if (!loading && !appOpenShown && config?.appOpen?.enabled) {
      setIsVisible(true);
      setTimeLeft(config.appOpen.displayDuration || 5);
    } else if (!loading && !appOpenShown) {
      markAppOpenShown();
    }
  }, [loading, appOpenShown, config]);

  useEffect(() => {
    let timer;
    if (isVisible && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (isVisible && timeLeft === 0) {
      setCanSkip(true);
    }
    return () => clearInterval(timer);
  }, [isVisible, timeLeft]);

  const handleSkip = () => {
    setIsVisible(false);
    markAppOpenShown();
  };

  if (!isVisible) return null;

  const ad = config?.appOpen;

  return (
    <div className="app-open-ad-overlay">
      <div className="app-open-ad-content">
        {ad?.title && <h2>{ad.title}</h2>}
        
        {ad?.mode === 'custom_code' && ad?.customCode ? (
          <CustomAdRenderer code={ad.customCode} className="app-open-custom-ad" />
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
            <span className="countdown">You can skip in {timeLeft}s</span>
          ) : (
            <button className="skip-btn" onClick={handleSkip}>Skip Ad</button>
          )}
        </div>
      </div>
    </div>
  );
};
export default AppOpenAd;