import React from 'react';
import './LegalPages.css';

const TermsPage = () => (
  <div className="legal-page">
    <h1>Terms of Service</h1>
    <div className="legal-content">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
      <h2>2. Use License</h2>
      <p>Permission is granted to temporarily stream the materials on HubPlays's website for personal, non-commercial transitory viewing only.</p>
      <h2>3. Disclaimer</h2>
      <p>The materials on HubPlays's website are provided on an 'as is' basis.</p>
    </div>
  </div>
);
export default TermsPage;