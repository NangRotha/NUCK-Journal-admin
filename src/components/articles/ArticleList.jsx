import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const ArticleList = ({ articles, onDelete, onStatusChange }) => {
  const { t } = useTranslation();

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

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-16 bg-white/30 backdrop-blur-lg border border-white/20 rounded-3xl shadow-lg">
        <div className="text-6xl mb-4">
          <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-gray-500 text-lg">No articles found</p>
      </div>
    );
  }

  return (
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
            {articles.map((article, index) => (
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
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(article.status)}`}>
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
  );
};

export default ArticleList;