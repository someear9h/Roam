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
    const resp = error.response;
    // Clear local auth state on 401 but don't force navigation
    if (resp?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    // Build a friendly message for 400-level validation errors (Zod) or other server responses
    try {
      if (resp && resp.data) {
        const data = resp.data;
        let friendly = null;

        if (typeof data === 'string') friendly = data;
        else if (typeof data.error === 'string') friendly = data.error;
        else if (typeof data.message === 'string') friendly = data.message;
        else if (typeof data.error === 'object') {
          // Try to extract first zod-style message
          const vals = Object.values(data.error);
          for (const v of vals) {
            if (v && Array.isArray(v._errors) && v._errors.length) {
              friendly = v._errors[0];
              break;
            }
          }
        } else if (typeof data === 'object') {
          // Generic object -> stringify a concise summary
          friendly = Object.entries(data).slice(0,3).map(([k,v]) => `${k}: ${typeof v === 'string' ? v : JSON.stringify(v).slice(0,80)}`).join(' | ');
        }

        if (friendly) {
          // Set error.message so components using error.message get a friendly string
          error.message = friendly;
          error.friendlyMessage = friendly;
        }
      }
    } catch (e) {
      // ignore
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
  createTrip: (data) => api.post('/trips', data),
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
  chat: (tripId, data) => api.post(`/ai/trips/${tripId}/chat`, { tripId: Number(tripId), ...(data || {}) }),
  generateItinerary: (tripId, data) => api.post(`/ai/trips/${tripId}/itinerary`, { tripId: Number(tripId), ...(data || {}) }),
  getItinerary: (tripId) => api.get(`/ai/trips/${tripId}/itinerary`),
  localGuide: (tripId, data) => api.post(`/ai/trips/${tripId}/local-guide`, { tripId: Number(tripId), ...(data || {}) }),
  vrExplain: (tripId, data) => api.post(`/ai/trips/${tripId}/vr-explain`, { tripId: Number(tripId), ...(data || {}) }),
  // OCR endpoint is global on backend
  extractText: (data) => api.post('/ai/ocr', data),
  getChatHistory: (tripId) => api.get(`/ai/trips/${tripId}/chat-history`),
  clearChatHistory: (tripId) => api.delete(`/ai/trips/${tripId}/chat-history`),
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
  getFullSummary: (tripId) => api.get(`/summary/trips/${tripId}`),
  getMemories: (tripId) => api.get(`/summary/trips/${tripId}/memories`),
  addMemory: (tripId, data) => api.post(`/summary/trips/${tripId}/memories`, data),
  getFeedback: (tripId) => api.get(`/summary/trips/${tripId}/feedback`),
  submitFeedback: (tripId, data) => api.post(`/summary/trips/${tripId}/feedback`, data),
  generateSummary: (tripId) => api.post(`/summary/trips/${tripId}/generate`),
};
// REVIEW ENDPOINTS
export const reviewAPI = {
  getTripReviews: (tripId) => api.get(`/trips/${tripId}/reviews`),
  createReview: (tripId, data) => api.post(`/trips/${tripId}/reviews`, data),
  updateReview: (reviewId, data) => api.put(`/reviews/${reviewId}`, data),
  deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}`),
};
// DESTINATION ENDPOINTS
export const destinationAPI = {
  getDestination: (name) => api.get(`/destination/${encodeURIComponent(name)}`),
  getVrAssets: (name) => api.get(`/destination/${encodeURIComponent(name)}/vr-assets`),
  list: () => api.get('/destination')
};

// EMERGENCY ENDPOINTS
export const emergencyAPI = {
  getEmergencyInfo: (tripId, data) => api.post(`/emergency/trips/${tripId}`, data),
};

// FLIGHT & HOTEL ENDPOINTS (trip-scoped)
// Flight APIs removed — flights subsystem deprecated

export const hotelAPI = {
  searchHotels: (tripId, data) => api.post(`/hotels/trips/${tripId}`, data),
  bookHotel: (tripId, data) => api.post(`/hotels/trips/${tripId}/book`, data),
  getBookings: (tripId) => api.get(`/hotels/trips/${tripId}/bookings`),
};

export default api;
