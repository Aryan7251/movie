import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Film, PlusCircle, MonitorPlay, LogOut, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'show' : ''}`} onClick={() => setIsOpen(false)}></div>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h1 className="logo"><span>Hub</span>Plays <small style={{fontSize: '0.65em', color: 'var(--text-secondary)', fontWeight: 500}}>Admin</small></h1>
          <button className="mobile-close" onClick={() => setIsOpen(false)}><X size={24} /></button>
        </div>
        
        <nav className="sidebar-nav">
          <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/movies" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
            <Film size={20} />
            <span>Movies</span>
          </NavLink>
          <NavLink to="/movies/add" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
            <PlusCircle size={20} />
            <span>Add Movie</span>
          </NavLink>
          <NavLink to="/ads" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
            <MonitorPlay size={20} />
            <span>Ads Config</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="nav-item logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
