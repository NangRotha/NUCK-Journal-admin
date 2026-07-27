import React from 'react';
import { useTranslation } from 'react-i18next';

const RecentActivity = ({ activities }) => {
  const { t } = useTranslation();

  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-6 hover:shadow-3xl transition-all duration-300">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          {t('admin.recentActivity')}
        </h3>
        <p className="text-gray-500 text-center py-8">{t('admin.noActivity')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-6 hover:shadow-3xl transition-all duration-300">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        {t('admin.recentActivity')}
      </h3>
      <div className="space-y-4">
        {activities.slice(0, 5).map((activity, index) => (
          <div key={index} className="flex items-start space-x-3 pb-3 border-b border-white/20 last:border-0 last:pb-0">
            <div className="w-8 h-8 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-primary-600">
              {activity.type === 'article' ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              ) : activity.type === 'editor' ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.068-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-800 font-medium">{activity.title}</p>
              <p className="text-xs text-gray-500">
                {new Date(activity.created_at || activity.submitted_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;