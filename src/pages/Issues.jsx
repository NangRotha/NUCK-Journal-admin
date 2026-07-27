import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import Loading from '../components/common/Loading';
import IssueList from '../components/issues/IssueList';

const Issues = () => {
  const { t } = useTranslation();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const response = await axiosInstance.get('/issues');
      setIssues(response.data.issues || []);
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this issue?')) return;

    try {
      await axiosInstance.delete(`/issues/${id}`);
      fetchIssues();
    } catch (error) {
      console.error('Error deleting issue:', error);
    }
  };

  const handleSetCurrent = async (id) => {
    try {
      await axiosInstance.put(`/issues/${id}`, { is_current: true });
      fetchIssues();
    } catch (error) {
      console.error('Error setting current issue:', error);
    }
  };

  // Filter issues
  const filteredIssues = issues.filter(issue => {
    return issue.title?.toLowerCase().includes(search.toLowerCase()) ||
           `Volume ${issue.volume}, Issue ${issue.number}`.toLowerCase().includes(search.toLowerCase());
  });

  if (loading) {
    return <Loading fullScreen message="Loading issues..." />;
  }

  return (
    <div>
      {/* Title Section with Decorative Line */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            {t('admin.issues')}
          </h1>
          <div className="w-12 h-1 bg-gradient-to-r from-primary-400 to-primary-200 rounded-full mt-1"></div>
        </div>
        <Link
          to="/admin/issues/create"
          className="btn-primary rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          + {t('issue.create')}
        </Link>
      </div>

      {/* Search - Glass Card */}
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
          <div className="text-sm text-gray-600 flex items-center px-3 py-1 bg-white/30 backdrop-blur-sm rounded-full">
            {filteredIssues.length} issues found
          </div>
        </div>
      </div>

      {/* Issue List - Glass Table */}
      <IssueList
        issues={filteredIssues}
        onDelete={handleDelete}
        onSetCurrent={handleSetCurrent}
      />
    </div>
  );
};

export default Issues;