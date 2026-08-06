import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';
import Loading from '../components/common/Loading';

const ReviewInvitations = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/articles/review-invitations/');
      setInvitations(response.data || []);
    } catch (error) {
      console.error('Error fetching invitations:', error);
      setError('Failed to load invitations');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      declined: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <Loading message="Loading invitations..." fullScreen />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-fadeInUp">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Review Invitations</h1>
          <p className="text-gray-600 mt-1">
            {invitations.length} invitation{invitations.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      {/* Invitations Table */}
      <div className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/50 backdrop-blur-sm border-b border-white/20">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Article</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Reviewer</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Invited</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Responded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {invitations.map((invitation, index) => (
                <tr 
                  key={invitation.id} 
                  className="group hover:bg-white/20 hover:scale-[1.002] transition-all duration-300 animate-fadeInUp cursor-default"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                      {invitation.article_title || `Article #${invitation.article_id}`}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {invitation.reviewer_name || invitation.reviewer_email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invitation.status)}`}>
                      {invitation.status?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {invitation.invited_at ? new Date(invitation.invited_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {invitation.responded_at ? new Date(invitation.responded_at).toLocaleDateString() : 'Not Responded'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReviewInvitations;