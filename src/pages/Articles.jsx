import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import ArticleList from '../components/articles/ArticleList';
import Loading from '../components/common/Loading';

const Articles = () => {
  const { t } = useTranslation();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axiosInstance.get('/articles/');
      setArticles(response.data.articles || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      await axiosInstance.delete(`/articles/${id}/`);
      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axiosInstance.put(`/articles/${id}/`, { status: newStatus });
      fetchArticles();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Filter articles
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title?.toLowerCase().includes(search.toLowerCase()) ||
                         article.authors?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <Loading fullScreen message="Loading articles..." />;
  }

  return (
    <div>
      {/* Title Section with Decorative Line */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            {t('admin.articles')}
          </h1>
          <div className="w-12 h-1 bg-gradient-to-r from-primary-400 to-primary-200 rounded-full mt-1"></div>
        </div>
        <Link
          to="/admin/articles/create"
          className="btn-primary rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          + {t('article.create')}
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200"
            >
              <option value="all">All Status</option>
              <option value="submitted">{t('article.submitted')}</option>
              <option value="under_review">{t('article.underReview')}</option>
              <option value="accepted">{t('article.accepted')}</option>
              <option value="published">{t('article.published')}</option>
              <option value="rejected">{t('article.rejected')}</option>
            </select>
          </div>
          <div className="text-sm text-gray-600 flex items-center px-3 py-1 bg-white/30 backdrop-blur-sm rounded-full">
            {filteredArticles.length} {t('common.articlesFound') || 'articles found'}
          </div>
        </div>
      </div>

      {/* Article List */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-16 bg-white/30 backdrop-blur-lg border border-white/20 rounded-3xl shadow-lg">
          <div className="text-6xl mb-4">📄</div>
          <p className="text-gray-500 text-lg">No articles found</p>
        </div>
      ) : (
        <div className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/50 backdrop-blur-sm border-b border-white/20">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    {t('common.title')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    {t('article.authors')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    {t('common.status')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    {t('common.date')}
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                    {t('common.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredArticles.map((article, index) => (
                  <tr 
                    key={article.id} 
                    className="group hover:bg-white/20 hover:scale-[1.002] transition-all duration-300 animate-fadeInUp cursor-default"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                        {article.title}
                      </div>
                      <div className="text-xs text-gray-500 group-hover:text-primary-500 transition-colors duration-200">
                        {article.doi && `DOI: ${article.doi}`}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {article.authors?.split(',').slice(0, 3).join(', ')}
                        {article.authors?.split(',').length > 3 && ' et al.'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        article.status === 'published' ? 'bg-green-100/80 text-green-800 backdrop-blur-sm' :
                        article.status === 'under_review' ? 'bg-blue-100/80 text-blue-800 backdrop-blur-sm' :
                        article.status === 'accepted' ? 'bg-purple-100/80 text-purple-800 backdrop-blur-sm' :
                        article.status === 'rejected' ? 'bg-red-100/80 text-red-800 backdrop-blur-sm' :
                        'bg-yellow-100/80 text-yellow-800 backdrop-blur-sm'
                      }`}>
                        {article.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(article.submitted_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <Link
                        to={`/admin/articles/${article.id}`}
                        className="text-primary-600 hover:text-primary-800 font-medium text-sm transition-colors duration-200 hover:underline"
                      >
                        {t('common.view')}
                      </Link>
                      <Link
                        to={`/admin/articles/edit/${article.id}`}
                        className="text-green-600 hover:text-green-800 font-medium text-sm transition-colors duration-200 hover:underline"
                      >
                        {t('common.edit')}
                      </Link>
                      <button
                        onClick={() => onDelete(article.id)}
                        className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors duration-200 hover:underline"
                      >
                        {t('common.delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Articles;