import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import Loading from '../common/Loading';

const PolicyForm = ({ policy: propPolicy, onSave }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [policy, setPolicy] = useState(propPolicy || null);
  const [formData, setFormData] = useState({
    title: propPolicy?.title || '',
    content: propPolicy?.content || '',
    category: propPolicy?.category || 'peer_review',
    version: propPolicy?.version || '1.0',
  });

  useEffect(() => {
    if (id && !propPolicy) {
      fetchPolicy();
    } else if (propPolicy) {
      setPolicy(propPolicy);
    }
  }, [id, propPolicy]);

  const fetchPolicy = async () => {
    setFetching(true);
    try {
      const response = await axiosInstance.get(`/policies/${id}/`);
      const data = response.data;
      setPolicy(data);
      setFormData({
        title: data.title || '',
        content: data.content || '',
        category: data.category || 'peer_review',
        version: data.version || '1.0',
      });
    } catch (error) {
      console.error('Error fetching policy:', error);
      alert('Failed to load policy');
      navigate('/admin/policies');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🛠️ CRITICAL FIX: Added trailing slashes to match FastAPI
      if (policy?.id) {
        await axiosInstance.put(`/policies/${policy.id}/`, formData);
      } else {
        await axiosInstance.post('/policies/', formData);
      }
      
      if (onSave) onSave();
      navigate('/admin/policies');
    } catch (error) {
      console.error('Error saving policy:', error);
      alert('Failed to save policy. Please check the console.');
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = [
    { value: 'peer_review', label: 'Peer Review' },
    { value: 'ethics', label: 'Publication Ethics' },
    { value: 'open_access', label: 'Open Access' },
    { value: 'copyright', label: 'Copyright & Licensing' },
    { value: 'misconduct', label: 'Research Misconduct' },
    { value: 'conflict', label: 'Conflict of Interest' },
    { value: 'corrections', label: 'Corrections & Retractions' },
    { value: 'data_availability', label: 'Data Availability' },
    { value: 'complaints', label: 'Complaints & Appeals' },
  ];

  if (fetching) {
    return <Loading fullScreen message="Loading policy data..." />;
  }

  return (
    <div className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-3xl shadow-lg p-6 max-w-4xl mx-auto animate-fadeInUp">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 tracking-tight">
        {policy?.id ? 'Edit Policy' : 'Create New Policy'}
      </h2>
      <div className="w-12 h-1 bg-gradient-to-r from-primary-400 to-primary-200 rounded-full mb-6"></div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('policy.title')} *
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
              {t('policy.category')} *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200"
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('policy.version')} *
            </label>
            <input
              type="text"
              name="version"
              value={formData.version}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200 placeholder-gray-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('policy.content')} *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows="10"
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200 placeholder-gray-400"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-white/20">
          <button
            type="button"
            onClick={() => navigate('/admin/policies')}
            className="px-4 py-2 bg-white/30 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/50 transition-colors duration-200"
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            {loading ? 'Saving...' : policy?.id ? t('common.update') : t('common.create')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PolicyForm;