import React, { useEffect, useRef } from 'react';
import './CustomAdRenderer.css';

const CustomAdRenderer = ({ code, className = '' }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !code) return;

    const container = containerRef.current;
    container.innerHTML = '';

    // Create a temporary parser
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = code.trim();

    // Extract scripts and non-script nodes
    const scripts = [];
    const childNodes = Array.from(tempDiv.childNodes);

    childNodes.forEach((node) => {
      if (node.nodeName.toLowerCase() === 'script') {
        scripts.push(node);
      } else {
        container.appendChild(node.cloneNode(true));
      }
    });

    // Execute scripts dynamically
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script');
      
      // Copy all attributes (src, type, async, defer, crossorigin, etc.)
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });

      if (oldScript.innerHTML) {
        newScript.innerHTML = oldScript.innerHTML;
      }

      container.appendChild(newScript);
    });

    // Trigger Google AdSense if present
    if (code.includes('adsbygoogle') && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense push error:', e);
      }
    }
  }, [code]);

  if (!code || !code.trim()) return null;

  return (
    <div 
      ref={containerRef} 
      className={`custom-ad-container ${className}`}
    />
  );
};

export default CustomAdRenderer;
