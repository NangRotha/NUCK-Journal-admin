import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const PolicyList = ({ policies, onDelete }) => {
  const { t } = useTranslation();

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

  const getCategoryColor = (category) => {
    const colors = {
      peer_review: 'bg-blue-100/80 text-blue-800 backdrop-blur-sm',
      ethics: 'bg-green-100/80 text-green-800 backdrop-blur-sm',
      open_access: 'bg-purple-100/80 text-purple-800 backdrop-blur-sm',
      copyright: 'bg-orange-100/80 text-orange-800 backdrop-blur-sm',
      misconduct: 'bg-red-100/80 text-red-800 backdrop-blur-sm',
      conflict: 'bg-yellow-100/80 text-yellow-800 backdrop-blur-sm',
      corrections: 'bg-indigo-100/80 text-indigo-800 backdrop-blur-sm',
      data_availability: 'bg-teal-100/80 text-teal-800 backdrop-blur-sm',
      complaints: 'bg-pink-100/80 text-pink-800 backdrop-blur-sm',
    };
    return colors[category] || 'bg-gray-100/80 text-gray-800 backdrop-blur-sm';
  };

  if (!policies || policies.length === 0) {
    return (
      <div className="text-center py-16 bg-white/30 backdrop-blur-lg border border-white/20 rounded-3xl shadow-lg">
        <div className="text-6xl mb-4">
          <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-gray-500 text-lg">No policies found</p>
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
                {t('policy.title')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                {t('policy.category')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                {t('policy.version')}
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
            {policies.map((policy, index) => (
              <tr 
                key={policy.id} 
                className="group hover:bg-white/20 hover:scale-[1.002] transition-all duration-300 animate-fadeInUp cursor-default"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                    {policy.title}
                  </div>
                  <div className="text-xs text-gray-500 group-hover:text-primary-500 transition-colors duration-200">
                    {policy.content?.substring(0, 100)}
                    {policy.content?.length > 100 && '...'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(policy.category)}`}>
                    {categoryLabels[policy.category] || policy.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {policy.version}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(policy.updated_at || policy.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <Link
                    to={`/admin/policies/edit/${policy.id}`}
                    className="text-green-600 hover:text-green-800 font-medium text-sm transition-colors duration-200 hover:underline inline-flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {t('common.edit')}
                  </Link>
                  <button 
                    onClick={() => onDelete(policy.id)} 
                    className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors duration-200 hover:underline inline-flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
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

export default PolicyList;