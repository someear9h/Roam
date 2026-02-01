import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      if (response.data.success) {
        const authToken = response.data.data.token;
        const userData = { ...response.data.data };
        setToken(authToken);
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true, data: userData };
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password, phone = '', language = 'en') => {
    setIsLoading(true);
    try {
      const response = await authAPI.register({ name, email, password, phone, language });
      if (response.data.success) {
        // Backend returns token at response.data.token (not in data.data)
        const authToken = response.data.token;
        const userData = { ...response.data.data, token: authToken };
        setToken(authToken);
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true, data: userData };
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const getProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      if (response.data.success) {
        setUser(response.data.data);
        localStorage.setItem('user', JSON.stringify(response.data.data));
        return response.data.data;
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    getProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
