import os

base_dir = "/home/aryan/projects/movie-streaming-app/admin"

files = {
    "package.json": """{
  "name": "admin",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.6.8",
    "lucide-react": "^0.364.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.3"
  },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.57.0",
    "eslint-plugin-react": "^7.34.1",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.6",
    "vite": "^5.2.0"
  }
}
""",
    "vite.config.js": """import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': 'http://localhost:5000',
      '/uploads': 'http://localhost:5000',
      '/ads': 'http://localhost:5000'
    }
  }
})
""",
    "index.html": """<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CineStream Admin</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
""",
    "src/index.css": """:root {
  --bg-primary: #0d0d14;
  --bg-secondary: #13131d;
  --bg-card: #181824;
  --bg-elevated: #1e1e2e;
  --bg-input: #1a1a28;
  --text-primary: #e4e4ec;
  --text-secondary: #8888a0;
  --text-muted: #555568;
  --accent: #6366f1;
  --accent-hover: #818cf8;
  --accent-muted: rgba(99, 102, 241, 0.12);
  --success: #22c55e;
  --success-muted: rgba(34, 197, 94, 0.12);
  --warning: #f59e0b;
  --warning-muted: rgba(245, 158, 11, 0.12);
  --danger: #ef4444;
  --danger-muted: rgba(239, 68, 68, 0.12);
  --border: #2a2a3c;
  --border-focus: #6366f1;
  --shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --font-sans: 'Inter', -apple-system, system-ui, sans-serif;
  --sidebar-width: 260px;
  --header-height: 64px;
  --transition: 0.2s ease;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-sans);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

a {
  color: var(--accent);
  text-decoration: none;
}

button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: none;
}

input, textarea, select {
  font-family: inherit;
  background: var(--bg-input);
  border: 1px solid var(--border);
  color: var(--text-primary);
  border-radius: var(--radius-sm);
  padding: 0.5rem 1rem;
  transition: border-color var(--transition);
}

input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: var(--border-focus);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-weight: 500;
  transition: all var(--transition);
}

.btn-primary {
  background: var(--accent);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--accent-hover);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-danger {
  background: var(--danger);
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
}

.btn-icon {
  padding: 0.5rem;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
}

.btn-icon:hover {
  background: var(--bg-elevated);
  color: var(--text-primary);
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-success {
  background: var(--success-muted);
  color: var(--success);
}

.badge-warning {
  background: var(--warning-muted);
  color: var(--warning);
}
""",
    "src/main.jsx": """import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
""",
    "src/App.jsx": """import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MoviesPage from './pages/MoviesPage';
import AddMoviePage from './pages/AddMoviePage';
import EditMoviePage from './pages/EditMoviePage';
import AdsConfigPage from './pages/AdsConfigPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/movies" element={<ProtectedRoute><MoviesPage /></ProtectedRoute>} />
            <Route path="/movies/add" element={<ProtectedRoute><AddMoviePage /></ProtectedRoute>} />
            <Route path="/movies/edit/:id" element={<ProtectedRoute><EditMoviePage /></ProtectedRoute>} />
            <Route path="/ads" element={<ProtectedRoute><AdsConfigPage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
""",
    "src/App.css": """.app-layout {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  margin-left: var(--sidebar-width);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.page-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
  .page-content {
    padding: 1rem;
  }
}
""",
    "src/services/api.js": """import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  setup: async (username, password) => {
    const res = await api.post('/auth/setup', { username, password });
    return res.data;
  },
  login: async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
    }
    return res.data;
  },
  logout: async () => {
    const res = await api.post('/auth/logout');
    localStorage.removeItem('token');
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  }
};

export const dashboardService = {
  getDashboard: async () => {
    const res = await api.get('/admin/dashboard');
    return res.data;
  }
};

export const movieService = {
  getMovies: async (params = {}) => {
    const { page = 1, limit = 20, search = '', genre = '', published = '' } = params;
    const query = new URLSearchParams({ page, limit, search, genre, published }).toString();
    const res = await api.get(`/admin/movies?${query}`);
    return res.data;
  },
  getMovieById: async (id) => {
    const res = await api.get(`/admin/movies/${id}`);
    return res.data;
  },
  createMovie: async (formData) => {
    const res = await api.post('/admin/movies', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  updateMovie: async (id, formData) => {
    const res = await api.put(`/admin/movies/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  publishMovie: async (id, published) => {
    const res = await api.patch(`/admin/movies/${id}/publish`, { published });
    return res.data;
  },
  featureMovie: async (id, featured) => {
    const res = await api.patch(`/admin/movies/${id}/feature`, { featured });
    return res.data;
  },
  deleteMovie: async (id) => {
    const res = await api.delete(`/admin/movies/${id}`);
    return res.data;
  }
};

export const adsService = {
  getAdsConfig: async () => {
    const res = await api.get('/ads/config');
    return res.data;
  }
};
""",
    "src/context/ToastContext.jsx": """import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
""",
    "src/context/AuthContext.jsx": """import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await authService.getMe();
          if (res.success) {
            setAdmin(res.admin);
          }
        }
      } catch (err) {
        console.error('Auth initialization failed', err);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (username, password) => {
    const res = await authService.login(username, password);
    if (res.success) {
      setAdmin(res.admin);
    }
    return res;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error(err);
    }
    localStorage.removeItem('token');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, isAuthenticated: !!admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
""",
    "src/components/ProtectedRoute.jsx": """import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import Sidebar from './Sidebar';
import Header from './Header';
import { useState } from 'react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><LoadingSpinner /></div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="main-content">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ProtectedRoute;
""",
    "src/components/LoadingSpinner.jsx": """import React from 'react';

const LoadingSpinner = () => (
  <div style={{ display: 'inline-block', width: '24px', height: '24px', border: '3px solid rgba(255,255,255,0.3)', borderRadius: '50%', borderTopColor: '#fff', animation: 'spin 1s ease-in-out infinite' }}>
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default LoadingSpinner;
""",
    "src/components/Toast.jsx": """import React from 'react';
import { CheckCircle, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import './Toast.css';

const Toast = ({ type, message, onClose }) => {
  const icons = {
    success: <CheckCircle className="toast-icon success" size={20} />,
    error: <XCircle className="toast-icon error" size={20} />,
    warning: <AlertTriangle className="toast-icon warning" size={20} />,
    info: <Info className="toast-icon info" size={20} />
  };

  return (
    <div className={`toast toast-${type}`}>
      {icons[type]}
      <p className="toast-message">{message}</p>
      <button onClick={onClose} className="toast-close">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
""",
    "src/components/Toast.css": """.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.toast {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow);
  min-width: 300px;
  animation: slideIn 0.3s ease forwards;
}

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.toast-message {
  flex: 1;
  font-size: 0.875rem;
  color: var(--text-primary);
}

.toast-close {
  color: var(--text-secondary);
  display: flex;
  padding: 2px;
}

.toast-close:hover {
  color: var(--text-primary);
}

.toast-icon.success { color: var(--success); }
.toast-icon.error { color: var(--danger); }
.toast-icon.warning { color: var(--warning); }
.toast-icon.info { color: var(--accent); }
""",
    "src/components/Sidebar.jsx": """import React from 'react';
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
          <h1 className="logo"><span>Cine</span>Stream Admin</h1>
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
""",
    "src/components/Sidebar.css": """.sidebar {
  width: var(--sidebar-width);
  background: var(--bg-secondary);
  border-right: 1px solid var(--border);
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  z-index: 100;
  transition: transform var(--transition);
}

.sidebar-header {
  height: var(--header-height);
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  border-bottom: 1px solid var(--border);
  justify-content: space-between;
}

.logo {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.logo span {
  color: var(--accent);
}

.mobile-close {
  display: none;
  color: var(--text-secondary);
}

.sidebar-nav {
  padding: 1.5rem 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--text-secondary);
  border-radius: var(--radius-md);
  transition: all var(--transition);
  font-weight: 500;
  text-decoration: none;
}

.nav-item:hover {
  background: var(--bg-elevated);
  color: var(--text-primary);
}

.nav-item.active {
  background: var(--accent-muted);
  color: var(--accent);
}

.sidebar-footer {
  padding: 1.5rem 1rem;
  border-top: 1px solid var(--border);
}

.logout-btn {
  width: 100%;
  color: var(--danger);
}

.logout-btn:hover {
  background: var(--danger-muted);
  color: var(--danger);
}

.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  z-index: 99;
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
  
  .sidebar.open {
    transform: translateX(0);
  }

  .mobile-close {
    display: block;
  }
  
  .sidebar-overlay.show {
    display: block;
  }
}
""",
    "src/components/Header.jsx": """import React from 'react';
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
""",
    "src/components/Header.css": """.header {
  height: var(--header-height);
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mobile-toggle {
  display: none;
  color: var(--text-primary);
}

.page-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.admin-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-elevated);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.username {
  font-weight: 500;
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .header {
    padding: 0 1rem;
  }
  .mobile-toggle {
    display: flex;
  }
}
""",
    "src/components/StatsCard.jsx": """import React from 'react';
import './StatsCard.css';

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <div className="stats-card">
      <div className="stats-info">
        <h3 className="stats-title">{title}</h3>
        <p className="stats-value">{value}</p>
      </div>
      <div className={`stats-icon ${color}`}>
        {icon}
      </div>
    </div>
  );
};

export default StatsCard;
""",
    "src/components/StatsCard.css": """.stats-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  transition: transform var(--transition), box-shadow var(--transition);
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.stats-title {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.stats-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stats-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stats-icon.primary { background: var(--accent-muted); color: var(--accent); }
.stats-icon.success { background: var(--success-muted); color: var(--success); }
.stats-icon.warning { background: var(--warning-muted); color: var(--warning); }
.stats-icon.danger { background: var(--danger-muted); color: var(--danger); }
""",
    "src/components/ConfirmDialog.jsx": """import React, { useEffect } from 'react';
import './ConfirmDialog.css';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', isDanger = false }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog-content" onClick={e => e.stopPropagation()}>
        <h3 className="dialog-title">{title}</h3>
        <p className="dialog-message">{message}</p>
        <div className="dialog-actions">
          <button className="btn" onClick={onCancel}>Cancel</button>
          <button className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
""",
    "src/components/ConfirmDialog.css": """.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-content {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  width: 90%;
  max-width: 400px;
  box-shadow: var(--shadow);
  animation: modalIn 0.2s ease-out;
}

@keyframes modalIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.dialog-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.dialog-message {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.dialog-actions .btn {
  padding: 0.5rem 1.25rem;
}
""",
    "src/components/MovieTable.jsx": """import React from 'react';
import { Pencil, Trash2, Star, EyeOff, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import './MovieTable.css';

const MovieTable = ({ movies, onPublishToggle, onFeatureToggle, onDelete }) => {
  
  if (!movies || movies.length === 0) {
    return <div className="empty-state">No movies found.</div>;
  }

  return (
    <>
      <div className="table-responsive">
        <table className="movie-table">
          <thead>
            <tr>
              <th>Movie</th>
              <th>Genre</th>
              <th>Views</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map(movie => (
              <tr key={movie._id}>
                <td>
                  <div className="movie-cell">
                    <img src={movie.posterUrl} alt={movie.title} className="movie-poster" />
                    <div>
                      <div className="movie-title">{movie.title}</div>
                      <div className="movie-year">{movie.releaseYear} • {Math.floor(movie.duration / 60)} min</div>
                    </div>
                  </div>
                </td>
                <td>{movie.genre?.join(', ')}</td>
                <td>{movie.views?.toLocaleString() || 0}</td>
                <td>
                  <span className={`badge ${movie.published ? 'badge-success' : 'badge-warning'}`}>
                    {movie.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td>
                  <button className={`action-btn ${movie.featured ? 'featured' : ''}`} onClick={() => onFeatureToggle(movie._id, !movie.featured)}>
                    <Star size={18} fill={movie.featured ? "currentColor" : "none"} />
                  </button>
                </td>
                <td>
                  <div className="actions-cell">
                    <button className="action-btn" onClick={() => onPublishToggle(movie._id, !movie.published)} title={movie.published ? "Unpublish" : "Publish"}>
                      {movie.published ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <Link to={`/movies/edit/${movie._id}`} className="action-btn">
                      <Pencil size={18} />
                    </Link>
                    <button className="action-btn danger" onClick={() => onDelete(movie._id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="movie-cards">
        {movies.map(movie => (
          <div key={movie._id} className="movie-card">
            <div className="movie-card-header">
              <img src={movie.posterUrl} alt={movie.title} className="movie-poster" />
              <div className="movie-card-info">
                <div className="movie-title">{movie.title}</div>
                <div className="movie-year">{movie.releaseYear} • {Math.floor(movie.duration / 60)} min</div>
                <div className="movie-genre">{movie.genre?.join(', ')}</div>
              </div>
            </div>
            <div className="movie-card-stats">
              <span>{movie.views?.toLocaleString() || 0} views</span>
              <span className={`badge ${movie.published ? 'badge-success' : 'badge-warning'}`}>
                {movie.published ? 'Published' : 'Draft'}
              </span>
            </div>
            <div className="movie-card-actions">
              <button className={`btn-icon ${movie.featured ? 'featured' : ''}`} onClick={() => onFeatureToggle(movie._id, !movie.featured)}>
                <Star size={18} fill={movie.featured ? "currentColor" : "none"} />
              </button>
              <button className="btn-icon" onClick={() => onPublishToggle(movie._id, !movie.published)}>
                {movie.published ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <Link to={`/movies/edit/${movie._id}`} className="btn-icon">
                <Pencil size={18} />
              </Link>
              <button className="btn-icon danger" onClick={() => onDelete(movie._id)}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MovieTable;
""",
    "src/components/MovieTable.css": """.table-responsive {
  overflow-x: auto;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}

.movie-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.movie-table th {
  padding: 1rem 1.5rem;
  font-weight: 500;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border);
  background: var(--bg-elevated);
}

.movie-table td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
}

.movie-table tr:last-child td {
  border-bottom: none;
}

.movie-table tbody tr:hover {
  background: var(--bg-elevated);
}

.movie-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.movie-poster {
  width: 40px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  background: var(--bg-primary);
}

.movie-title {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.movie-year {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.actions-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.4rem;
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
  display: flex;
}

.action-btn:hover {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.action-btn.danger:hover {
  color: var(--danger);
  background: var(--danger-muted);
}

.action-btn.featured {
  color: var(--warning);
}

.empty-state {
  padding: 3rem;
  text-align: center;
  color: var(--text-secondary);
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}

.movie-cards {
  display: none;
  flex-direction: column;
  gap: 1rem;
}

.movie-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 1rem;
}

.movie-card-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.movie-card-info {
  flex: 1;
}

.movie-genre {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.movie-card-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.movie-card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .table-responsive {
    display: none;
  }
  .movie-cards {
    display: flex;
  }
}
""",
    "src/components/MovieForm.jsx": """import React, { useState, useEffect, useRef } from 'react';
import { Upload, Film, Image as ImageIcon } from 'lucide-react';
import './MovieForm.css';

const MovieForm = ({ initialData, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    releaseYear: new Date().getFullYear(),
    durationMinutes: 0,
    featured: false,
    published: false
  });
  const [posterFile, setPosterFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        genre: initialData.genre?.join(', ') || '',
        releaseYear: initialData.releaseYear || new Date().getFullYear(),
        durationMinutes: initialData.duration ? Math.floor(initialData.duration / 60) : 0,
        featured: initialData.featured || false,
        published: initialData.published || false
      });
      if (initialData.posterUrl) {
        setPosterPreview(initialData.posterUrl);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPosterFile(file);
      setPosterPreview(URL.createObjectURL(file));
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!initialData && !posterFile) newErrors.poster = 'Poster is required for new movies';
    if (!initialData && !videoFile) newErrors.video = 'Video file is required for new movies';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('genre', formData.genre);
    data.append('releaseYear', formData.releaseYear);
    data.append('duration', parseInt(formData.durationMinutes) * 60);
    data.append('featured', formData.featured);
    data.append('published', formData.published);
    
    if (posterFile) data.append('poster', posterFile);
    if (videoFile) data.append('video', videoFile);

    onSubmit(data);
  };

  return (
    <form className="movie-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-main">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className={errors.title ? 'error' : ''} />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" rows={4} value={formData.description} onChange={handleChange} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="releaseYear">Release Year</label>
              <input type="number" id="releaseYear" name="releaseYear" value={formData.releaseYear} onChange={handleChange} />
            </div>
            
            <div className="form-group">
              <label htmlFor="durationMinutes">Duration (minutes)</label>
              <input type="number" id="durationMinutes" name="durationMinutes" value={formData.durationMinutes} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="genre">Genres</label>
            <input type="text" id="genre" name="genre" value={formData.genre} onChange={handleChange} placeholder="Action, Drama, Thriller" />
            <span className="helper-text">Comma separated values</span>
          </div>
          
          <div className="form-switches">
            <label className="switch-label">
              <div className="switch">
                <input type="checkbox" name="published" checked={formData.published} onChange={handleChange} />
                <span className="slider"></span>
              </div>
              Published
            </label>
            <label className="switch-label">
              <div className="switch">
                <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
                <span className="slider"></span>
              </div>
              Featured
            </label>
          </div>
        </div>

        <div className="form-sidebar">
          <div className="form-group">
            <label>Poster Image *</label>
            <div className={`file-upload-box ${errors.poster ? 'error' : ''}`} onClick={() => document.getElementById('poster-input').click()}>
              {posterPreview ? (
                <img src={posterPreview} alt="Preview" className="poster-preview" />
              ) : (
                <div className="upload-placeholder">
                  <ImageIcon size={32} />
                  <span>Click to upload poster</span>
                </div>
              )}
              <input type="file" id="poster-input" accept="image/*" onChange={handlePosterChange} hidden />
            </div>
            {errors.poster && <span className="error-text">{errors.poster}</span>}
          </div>

          <div className="form-group">
            <label>Video File *</label>
            <div className={`file-upload-box video ${errors.video ? 'error' : ''}`} onClick={() => document.getElementById('video-input').click()}>
              <div className="upload-placeholder">
                <Film size={32} />
                <span>{videoFile ? videoFile.name : (initialData?.videoUrl ? 'Video uploaded (click to change)' : 'Click to upload video')}</span>
              </div>
              <input type="file" id="video-input" accept="video/*" onChange={handleVideoChange} hidden />
            </div>
            {errors.video && <span className="error-text">{errors.video}</span>}
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Movie'}
        </button>
      </div>
    </form>
  );
};

export default MovieForm;
""",
    "src/components/MovieForm.css": """.movie-form {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.form-group input, .form-group textarea {
  width: 100%;
}

.form-group input.error {
  border-color: var(--danger);
}

.error-text {
  color: var(--danger);
  font-size: 0.75rem;
}

.helper-text {
  color: var(--text-secondary);
  font-size: 0.75rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-switches {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
}

.switch-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--bg-input);
  transition: .4s;
  border-radius: 34px;
  border: 1px solid var(--border);
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 2px;
  bottom: 2px;
  background-color: var(--text-secondary);
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--accent);
  border-color: var(--accent);
}

input:checked + .slider:before {
  transform: translateX(20px);
  background-color: white;
}

.file-upload-box {
  border: 2px dashed var(--border);
  border-radius: var(--radius-md);
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  background: var(--bg-input);
  transition: border-color var(--transition);
}

.file-upload-box:hover {
  border-color: var(--accent);
}

.file-upload-box.error {
  border-color: var(--danger);
}

.file-upload-box.video {
  height: 120px;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  padding: 1rem;
  text-align: center;
}

.poster-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.form-actions {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
""",
    "src/pages/LoginPage.jsx": """import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import './LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSetup, setIsSetup] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSetup) {
        await authService.setup(username, password);
        await login(username, password);
      } else {
        const res = await login(username, password);
        if (!res.success) {
           setError(res.message || 'Login failed');
        }
      }
    } catch (err) {
      if (err.response?.status === 404 && !isSetup) {
        setIsSetup(true);
        setError('No admin exists. Please set up an account.');
      } else {
        setError(err.response?.data?.message || 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="logo"><span>Cine</span>Stream</h1>
          <p>{isSetup ? 'Admin Setup' : 'Admin Login'}</p>
        </div>
        
        {error && <div className="login-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Username</label>
            <input type="text" required value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? 'Please wait...' : (isSetup ? 'Setup Admin' : 'Login')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
""",
    "src/pages/LoginPage.css": """.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header .logo {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}

.login-header p {
  color: var(--text-secondary);
}

.login-error {
  background: var(--danger-muted);
  color: var(--danger);
  padding: 0.75rem;
  border-radius: var(--radius-sm);
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  text-align: center;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.login-btn {
  margin-top: 0.5rem;
  padding: 0.75rem;
  width: 100%;
}
""",
    "src/pages/DashboardPage.jsx": """import React, { useState, useEffect } from 'react';
import { Film, Eye, Star, CheckCircle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../services/api';
import StatsCard from '../components/StatsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import './DashboardPage.css';

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dashboardService.getDashboard();
        if (res.success) setData(res.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="page-loader"><LoadingSpinner /></div>;
  if (!data) return <div className="error-state">Failed to load dashboard</div>;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Overview</h2>
        <div className="dashboard-actions">
          <Link to="/movies/add" className="btn btn-primary">
            <Plus size={18} /> Add Movie
          </Link>
        </div>
      </div>

      <div className="stats-grid">
        <StatsCard title="Total Movies" value={data.totalMovies} icon={<Film size={24} />} color="primary" />
        <StatsCard title="Published" value={data.publishedMovies} icon={<CheckCircle size={24} />} color="success" />
        <StatsCard title="Featured" value={data.featuredMovies} icon={<Star size={24} />} color="warning" />
        <StatsCard title="Total Views" value={data.totalViews?.toLocaleString() || 0} icon={<Eye size={24} />} color="primary" />
      </div>

      <div className="recent-section">
        <div className="recent-header">
          <h3>Recent Uploads</h3>
          <Link to="/movies">View All</Link>
        </div>
        <div className="recent-list">
          {data.recentUploads?.length > 0 ? data.recentUploads.map(movie => (
            <div key={movie._id} className="recent-item">
              <img src={movie.posterUrl} alt={movie.title} />
              <div className="recent-info">
                <h4>{movie.title}</h4>
                <span>{new Date(movie.createdAt).toLocaleDateString()} • {movie.views?.toLocaleString() || 0} views</span>
              </div>
              <div className="recent-status">
                <span className={`badge ${movie.published ? 'badge-success' : 'badge-warning'}`}>
                  {movie.published ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
          )) : (
            <div className="empty-state">No recent uploads</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
""",
    "src/pages/DashboardPage.css": """.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-title {
  font-size: 1.5rem;
  font-weight: 600;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.recent-section {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
}

.recent-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.recent-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: var(--radius-md);
  background: var(--bg-input);
}

.recent-item img {
  width: 48px;
  height: 72px;
  object-fit: cover;
  border-radius: var(--radius-sm);
}

.recent-info {
  flex: 1;
}

.recent-info h4 {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.recent-info span {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.page-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}
""",
    "src/pages/MoviesPage.jsx": """import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { movieService } from '../services/api';
import { useToast } from '../context/ToastContext';
import MovieTable from '../components/MovieTable';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import './MoviesPage.css';

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });
  
  const [filters, setFilters] = useState({ search: '', genre: '', published: '' });
  
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null });
  const { addToast } = useToast();

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await movieService.getMovies({ ...filters, page: pagination.page });
      if (res.success) {
        setMovies(res.movies);
        setPagination(res.pagination);
      }
    } catch (err) {
      addToast('error', 'Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMovies();
    }, 300);
    return () => clearTimeout(timer);
  }, [filters, pagination.page]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePublishToggle = async (id, published) => {
    try {
      const res = await movieService.publishMovie(id, published);
      if (res.success) {
        setMovies(prev => prev.map(m => m._id === id ? { ...m, published } : m));
        addToast('success', `Movie ${published ? 'published' : 'unpublished'}`);
      }
    } catch (err) {
      addToast('error', 'Failed to update status');
    }
  };

  const handleFeatureToggle = async (id, featured) => {
    try {
      const res = await movieService.featureMovie(id, featured);
      if (res.success) {
        setMovies(prev => prev.map(m => m._id === id ? { ...m, featured } : m));
        addToast('success', `Movie ${featured ? 'featured' : 'unfeatured'}`);
      }
    } catch (err) {
      addToast('error', 'Failed to update featured status');
    }
  };

  const confirmDelete = (id) => {
    setDeleteDialog({ isOpen: true, id });
  };

  const handleDelete = async () => {
    try {
      const res = await movieService.deleteMovie(deleteDialog.id);
      if (res.success) {
        setMovies(prev => prev.filter(m => m._id !== deleteDialog.id));
        addToast('success', 'Movie deleted successfully');
      }
    } catch (err) {
      addToast('error', 'Failed to delete movie');
    } finally {
      setDeleteDialog({ isOpen: false, id: null });
    }
  };

  return (
    <div className="movies-page">
      <div className="movies-header">
        <div className="filters">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input type="text" name="search" placeholder="Search movies..." value={filters.search} onChange={handleFilterChange} />
          </div>
          <select name="published" value={filters.published} onChange={handleFilterChange}>
            <option value="">All Status</option>
            <option value="true">Published</option>
            <option value="false">Draft</option>
          </select>
        </div>
        <Link to="/movies/add" className="btn btn-primary">
          <Plus size={18} /> Add Movie
        </Link>
      </div>

      {loading ? (
        <div className="page-loader"><LoadingSpinner /></div>
      ) : (
        <>
          <MovieTable 
            movies={movies} 
            onPublishToggle={handlePublishToggle} 
            onFeatureToggle={handleFeatureToggle} 
            onDelete={confirmDelete} 
          />
          
          {pagination.pages > 1 && (
            <div className="pagination">
              <button disabled={pagination.page === 1} onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}>
                Previous
              </button>
              <span>Page {pagination.page} of {pagination.pages}</span>
              <button disabled={pagination.page === pagination.pages} onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}>
                Next
              </button>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Movie"
        message="Are you sure you want to delete this movie? This action cannot be undone."
        confirmText="Delete"
        isDanger={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, id: null })}
      />
    </div>
  );
};

export default MoviesPage;
""",
    "src/pages/MoviesPage.css": """.movies-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.movies-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.filters {
  display: flex;
  gap: 1rem;
  flex: 1;
}

.search-box {
  position: relative;
  max-width: 300px;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
}

.search-box input {
  width: 100%;
  padding-left: 2.25rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-primary);
  border-radius: var(--radius-sm);
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination button:not(:disabled):hover {
  background: var(--bg-elevated);
}

@media (max-width: 768px) {
  .movies-header {
    flex-direction: column;
    align-items: stretch;
  }
  .filters {
    flex-direction: column;
  }
  .search-box {
    max-width: 100%;
  }
}
""",
    "src/pages/AddMoviePage.jsx": """import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { movieService } from '../services/api';
import { useToast } from '../context/ToastContext';
import MovieForm from '../components/MovieForm';
import './AddMoviePage.css';

const AddMoviePage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const res = await movieService.createMovie(formData);
      if (res.success) {
        addToast('success', 'Movie created successfully');
        navigate('/movies');
      }
    } catch (err) {
      addToast('error', err.response?.data?.message || 'Failed to create movie');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-movie-page">
      <MovieForm onSubmit={handleSubmit} isLoading={loading} />
    </div>
  );
};

export default AddMoviePage;
""",
    "src/pages/AddMoviePage.css": """.add-movie-page {
  max-width: 1200px;
  margin: 0 auto;
}
""",
    "src/pages/EditMoviePage.jsx": """import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { movieService } from '../services/api';
import { useToast } from '../context/ToastContext';
import MovieForm from '../components/MovieForm';
import LoadingSpinner from '../components/LoadingSpinner';
import './EditMoviePage.css';

const EditMoviePage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await movieService.getMovieById(id);
        if (res.success) {
          setMovie(res.movie);
        }
      } catch (err) {
        addToast('error', 'Failed to fetch movie details');
        navigate('/movies');
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id, navigate, addToast]);

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      const res = await movieService.updateMovie(id, formData);
      if (res.success) {
        addToast('success', 'Movie updated successfully');
        navigate('/movies');
      }
    } catch (err) {
      addToast('error', err.response?.data?.message || 'Failed to update movie');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page-loader"><LoadingSpinner /></div>;

  return (
    <div className="edit-movie-page">
      <MovieForm initialData={movie} onSubmit={handleSubmit} isLoading={saving} />
    </div>
  );
};

export default EditMoviePage;
""",
    "src/pages/EditMoviePage.css": """.edit-movie-page {
  max-width: 1200px;
  margin: 0 auto;
}
""",
    "src/pages/AdsConfigPage.jsx": """import React, { useState, useEffect } from 'react';
import { adsService } from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import './AdsConfigPage.css';

const AdsConfigPage = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await adsService.getAdsConfig();
        setConfig(res);
      } catch (err) {
        addToast('error', 'Failed to load ad configuration');
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, [addToast]);

  if (loading) return <div className="page-loader"><LoadingSpinner /></div>;

  return (
    <div className="ads-config-page">
      <div className="config-info">
        <p>This page displays the current ad configuration. Ad settings are managed via the server configuration files.</p>
      </div>

      <div className="config-grid">
        <div className="config-card">
          <div className="card-header">
            <h3>App Open Ad</h3>
            <span className={`badge ${config?.appOpenAd?.enabled ? 'badge-success' : 'badge-warning'}`}>
              {config?.appOpenAd?.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <div className="card-body">
            <div className="config-item">
              <label>Unit ID</label>
              <div className="config-value">{config?.appOpenAd?.unitId || 'Not configured'}</div>
            </div>
            <div className="config-item">
              <label>Display Duration</label>
              <div className="config-value">{config?.appOpenAd?.duration || 0} seconds</div>
            </div>
          </div>
        </div>

        <div className="config-card">
          <div className="card-header">
            <h3>Pre-roll Ad</h3>
            <span className={`badge ${config?.preRollAd?.enabled ? 'badge-success' : 'badge-warning'}`}>
              {config?.preRollAd?.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <div className="card-body">
            <div className="config-item">
              <label>Unit ID</label>
              <div className="config-value">{config?.preRollAd?.unitId || 'Not configured'}</div>
            </div>
            <div className="config-item">
              <label>Display Duration</label>
              <div className="config-value">{config?.preRollAd?.duration || 0} seconds</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdsConfigPage;
""",
    "src/pages/AdsConfigPage.css": """.ads-config-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.config-info {
  background: var(--accent-muted);
  color: var(--accent);
  padding: 1rem;
  border-radius: var(--radius-md);
  border-left: 4px solid var(--accent);
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.config-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.card-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-elevated);
}

.card-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
}

.card-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.config-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.config-item label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.config-value {
  font-family: monospace;
  background: var(--bg-input);
  padding: 0.75rem;
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  border: 1px solid var(--border);
  word-break: break-all;
}
"""
}

def create_files():
    for filepath, content in files.items():
        full_path = os.path.join(base_dir, filepath)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, "w") as f:
            f.write(content)
    print("Files created successfully.")

create_files()
