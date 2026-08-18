import React, { createContext, useState, useEffect } from 'react';
import { getAdsConfig } from '../services/api';

export const AdsContext = createContext();

export const AdsProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appOpenShown, setAppOpenShown] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getAdsConfig();
        setConfig(data);
      } catch (err) {
        console.error('Failed to load ads config', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
    
    if (sessionStorage.getItem('appOpenAdShown')) {
      setAppOpenShown(true);
    }
  }, []);

  const markAppOpenShown = () => {
    sessionStorage.setItem('appOpenAdShown', 'true');
    setAppOpenShown(true);
  };

  return (
    <AdsContext.Provider value={{ config, loading, appOpenShown, markAppOpenShown }}>
      {children}
    </AdsContext.Provider>
  );
};