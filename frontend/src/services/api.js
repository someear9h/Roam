import axios from 'axios';

// Use relative URL when proxy is configured in vite, fallback to env variable or direct URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// AUTH ENDPOINTS
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updatePreferences: (data) => api.put('/auth/preferences', data),
};

// TRIP ENDPOINTS
export const tripAPI = {
  getTrips: () => api.get('/trips'),
  getTrip: (tripId) => api.get(`/trips/${tripId}`),
  createTrip: (data) => api.post('/trips/create', data),
  getTripContext: (tripId) => api.get(`/trips/${tripId}/context`),
  getTravelReadiness: (tripId) => api.get(`/trips/${tripId}/readiness`),
  updateTripStatus: (tripId, status) => api.put(`/trips/${tripId}/status`, { status }),
};

// USER PREFERENCES ENDPOINTS (Onboarding)
export const preferencesAPI = {
  getPreferences: () => api.get('/preferences'),
  updatePreferences: (data) => api.put('/preferences', data),
  savePreferences: (data) => api.post('/preferences', data),
  completeOnboarding: (data) => api.post('/preferences/onboarding', data),
  checkOnboardingStatus: () => api.get('/preferences/onboarding-status'),
};

// AI ENDPOINTS
export const aiAPI = {
  chat: (data) => api.post('/ai/chat', data),
  generateItinerary: (data) => api.post('/ai/itinerary', data),
  getItinerary: (tripId) => api.get(`/ai/itinerary/${tripId}`),
  localGuide: (data) => api.post('/ai/local-guide', data),
  vrExplain: (data) => api.post('/ai/vr-explain', data),
};

// ALERTS ENDPOINTS
export const alertsAPI = {
  getAlerts: (tripId) => api.get(`/alerts/${tripId}`),
  getUnreadCount: (tripId) => api.get(`/alerts/${tripId}/unread-count`),
  generateSmartAlerts: (tripId) => api.post(`/alerts/${tripId}/generate`),
  markAsRead: (alertId) => api.put(`/alerts/${alertId}/read`),
  markAllAsRead: (tripId) => api.put(`/alerts/${tripId}/read-all`),
};

// TRIP SUMMARY ENDPOINTS
export const summaryAPI = {
  getFullSummary: (tripId) => api.get(`/summary/${tripId}`),
  getMemories: (tripId) => api.get(`/summary/${tripId}/memories`),
  addMemory: (data) => api.post('/summary/memories', data),
  getFeedback: (tripId) => api.get(`/summary/${tripId}/feedback`),
  submitFeedback: (data) => api.post('/summary/feedback', data),
  generateSummary: (tripId) => api.post('/summary/generate', { tripId }),
};

// DESTINATION ENDPOINTS
export const destinationAPI = {
  getDestination: (name) => api.get(`/destination/${encodeURIComponent(name)}`),
  getVrAssets: (name) => api.get(`/destination/${encodeURIComponent(name)}/vr-assets`),
};

// EMERGENCY ENDPOINTS
export const emergencyAPI = {
  getEmergencyInfo: (data) => api.post('/emergency/ai/emergency', data),
};

export default api;
