import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import axiosInstance, { getFileUrl } from '../api/axiosConfig';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoLoading, setLogoLoading] = useState(true);

  useEffect(() => {
    if (location.state?.error) {
      setError(location.state.error);
    }
  }, [location.state]);

  // ទាញយក Logo ពី Backend
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await axiosInstance.get('/settings/');
        const settingsData = {};
        response.data.forEach(setting => {
          settingsData[setting.key] = setting.value;
        });
        if (settingsData.logo_url) {
          setLogoUrl(settingsData.logo_url);
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
      } finally {
        setLogoLoading(false);
      }
    };
    fetchLogo();
  }, []);

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(identifier, password);
    
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.error || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      
      {/* Main Card Container */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fadeInUp border border-blue-100">
        
        {/* ============ LEFT COLUMN: Login Form ============ */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          
          <div className="mb-8">
            {/* Logo */}
            <div className="mb-4">
              {!logoLoading && logoUrl ? (
                <img 
                  src={getFileUrl(logoUrl)} 
                  alt="NUCK Admin Logo"
                  className="h-12 w-auto object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="text-2xl font-bold text-primary-600">
                  NUCK
                </div>
              )}
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Login</h2>
            <p className="text-gray-500 text-sm">
              Welcome to log in to your NUCK Admin Dashboard.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username or Email</label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400"
                placeholder="Enter your username or email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg hover:bg-primary-700 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                  Logging in...
                </span>
              ) : (
                'LOGIN'
              )}
            </button>
          </form>
        </div>

        {/* ============ RIGHT COLUMN: Illustration ============ */}
        <div className="hidden md:flex w-full md:w-1/2 bg-blue-50/50 items-center justify-center p-8">
          <div className="relative w-full max-w-md">
            <img 
              src="https://i.pinimg.com/736x/85/8d/9c/858d9c9e9ddb3131cfc070903099788c.jpg"
              alt="Login Illustration"
              className="w-full h-auto object-contain rounded-2xl shadow-sm"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;