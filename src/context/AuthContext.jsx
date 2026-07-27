import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const userData = localStorage.getItem('admin_user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      // បញ្ជូន JSON Body ដោយផ្ទាល់ ព្រោះ Backend បានកែរួចហើយ
      const response = await axiosInstance.post('/users/login', {
        username: username,
        password: password
      });

      if (response.data) {
        const userData = {
          id: response.data.user_id,
          username: response.data.username,
          email: response.data.email,
          isAdmin: response.data.is_admin
        };
        
        localStorage.setItem('admin_token', 'dummy-token');
        localStorage.setItem('admin_user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      }
    } catch (error) {
      let errorMessage = 'Invalid credentials';
      
      if (error.response) {
        // ត្រួតពិនិត្យ Status Code ផ្សេងៗ
        if (error.response.status === 401) {
          errorMessage = 'Invalid username or password';
        } else if (error.response.data?.detail) {
          // បើ Backend ត្រឡប់ error message ជាក់លាក់
          if (typeof error.response.data.detail === 'string') {
            errorMessage = error.response.data.detail;
          } else {
            errorMessage = 'Login failed';
          }
        }
      } else if (error.request) {
        errorMessage = 'No response from server (Check if Backend is running)';
      } else {
        errorMessage = error.message;
      }
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};