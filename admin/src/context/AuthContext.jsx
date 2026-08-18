import React, { createContext, useContext, useState, useEffect } from 'react';
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
