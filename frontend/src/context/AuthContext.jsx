import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ipl27_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('ipl27_token'));
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const data = await api.login(username, password);
      setUser(data.user);
      setToken(data.access_token);
      localStorage.setItem('ipl27_user', JSON.stringify(data.user));
      localStorage.setItem('ipl27_token', data.access_token);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    try {
      const data = await api.register(username, email, password);
      setUser(data.user);
      setToken(data.access_token);
      localStorage.setItem('ipl27_user', JSON.stringify(data.user));
      localStorage.setItem('ipl27_token', data.access_token);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const guestLogin = async () => {
    setLoading(true);
    try {
      const data = await api.guestLogin();
      setUser(data.user);
      setToken(data.access_token);
      localStorage.setItem('ipl27_user', JSON.stringify(data.user));
      localStorage.setItem('ipl27_token', data.access_token);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ipl27_user');
    localStorage.removeItem('ipl27_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, guestLogin, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
