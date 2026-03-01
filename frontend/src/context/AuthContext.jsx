import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, preferencesAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(null); // null = not checked yet

  // Initialize auth state from localStorage and validate token
  useEffect(() => {
    const init = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      const savedSelectedTrip = localStorage.getItem('selectedTrip');

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);

        // Validate the token is still valid by fetching profile
        try {
          const res = await authAPI.getProfile();
          if (res.data.success) {
            setUser(res.data.data);
            localStorage.setItem('user', JSON.stringify(res.data.data));
          }
        } catch (err) {
          // Token is expired/invalid — clear everything
          if (err?.response?.status === 401) {
            setUser(null);
            setToken(null);
            setIsAuthenticated(false);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('selectedTrip');
          }
        }
      }
      if (savedSelectedTrip) {
        try {
          setSelectedTrip(JSON.parse(savedSelectedTrip));
        } catch (e) {}
      }
      setIsLoading(false);
    };
    init();
  }, []);

const login = async (email, password) => {
  const response = await authAPI.login({ email, password });

  const authToken = response.data.data.token;

  setToken(authToken);
  setIsAuthenticated(true);

  localStorage.setItem("token", authToken);

  const profile = await getProfile();

  // ✅ correct API
  let onboardingComplete = false;

  try {
    const statusRes = await preferencesAPI.checkOnboardingStatus();

    onboardingComplete =
      statusRes?.data?.data?.onboarding_complete ??
      statusRes?.data?.data?.completed ??
      false;

  } catch {
    onboardingComplete = false;
  }

  return {
    success: true,
    onboardingComplete
  };
};

const register = async (name, email, password, phone = '', language = 'en') => {
  setIsLoading(true);

  try {
    const response = await authAPI.register({
      name,
      email,
      password,
      phone,
      language
    });

    const authToken = response.data.token;
    const userData = response.data.data;

    setToken(authToken);
    setUser(userData);
    setIsAuthenticated(true);

    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));

    // New users should always go through onboarding to save preferences,
    // regardless of what the backend onboarding-status returns.
    try {
      localStorage.setItem('justRegistered', '1');
    } catch (e) {}

    return {
      success: true,
      onboardingComplete: false
    };

  } finally {
    setIsLoading(false);
  }
};

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setSelectedTrip(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('selectedTrip');
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

  const refreshOnboardingStatus = async () => {
    try {
      const statusRes = await preferencesAPI.checkOnboardingStatus();

      const complete =
        statusRes?.data?.data?.onboarding_complete ??
        statusRes?.data?.data?.completed ??
        false;

      setOnboardingDone(complete);

      setUser(prev => ({
        ...prev,
        onboarding_complete: complete
      }));

      const updatedUser = {
        ...JSON.parse(localStorage.getItem("user") || "{}"),
        onboarding_complete: complete
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      return complete;

    } catch {
      return false;
    }
  };

  const value = {
    user,
    token,
    selectedTrip,
    setSelectedTrip: (trip) => {
      setSelectedTrip(trip);
      try { localStorage.setItem('selectedTrip', JSON.stringify(trip)); } catch (e) {}
    },
    isLoading,
    isAuthenticated,
    onboardingDone,
    setOnboardingDone,
    login,
    register,
    logout,
    getProfile,
    refreshOnboardingStatus
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