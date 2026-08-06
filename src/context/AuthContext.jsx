import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token');
      const storedUser = localStorage.getItem('admin_user');
      
      if (token && storedUser) {
        try {
          // Set Authorization header for all future requests
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setUser(JSON.parse(storedUser));
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // 🟢 Fixed: The login function now actually calls the backend!
  const login = async (identifier, password) => {
    try {
      const response = await axiosInstance.post('/users/login', { email: identifier, password });
      
      // 2. Extract user data and token from backend response
      // Note: You must make sure your backend returns a 'token' field!
      const { user_id, full_name, email, role, token } = response.data;

      // 3. Prepare user object
      const userData = { id: user_id, full_name, email, role };

      // 4. Store in LocalStorage
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify(userData));
      
      // 5. Set Auth Header globally
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // 6. Update React State
      setUser(userData);

      return { success: true };
    } catch (error) {
      // Return the error to the Login component
      return { 
        success: false, 
        error: typeof error.response?.data?.detail === 'string' 
          ? error.response.data.detail 
          : 'Invalid credentials. Please try again.' 
      };
    }
  };

  // 🟢 Fixed: Logout clears everything cleanly
  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    delete axiosInstance.defaults.headers.common['Authorization'];
    setUser(null);
    window.location.href = '/login';
  };

  const value = {
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};