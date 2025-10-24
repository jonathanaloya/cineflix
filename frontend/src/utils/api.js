import axios from 'axios';

// Create axios instance with optimizations
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for auth token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Cache for API responses
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const cachedGet = async (url, options = {}) => {
  const cacheKey = `${url}${JSON.stringify(options)}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  const response = await api.get(url, options);
  cache.set(cacheKey, {
    data: response,
    timestamp: Date.now()
  });
  
  return response;
};

export default api;