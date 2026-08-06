import axios from 'axios';

// 🟢 CHANGE THIS: Use your Railway backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://nuck-journal-backend-production.up.railway.app';

export const getFileUrl = (filePath) => {
  if (!filePath) return '';
  if (filePath.startsWith('http')) return filePath;
  if (filePath.startsWith('/')) return `${API_BASE_URL}${filePath}`;
  return `${API_BASE_URL}/${filePath}`;
};

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // 🟢 FIX: Automatically attach the token if it exists
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 🟢 FIX: If token is invalid (401), auto logout
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/login';
    }

    if (error.response) {
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      console.error('No response from server. Check if Backend is running.');
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;