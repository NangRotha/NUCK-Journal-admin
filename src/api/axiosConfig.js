import axios from 'axios';

// ទាញយក URL ពី Environment Variable (ឬប្រើ Default ប្រសិនបើគ្មាន)
// សូមប្តូរ URL ខាងក្រោមទៅជា URL របស់ Railway ឬ Vercel របស់អ្នក
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://nuck-journal-backend.vercel.app';

const axiosInstance = axios.create({
  baseURL: import.meta.env.DEV ? '/' : API_BASE_URL,
  timeout: 10000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
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

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper function to get full File URL
export const getFileUrl = (filePath) => {
  if (!filePath) return '';
  // បើ filePath ចាប់ផ្តើមដោយ / រួចហើយ គ្រាន់តែបន្ថែម Base URL
  if (filePath.startsWith('/')) {
    return `${API_BASE_URL}${filePath}`;
  }
  return `${API_BASE_URL}/${filePath}`;
};

export default axiosInstance;