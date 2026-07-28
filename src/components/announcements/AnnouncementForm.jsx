import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import Loading from '../common/Loading';

const AnnouncementForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    is_important: false,
    expires_at: '',
  });

  useEffect(() => {
    if (id) {
      fetchAnnouncement();
    }
  }, [id]);

  const fetchAnnouncement = async () => {
    try {
      const response = await axiosInstance.get(`/announcements/${id}/`);
      const data = response.data;
      setFormData({
        title: data.title || '',
        content: data.content || '',
        is_important: data.is_important || false,
        expires_at: data.expires_at ? data.expires_at.slice(0, 16) : '',
      });
    } catch (error) {
      console.error('Error fetching announcement:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        expires_at: formData.expires_at || null,
      };
      delete payload.id;

      if (id) {
        await axiosInstance.put(`/announcements/${id}/`, payload);
      } else {
        await axiosInstance.post('/announcements/', payload);
      }
      navigate('/admin/announcements');
    } catch (error) {
      console.error('Error saving announcement:', error);
      alert('Error saving announcement: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <Loading fullScreen message="Loading announcement data..." />;
  }

  return (
    <div className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-3xl shadow-lg p-6 max-w-4xl mx-auto animate-fadeInUp">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 tracking-tight">
        {id ? 'Edit Announcement' : 'Create Announcement'}
      </h2>
      <div className="w-12 h-1 bg-gradient-to-r from-primary-400 to-primary-200 rounded-full mb-6"></div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200 placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content *
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows="6"
            className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200 placeholder-gray-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expires At
            </label>
            <input
              type="datetime-local"
              name="expires_at"
              value={formData.expires_at}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200"
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="is_important"
                checked={formData.is_important}
                onChange={handleChange}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
              <span className="text-sm font-medium text-gray-700">Important</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-white/20">
          <button
            type="button"
            onClick={() => navigate('/admin/announcements')}
            className="px-4 py-2 bg-white/30 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            {loading ? 'Saving...' : (id ? 'Update' : 'Create')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnnouncementForm;