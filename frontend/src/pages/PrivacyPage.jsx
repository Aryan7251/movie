import React from 'react';
import './LegalPages.css';

const PrivacyPage = () => (
  <div className="legal-page">
    <h1>Privacy Policy</h1>
    <div className="legal-content">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <h2>1. Information We Collect</h2>
      <p>We collect information you provide directly to us when you use our services.</p>
      <h2>2. How We Use Your Information</h2>
      <p>We use the information we collect to provide, maintain, and improve our services.</p>
      <h2>3. Cookies</h2>
      <p>We use cookies and similar tracking technologies to track activity on our service.</p>
    </div>
  </div>
);
export default PrivacyPage;