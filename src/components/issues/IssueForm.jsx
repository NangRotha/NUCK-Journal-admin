import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import Loading from '../common/Loading';

const IssueForm = ({ issue: propIssue, onSave }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [issue, setIssue] = useState(propIssue || null);
  const [formData, setFormData] = useState({
    volume: propIssue?.volume || '',
    number: propIssue?.number || '',
    year: propIssue?.year || new Date().getFullYear(),
    title: propIssue?.title || '',
    description: propIssue?.description || '',
    is_current: propIssue?.is_current || false,
    published_date: propIssue?.published_date ? propIssue.published_date.split('T')[0] : new Date().toISOString().split('T')[0],
    cover_image: null,
  });

  useEffect(() => {
    if (id && !propIssue) {
      fetchIssue();
    } else if (propIssue) {
      setIssue(propIssue);
    }
  }, [id, propIssue]);

  const fetchIssue = async () => {
    setFetching(true);
    try {
      const response = await axiosInstance.get(`/issues/${id}/`);
      const data = response.data;
      setIssue(data);
      setFormData({
        volume: data.volume || '',
        number: data.number || '',
        year: data.year || new Date().getFullYear(),
        title: data.title || '',
        description: data.description || '',
        is_current: data.is_current || false,
        published_date: data.published_date ? data.published_date.split('T')[0] : new Date().toISOString().split('T')[0],
        cover_image: null,
      });
    } catch (error) {
      console.error('Error fetching issue:', error);
      alert('Failed to load issue');
      navigate('/admin/issues');
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

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataObj = new FormData();
      
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== '' && key !== 'cover_image') {
          formDataObj.append(key, formData[key]);
        }
      });

      if (formData.cover_image) {
        formDataObj.append('cover_image', formData.cover_image);
      }

      if (!formData.published_date) {
        formDataObj.append('published_date', new Date().toISOString().split('T')[0]);
      }

      if (issue?.id) {
        await axiosInstance.put(`/issues/${issue.id}/`, formDataObj, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axiosInstance.post('/issues/', formDataObj, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      
      if (onSave) onSave();
      navigate('/admin/issues');
    } catch (error) {
      console.error('Error saving issue:', error);
      alert('Error saving issue: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <Loading fullScreen message="Loading issue data..." />;
  }

  return (
    <div className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-3xl shadow-lg p-6 max-w-4xl mx-auto animate-fadeInUp">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 tracking-tight">
        {issue?.id ? 'Edit Issue' : 'Create New Issue'}
      </h2>
      <div className="w-12 h-1 bg-gradient-to-r from-primary-400 to-primary-200 rounded-full mb-6"></div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('issue.volume')} *
            </label>
            <input
              type="text"
              name="volume"
              value={formData.volume}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200 placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('issue.number')} *
            </label>
            <input
              type="text"
              name="number"
              value={formData.number}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200 placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('issue.year')} *
            </label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200 placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('issue.publishedDate')} *
            </label>
            <input
              type="date"
              name="published_date"
              value={formData.published_date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200 placeholder-gray-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('issue.title')} *
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

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('issue.description')}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200 placeholder-gray-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('issue.coverImage')}
            </label>
            <input
              type="file"
              name="cover_image"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200 placeholder-gray-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="is_current"
                checked={formData.is_current}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">
                {t('issue.current')}
              </span>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-white/20">
          <button
            type="button"
            onClick={() => navigate('/admin/issues')}
            className="px-4 py-2 bg-white/30 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/50 transition-colors duration-200"
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            {loading ? 'Saving...' : issue?.id ? t('common.update') : t('common.create')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default IssueForm;