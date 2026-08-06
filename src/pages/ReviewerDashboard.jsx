import React from 'react';

const ReviewerDashboard = () => {
  return (
    <div className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-3xl shadow-lg p-6 max-w-4xl mx-auto animate-fadeInUp">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Reviewer Dashboard</h2>
      <p className="text-gray-600">
        This page allows the admin to view and manage reviewer activities and their review submissions.
      </p>
      {/* You can add more features here later */}
    </div>
  );
};

export default ReviewerDashboard;