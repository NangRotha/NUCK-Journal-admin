import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../api/axiosConfig';
import Loading from '../components/common/Loading';

const UserDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/users/${id}`);
      setUser(response.data);
    } catch (err) {
      console.error('Error fetching user:', err);
      setError('Failed to load user details.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      editor: 'bg-purple-100 text-purple-800',
      reviewer: 'bg-blue-100 text-blue-800',
      author: 'bg-green-100 text-green-800',
      reader: 'bg-gray-100 text-gray-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <Loading fullScreen message="Loading user details..." />;
  }

  if (error || !user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error || 'User not found.'}
        </div>
        <Link to="/admin/users" className="text-primary-600 hover:underline mt-4 inline-block">
          Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/users" className="text-primary-600 hover:underline text-sm font-medium">
          &larr; Back to Users
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-4">
          <div className="flex-shrink-0 h-16 w-16 bg-gradient-to-r from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/20">
            {user.full_name?.charAt(0) || '?'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{user.full_name}</h1>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Role</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}>
                {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
              </span>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Status</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {user.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Institution</h3>
              <p className="text-gray-800">{user.institution || 'N/A'}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Country</h3>
              <p className="text-gray-800">{user.country || 'N/A'}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Email Verified</h3>
              <p className="text-gray-800">{user.is_verified ? 'Yes' : 'No'}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Joined</h3>
              <p className="text-gray-800">{new Date(user.created_at).toLocaleDateString()}</p>
            </div>

            {user.expertise_areas && (
              <div className="bg-gray-50 rounded-xl p-4 md:col-span-2">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Expertise Areas</h3>
                <p className="text-gray-800">{user.expertise_areas}</p>
              </div>
            )}

            {user.orcid && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">ORCID</h3>
                <a href={`https://orcid.org/${user.orcid}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                  {user.orcid}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;