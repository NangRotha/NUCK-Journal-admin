import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import Loading from '../components/common/Loading';
import AnnouncementList from '../components/announcements/AnnouncementList';

const Announcements = () => {
  const { t } = useTranslation();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axiosInstance.get('/announcements/', {
        params: {
          limit: 100,
          active_only: false
        }
      });
      console.log('✅ Backend Response:', response.data);
      
      if (response.data && Array.isArray(response.data.announcements)) {
        setAnnouncements(response.data.announcements);
      } else {
        setAnnouncements([]);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    try {
      await axiosInstance.delete(`/announcements/${id}`);
      fetchAnnouncements(); // Refresh list
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  // Filter announcements
  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title?.toLowerCase().includes(search.toLowerCase()) ||
                         announcement.content?.toLowerCase().includes(search.toLowerCase());
    
    if (filter === 'important') return matchesSearch && announcement.is_important;
    if (filter === 'active') {
      const isActive = !announcement.expires_at || new Date(announcement.expires_at) > new Date();
      return matchesSearch && isActive;
    }
    return matchesSearch;
  });

  if (loading) {
    return <Loading fullScreen message="Loading announcements..." />;
  }

  return (
    <div>
      {/* Title Section with Decorative Line */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            {t('admin.announcements')}
          </h1>
          <div className="w-12 h-1 bg-gradient-to-r from-primary-400 to-primary-200 rounded-full mt-1"></div>
        </div>
        <Link
          to="/admin/announcements/create"
          className="btn-primary rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          + {t('announcement.create')}
        </Link>
      </div>

      {/* Filters - Glass Card */}
      <div className="bg-white/40 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg p-4 mb-6 hover:shadow-xl transition-all duration-300">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder={t('common.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200 placeholder-gray-400"
            />
          </div>
          <div className="w-48">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200"
            >
              <option value="all">All</option>
              <option value="important">Important Only</option>
              <option value="active">Active Only</option>
            </select>
          </div>
          <div className="text-sm text-gray-600 flex items-center px-3 py-1 bg-white/30 backdrop-blur-sm rounded-full">
            {filteredAnnouncements.length} announcements found
          </div>
        </div>
      </div>

      {/* Announcement List - Glass Table */}
      <AnnouncementList
        announcements={filteredAnnouncements}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Announcements;