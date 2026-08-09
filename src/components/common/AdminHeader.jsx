import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import axiosInstance, { getFileUrl } from '../../api/axiosConfig';

const AdminHeader = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [logoUrl, setLogoUrl] = useState('');
  const [logoLoading, setLogoLoading] = useState(true);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/articles/create') || path.includes('/articles/edit')) return 'Articles';
    if (path.includes('/articles/')) return 'Article Details';
    if (path.includes('/articles')) return 'Articles';
    if (path.includes('/issues/create') || path.includes('/issues/edit')) return 'Issues';
    if (path.includes('/issues')) return 'Issues';
    if (path.includes('/editors/create') || path.includes('/editors/edit')) return 'Editors';
    if (path.includes('/editors')) return 'Editors';
    if (path.includes('/users/create') || path.includes('/users/edit')) return 'Users';
    if (path.includes('/users/')) return 'User Details';
    if (path.includes('/users')) return 'Users';
    if (path.includes('/policies/create') || path.includes('/policies/edit')) return 'Policies';
    if (path.includes('/policies')) return 'Policies';
    if (path.includes('/reviews/')) return 'Review Details';
    if (path.includes('/reviews')) return 'Reviews';
    if (path.includes('/review-invitations')) return 'Review Invitations';
    if (path.includes('/hero-slides/create') || path.includes('/hero-slides/edit')) return 'Hero Slides';
    if (path.includes('/hero-slides')) return 'Hero Slides';
    if (path.includes('/settings')) return 'Settings';
    return 'Dashboard';
  };

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await axiosInstance.get('/settings/');
        const settingsData = {};
        response.data.forEach(setting => {
          settingsData[setting.key] = setting.value;
        });
        if (settingsData.logo_url) setLogoUrl(settingsData.logo_url);
      } catch (error) {
        console.error('Error fetching header logo:', error);
      } finally {
        setLogoLoading(false);
      }
    };
    fetchLogo();
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center">
        <h2 className="text-lg font-bold text-gray-800">{getPageTitle()}</h2>
      </div>

      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium text-gray-700">{user?.full_name || 'Admin'}</p>
            <p className="text-[10px] text-gray-500">{user?.email || ''}</p>
          </div>
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {(user?.full_name?.charAt(0) || 'A')}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;