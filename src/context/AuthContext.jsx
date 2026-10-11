import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Default to Tharun Reddy (Admin / Owner demo)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('autohub_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      id: 1,
      name: 'Tharun Reddy',
      email: 'admin@autohub.com',
      role: 'ROLE_ADMIN',
      userRole: 'ADMIN',
      phone: '+91 9876543210',
      token: 'demo-admin-token'
    };
  });

  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('autohub_user', JSON.stringify(user));
      localStorage.setItem('autohub_token', user.token || 'demo-token');
    } else {
      localStorage.removeItem('autohub_user');
      localStorage.removeItem('autohub_token');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await api.auth.login({ email, password });
      setUser(res);
      return res;
    } catch (err) {
      setAuthError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await api.auth.register(userData);
      setUser(res);
      return res;
    } catch (err) {
      setAuthError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  // Quick Persona Switcher for Presentation & Viva
  const switchPersona = (role) => {
    if (role === 'ADMIN') {
      setUser({
        id: 1,
        name: 'AutoHub Admin (Workshop Manager)',
        email: 'admin@autohub.com',
        role: 'ROLE_ADMIN',
        userRole: 'ADMIN',
        phone: '+91 9876543210',
        token: 'admin-token'
      });
    } else {
      setUser({
        id: 2,
        name: 'Tharun Reddy (Customer)',
        email: 'tharun@gmail.com',
        role: 'ROLE_CUSTOMER',
        userRole: 'CUSTOMER',
        phone: '9876543210',
        token: 'customer-token'
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, authError, login, register, logout, switchPersona, isAdmin: user?.userRole === 'ADMIN' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
