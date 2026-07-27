import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance, { getFileUrl } from '../../api/axiosConfig';
import Loading from '../common/Loading';

const ArticleDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const response = await axiosInstance.get(`/articles/${id}`);
      setArticle(response.data);
    } catch (error) {
      console.error('Error fetching article:', error);
      setError('Failed to load article details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await axiosInstance.put(`/articles/${id}`, { status: newStatus });
      fetchArticle();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      await axiosInstance.delete(`/articles/${id}`);
      navigate('/admin/articles');
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      submitted: 'bg-yellow-100/80 text-yellow-800 backdrop-blur-sm',
      under_review: 'bg-blue-100/80 text-blue-800 backdrop-blur-sm',
      accepted: 'bg-green-100/80 text-green-800 backdrop-blur-sm',
      published: 'bg-purple-100/80 text-purple-800 backdrop-blur-sm',
      rejected: 'bg-red-100/80 text-red-800 backdrop-blur-sm',
    };
    return colors[status] || 'bg-gray-100/80 text-gray-800 backdrop-blur-sm';
  };

  if (loading) {
    return <Loading fullScreen message="Loading article details..." />;
  }

  if (error || !article) {
    return (
      <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 text-red-700 p-4 rounded-2xl">
        {error || 'Article not found'}
      </div>
    );
  }

  return (
    <div>
      {/* Header - Glass Card */}
      <div className="flex justify-between items-start mb-8 animate-fadeInUp">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(article.status)}`}>
              {article.status?.replace('_', ' ')}
            </span>
            <span className="text-sm text-gray-500">
              Submitted: {new Date(article.submitted_date).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight leading-tight">
            {article.title}
          </h1>
          <div className="w-12 h-1 bg-gradient-to-r from-primary-400 to-primary-200 rounded-full mt-1"></div>
          {article.doi && (
            <a
              href={`https://doi.org/${article.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-600 hover:text-primary-700 mt-1 inline-block"
            >
              DOI: {article.doi}
            </a>
          )}
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/admin/articles/edit/${id}`}
            className="btn-primary rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            {t('common.edit')}
          </Link>
          <button
            onClick={handleDelete}
            className="btn-danger rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            {t('common.delete')}
          </button>
        </div>
      </div>

      {/* Status Management - Glass Card */}
      <div className="bg-white/40 backdrop-blur-lg border border-white/20 rounded-3xl shadow-lg p-6 mb-8 animate-fadeInUp animation-delay-200 hover:shadow-xl transition-all duration-300">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Manage Status</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleStatusChange('submitted')}
            className="px-4 py-2 bg-yellow-100/80 text-yellow-800 rounded-xl hover:bg-yellow-200/80 transition-colors duration-200 text-sm font-medium backdrop-blur-sm"
          >
            Submitted
          </button>
          <button
            onClick={() => handleStatusChange('under_review')}
            className="px-4 py-2 bg-blue-100/80 text-blue-800 rounded-xl hover:bg-blue-200/80 transition-colors duration-200 text-sm font-medium backdrop-blur-sm"
          >
            Under Review
          </button>
          <button
            onClick={() => handleStatusChange('accepted')}
            className="px-4 py-2 bg-green-100/80 text-green-800 rounded-xl hover:bg-green-200/80 transition-colors duration-200 text-sm font-medium backdrop-blur-sm"
          >
            Accepted
          </button>
          <button
            onClick={() => handleStatusChange('published')}
            className="px-4 py-2 bg-purple-100/80 text-purple-800 rounded-xl hover:bg-purple-200/80 transition-colors duration-200 text-sm font-medium backdrop-blur-sm"
          >
            Published
          </button>
          <button
            onClick={() => handleStatusChange('rejected')}
            className="px-4 py-2 bg-red-100/80 text-red-800 rounded-xl hover:bg-red-200/80 transition-colors duration-200 text-sm font-medium backdrop-blur-sm"
          >
            Rejected
          </button>
        </div>
      </div>

      {/* Main Content - Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Abstract & Keywords */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/40 backdrop-blur-lg border border-white/20 rounded-3xl shadow-lg p-6 animate-fadeInUp animation-delay-400 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {t('article.abstract')}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {article.abstract}
            </p>
            {article.abstract_khmer && (
              <div className="mt-4 pt-4 border-t border-white/20">
                <h4 className="text-md font-semibold text-gray-800 mb-2">
                  {t('article.abstractKhmer')}
                </h4>
                <p className="text-gray-700 leading-relaxed font-khmer">
                  {article.abstract_khmer}
                </p>
              </div>
            )}
          </div>

          <div className="bg-white/40 backdrop-blur-lg border border-white/20 rounded-3xl shadow-lg p-6 animate-fadeInUp animation-delay-500 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {t('article.keywords')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {article.keywords?.split(',').map((keyword, i) => (
                <span key={i} className="bg-white/50 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-sm border border-white/20">
                  {keyword.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Files - Glass Card */}
          <div className="bg-white/40 backdrop-blur-lg border border-white/20 rounded-3xl shadow-lg p-6 animate-fadeInUp animation-delay-600 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Files
            </h3>
            <div className="space-y-3">
              {article.pdf_file && (
                <div className="flex items-center justify-between p-3 bg-white/30 backdrop-blur-sm rounded-2xl border border-white/20">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">
                      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-700">PDF File</p>
                      <p className="text-xs text-gray-500">{article.pdf_file.split('/').pop()}</p>
                    </div>
                  </div>
                  <a
                    href={getFileUrl(article.pdf_file)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Download
                  </a>
                </div>
              )}
              {article.doc_file && (
                <div className="flex items-center justify-between p-3 bg-white/30 backdrop-blur-sm rounded-2xl border border-white/20">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">
                      <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-700">DOC File</p>
                      <p className="text-xs text-gray-500">{article.doc_file.split('/').pop()}</p>
                    </div>
                  </div>
                  <a
                    href={getFileUrl(article.doc_file)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Download
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Article Info - Glass Card */}
        <div className="space-y-6">
          <div className="bg-white/40 backdrop-blur-lg border border-white/20 rounded-3xl shadow-lg p-6 animate-fadeInUp animation-delay-300 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Article Information
            </h3>
            <dl className="space-y-3">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <dt className="text-sm font-medium text-gray-500">Authors</dt>
                <dd className="text-sm text-gray-700 text-right">{article.authors}</dd>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <dt className="text-sm font-medium text-gray-500">Corresponding Author</dt>
                <dd className="text-sm text-gray-700 text-right">{article.corresponding_author}</dd>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="text-sm text-gray-700 text-right">
                  <a href={`mailto:${article.email}`} className="text-primary-600 hover:text-primary-700">
                    {article.email}
                  </a>
                </dd>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <dt className="text-sm font-medium text-gray-500">Institution</dt>
                <dd className="text-sm text-gray-700 text-right">{article.institution}</dd>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <dt className="text-sm font-medium text-gray-500">Country</dt>
                <dd className="text-sm text-gray-700 text-right">{article.country}</dd>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <dt className="text-sm font-medium text-gray-500">Domain</dt>
                <dd className="text-sm text-gray-700 text-right">Domain {article.domain}</dd>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <dt className="text-sm font-medium text-gray-500">Subject Area</dt>
                <dd className="text-sm text-gray-700 text-right">{article.subject_area}</dd>
              </div>
            </dl>
          </div>

          {/* Quick Actions - Glass Card */}
          <div className="bg-white/40 backdrop-blur-lg border border-white/20 rounded-3xl shadow-lg p-6 animate-fadeInUp animation-delay-700 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => window.print()}
                className="w-full px-4 py-3 bg-white/30 backdrop-blur-sm text-gray-700 rounded-xl hover:bg-white/50 transition-colors duration-200 text-sm font-medium flex items-center gap-2 border border-white/20"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Details
              </button>
              <button
                onClick={() => {
                  const url = window.location.href;
                  navigator.clipboard.writeText(url);
                  alert('Link copied to clipboard!');
                }}
                className="w-full px-4 py-3 bg-white/30 backdrop-blur-sm text-gray-700 rounded-xl hover:bg-white/50 transition-colors duration-200 text-sm font-medium flex items-center gap-2 border border-white/20"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2H9a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetails;