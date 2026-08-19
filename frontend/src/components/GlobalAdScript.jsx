import { useEffect } from 'react';
import { useAds } from '../hooks/useAds';

const GlobalAdScript = () => {
  const { config, loading } = useAds();

  useEffect(() => {
    if (loading || !config?.globalScript?.enabled || !config?.globalScript?.code) {
      return;
    }

    const scriptCode = config.globalScript.code.trim();
    if (!scriptCode) return;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = scriptCode;

    const injectedElements = [];

    const scripts = Array.from(tempDiv.querySelectorAll('script'));
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      if (oldScript.innerHTML) {
        newScript.innerHTML = oldScript.innerHTML;
      }
      document.head.appendChild(newScript);
      injectedElements.push(newScript);
    });

    // Also inject non-script elements (like meta, link, or style tags) if any
    Array.from(tempDiv.children).forEach((el) => {
      if (el.nodeName.toLowerCase() !== 'script') {
        const cloned = el.cloneNode(true);
        document.head.appendChild(cloned);
        injectedElements.push(cloned);
      }
    });

    return () => {
      injectedElements.forEach((el) => {
        if (el.parentNode) el.parentNode.removeChild(el);
      });
    };
  }, [config, loading]);

  return null;
};

export default GlobalAdScript;
