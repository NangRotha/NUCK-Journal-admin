import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';

const ArticleList = ({ articles, onDelete, onStatusChange, onInviteReviewer, onAssignVolumeIssue }) => {
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

  const handleViewPDF = async (articleId, pdfUrl) => {
    try {
      await axiosInstance.post(`/articles/${articleId}/track?action=view`);
      window.open(pdfUrl, '_blank');
    } catch (error) {
      console.error('Error tracking view:', error);
      window.open(pdfUrl, '_blank');
    }
  };

  const handleDownloadPDF = async (articleId, downloadUrl, filename) => {
    try {
      await axiosInstance.post(`/articles/${articleId}/track?action=download`);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'article.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error tracking download:', error);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'article.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
                  <div className="flex flex-wrap items-center gap-4 mt-2 pt-2 border-t border-gray-100/50">
                    <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                      <svg className="w-3.5 h-3.5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>Views: {article.views || 0}+</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                      <svg className="w-3.5 h-3.5 text-[#6c5ce7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>Downloads: {article.downloads || 0}+</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                      <svg className="w-3.5 h-3.5 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      <span>Citations: {article.citations || 0}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {(article.authors || '').split(',').slice(0, 3).join(', ')}
                    {(article.authors || '').split(',').length > 3 && ' et al.'}
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
                <td className="px-6 py-4 text-right space-x-2">
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
                  
                  {/* 🟢 បន្ថែមប៊ូតុង Assign Volume/Issue (សម្រាប់ Accepted និង Published) */}
                  {(article.status === 'accepted' || article.status === 'published') && (
                    <button
                      onClick={() => onAssignVolumeIssue(article)}
                      className="text-orange-600 hover:text-orange-800 font-medium text-sm transition-colors duration-200 hover:underline"
                    >
                      Assign Vol/Issue
                    </button>
                  )}

                  {/* Invite Reviewer Button - Only for submitted/under_review */}
                  {(article.status === 'submitted' || article.status === 'under_review') && (
                    <button
                      onClick={() => onInviteReviewer(article)}
                      className="text-purple-600 hover:text-purple-800 font-medium text-sm transition-colors duration-200 hover:underline"
                    >
                      Invite Reviewer
                    </button>
                  )}
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