import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const AnnouncementList = ({ announcements, onDelete }) => {
  const { t } = useTranslation();

  const getStatus = (announcement) => {
    if (announcement.is_important) return 'important';
    if (announcement.expires_at && new Date(announcement.expires_at) < new Date()) return 'expired';
    return 'active';
  };

  const getStatusColor = (status) => {
    const colors = {
      important: 'bg-red-100/80 text-red-800 backdrop-blur-sm',
      active: 'bg-green-100/80 text-green-800 backdrop-blur-sm',
      expired: 'bg-gray-100/80 text-gray-800 backdrop-blur-sm',
    };
    return colors[status] || 'bg-gray-100/80 text-gray-800 backdrop-blur-sm';
  };

  const getStatusLabel = (status) => {
    const labels = {
      important: '🔥 Important',
      active: '✓ Active',
      expired: '✕ Expired',
    };
    return labels[status] || status;
  };

  if (!announcements || announcements.length === 0) {
    return (
      <div className="text-center py-16 bg-white/30 backdrop-blur-lg border border-white/20 rounded-3xl shadow-lg">
        <div className="text-6xl mb-4">
          <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.068-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        </div>
        <p className="text-gray-500 text-lg">No announcements found</p>
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
                {t('announcement.title')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                {t('common.date')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                {t('common.status')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Expires
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                {t('common.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {announcements.map((announcement, index) => {
              const status = getStatus(announcement);
              return (
                <tr 
                  key={announcement.id} 
                  className="group hover:bg-white/20 hover:scale-[1.002] transition-all duration-300 animate-fadeInUp cursor-default"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                      {announcement.title}
                    </div>
                    <div className="text-xs text-gray-500 group-hover:text-primary-500 transition-colors duration-200">
                      {announcement.content?.substring(0, 100)}
                      {announcement.content?.length > 100 && '...'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(announcement.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                      {getStatusLabel(status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {announcement.expires_at 
                      ? new Date(announcement.expires_at).toLocaleDateString()
                      : 'Never'
                    }
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link
                      to={`/admin/announcements/edit/${announcement.id}`}
                      className="text-green-600 hover:text-green-800 font-medium text-sm transition-colors duration-200 hover:underline inline-flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      {t('common.edit')}
                    </Link>
                    <button 
                      onClick={() => onDelete(announcement.id)} 
                      className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors duration-200 hover:underline inline-flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      {t('common.delete')}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnnouncementList;