import React, { useState, useEffect } from 'react';
import { useAds } from '../hooks/useAds';
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

  return (
    <div className="preroll-ad-container">
      <div className="preroll-ad-content">
        {config?.preRoll?.title && <h3>{config.preRoll.title}</h3>}
        {config?.preRoll?.imageUrl && (
          <img src={config.preRoll.imageUrl} alt="Advertisement" />
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