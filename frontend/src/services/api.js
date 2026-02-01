import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
  createTrip: (data) => api.post('/trips/create', data),
  getTripContext: (tripId) => api.get(`/trips/${tripId}/context`),
};

// AI ENDPOINTS
export const aiAPI = {
  chat: (data) => api.post('/ai/chat', data),
  generateItinerary: (data) => api.post('/ai/itinerary', data),
  getItinerary: (tripId) => api.get(`/ai/itinerary/${tripId}`),
  localGuide: (data) => api.post('/ai/local-guide', data),
  vrExplain: (data) => api.post('/ai/vr-explain', data),
};

// DESTINATION ENDPOINTS
export const destinationAPI = {
  // Add destination endpoints as needed
};

// EMERGENCY ENDPOINTS
export const emergencyAPI = {
  // Add emergency endpoints as needed
};

export default api;
