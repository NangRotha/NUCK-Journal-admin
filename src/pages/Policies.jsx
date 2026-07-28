import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import Loading from '../components/common/Loading';
import PolicyList from '../components/policies/PolicyList';

const Policies = () => {
  const { t } = useTranslation();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const response = await axiosInstance.get('/policies/');
      setPolicies(response.data.policies || []);
    } catch (error) {
      console.error('Error fetching policies:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🛠️ CRITICAL FIX: Added a trailing slash '/' at the end of the URL
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this policy?')) return;

    try {
      await axiosInstance.delete(`/policies/${id}/`); 
      // Refresh the list after successful deletion
      fetchPolicies();
    } catch (error) {
      console.error('Error deleting policy:', error);
      alert('Failed to delete policy. Please check the console for errors.');
    }
  };

  const categoryLabels = {
    peer_review: 'Peer Review',
    ethics: 'Publication Ethics',
    open_access: 'Open Access',
    copyright: 'Copyright & Licensing',
    misconduct: 'Research Misconduct',
    conflict: 'Conflict of Interest',
    corrections: 'Corrections & Retractions',
    data_availability: 'Data Availability',
    complaints: 'Complaints & Appeals',
  };

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.title?.toLowerCase().includes(search.toLowerCase()) ||
                         policy.content?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || policy.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <Loading fullScreen message="Loading policies..." />;
  }

  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            {t('admin.policies')}
          </h1>
          <div className="w-12 h-1 bg-gradient-to-r from-primary-400 to-primary-200 rounded-full mt-1"></div>
        </div>
        <Link
          to="/admin/policies/create"
          className="btn-primary rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          + {t('policy.create')}
        </Link>
      </div>

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
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200"
            >
              <option value="all">All Categories</option>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-600 flex items-center px-3 py-1 bg-white/30 backdrop-blur-sm rounded-full">
            {filteredPolicies.length} policies found
          </div>
        </div>
      </div>

      <PolicyList
        policies={filteredPolicies}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Policies;