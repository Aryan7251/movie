import React from 'react';
import { Menu, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = ({ toggleSidebar }) => {
  const { admin } = useAuth();
  const location = useLocation();
  
  const getPageTitle = () => {
    if (location.pathname === '/') return 'Dashboard';
    if (location.pathname === '/movies') return 'Movies';
    if (location.pathname === '/movies/add') return 'Add Movie';
    if (location.pathname.startsWith('/movies/edit')) return 'Edit Movie';
    if (location.pathname === '/ads') return 'Ads Configuration';
    return '';
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="mobile-toggle" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <h2 className="page-title">{getPageTitle()}</h2>
      </div>
      <div className="header-right">
        <div className="admin-profile">
          <div className="avatar">
            <User size={18} />
          </div>
          <span className="username">{admin?.username || 'Admin'}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
