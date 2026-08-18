import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?search=${encodeURIComponent(query)}`);
      setSearchOpen(false);
      setIsMobileOpen(false);
      setQuery('');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-hub">Hub</span>
          <span className="logo-plays">Plays</span>
        </Link>
        
        <div className={`navbar-links ${isMobileOpen ? 'active' : ''}`}>
          <Link to="/" onClick={() => setIsMobileOpen(false)}>Home</Link>
          <Link to="/search" onClick={() => setIsMobileOpen(false)}>Browse</Link>
        </div>
        
        <div className="navbar-actions">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="search-form">
              <input 
                type="text" 
                placeholder="Search movies..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                onBlur={() => !query && setSearchOpen(false)}
              />
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="search-btn">
              <Search size={20} />
            </button>
          )}
          
          <button className="mobile-toggle" onClick={() => setIsMobileOpen(!isMobileOpen)}>
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;