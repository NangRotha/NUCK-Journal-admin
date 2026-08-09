import React from 'react';

const DashboardStats = ({ stats }) => {
  const statItems = [
    { 
      label: 'Total Articles', 
      value: stats?.totalArticles || 0, 
      subText: 'Articles',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      iconBg: 'bg-blue-100 text-blue-600'
    },
    { 
      label: 'Total Editors', 
      value: stats?.totalEditors || 0, 
      subText: 'Editors',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      ),
      iconBg: 'bg-green-100 text-green-600'
    },
    { 
      label: 'Total Issues', 
      value: stats?.totalIssues || 0, 
      subText: 'Issues',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      iconBg: 'bg-purple-100 text-purple-600'
    },
    { 
      label: 'Pending Reviews', 
      value: stats?.pendingReviews || 0, 
      subText: 'Reviews',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      iconBg: 'bg-yellow-100 text-yellow-600'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item, index) => (
        <div 
          key={index} 
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">{item.label}</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{item.value}</p>
              <p className="text-xs text-gray-400 mt-1">{item.subText}</p>
            </div>
            <div className={`${item.iconBg} w-12 h-12 rounded-xl flex items-center justify-center shadow-sm`}>
              {item.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;