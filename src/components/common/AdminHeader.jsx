import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import axiosInstance, { getFileUrl } from '../../api/axiosConfig';

const AdminHeader = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [logoUrl, setLogoUrl] = useState('');
  const [logoLoading, setLogoLoading] = useState(true);

  // ✅ ទាញយក Logo ពី Backend
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await axiosInstance.get('/settings');
        const settingsData = {};
        response.data.forEach(setting => {
          settingsData[setting.key] = setting.value;
        });
        if (settingsData.logo_url) {
          setLogoUrl(settingsData.logo_url);
        }
      } catch (error) {
        console.error('Error fetching header logo:', error);
      } finally {
        setLogoLoading(false);
      }
    };
    fetchLogo();
  }, []);

  return (
    <header className="bg-white/40 backdrop-blur-lg border-b border-white/20 shadow-lg sticky top-0 z-50 transition-all duration-300 animate-fadeInUp">
      <div className="px-6 py-4 flex items-center justify-between">
        
        {/* Left Side: Brand */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-3">
            
            {/* ✅ Logo Wrapper - ទាញយកពី Backend */}
            <div className="w-10 h-10 bg-gradient-to-br from-[#5b4fcf] to-[#6c5ce7] rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-[#5b4fcf]/30 overflow-hidden relative">
              {!logoLoading && logoUrl ? (
                <img 
                  src={getFileUrl(logoUrl)} 
                  alt="NUCK Admin Logo"
                  className="w-full h-full object-contain p-1"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    const parent = e.target.parentElement;
                    const fallback = document.createElement('div');
                    fallback.className = 'absolute inset-0 flex items-center justify-center text-white';
                    fallback.innerHTML = `
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    `;
                    parent.appendChild(fallback);
                  }}
                />
              ) : (
                // ✅ Fallback ពេលគ្មាន Logo ឬកំពុងផ្ទុក
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              )}
            </div>
            
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-gray-800 tracking-tight leading-tight">NUCK Admin</h1>
              {/* Decorative Line ពណ៌ស្វាយ */}
              <div className="w-10 h-1 bg-gradient-to-r from-[#6c5ce7] to-[#a29bfe] rounded-full mt-0.5"></div>
            </div>
          </div>
        </div>

        {/* Right Side: Language Switcher & User Info */}
        <div className="flex items-center space-x-5">
          <LanguageSwitcher />
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700 group-hover:text-[#6c5ce7] transition-colors duration-200">
                {user?.username || 'Admin'}
              </p>
              <p className="text-xs text-gray-500">{user?.email || ''}</p>
            </div>
            <button
              onClick={logout}
              className="group text-gray-600 hover:text-red-600 transition-colors duration-200 bg-white/50 hover:bg-red-50/80 backdrop-blur-sm p-2 rounded-xl border border-white/20 hover:border-red-200/50 transition-all duration-300"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;