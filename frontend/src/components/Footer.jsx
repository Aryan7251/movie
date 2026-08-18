import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-col">
          <Link to="/" className="footer-logo">
            <span className="logo-hub">Hub</span>
            <span className="logo-plays">Plays</span>
          </Link>
          <p className="footer-tagline">Your premier destination for entertainment. Stream top movies and videos in stunning cinematic quality.</p>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/search">Browse</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Legal</h4>
          <ul>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} HubPlays. All rights reserved.</p>
      </div>
    </footer>
  );
};
export default Footer;