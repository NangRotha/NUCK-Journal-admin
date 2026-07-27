import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import axiosInstance, { getFileUrl } from '../api/axiosConfig';
import Loading from '../components/common/Loading';

const Editors = () => {
  const { t } = useTranslation();
  const [editors, setEditors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchEditors();
  }, []);

  const fetchEditors = async () => {
    try {
      const response = await axiosInstance.get('/editors/');
      setEditors(response.data.editors || []);
    } catch (error) {
      console.error('Error fetching editors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this editor?')) return;

    try {
      await axiosInstance.delete(`/editors/${id}`);
      fetchEditors();
    } catch (error) {
      console.error('Error deleting editor:', error);
    }
  };

  // Filter editors
  const filteredEditors = editors.filter(editor => {
    const matchesSearch = editor.name?.toLowerCase().includes(search.toLowerCase()) ||
                         editor.email?.toLowerCase().includes(search.toLowerCase()) ||
                         editor.institution?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || editor.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return <Loading fullScreen message="Loading editors..." />;
  }

  const getRoleLabel = (role) => {
    const labels = {
      editor_in_chief: 'Editor-in-Chief',
      national_editor: 'National Editor',
      international_editor: 'International Editor',
      managing_editor: 'Managing Editor',
      subject_editor: 'Subject-matter Editor',
    };
    return labels[role] || role;
  };

  const getRoleColor = (role) => {
    const colors = {
      editor_in_chief: 'bg-purple-100/80 text-purple-800 backdrop-blur-sm',
      national_editor: 'bg-blue-100/80 text-blue-800 backdrop-blur-sm',
      international_editor: 'bg-green-100/80 text-green-800 backdrop-blur-sm',
      managing_editor: 'bg-yellow-100/80 text-yellow-800 backdrop-blur-sm',
      subject_editor: 'bg-pink-100/80 text-pink-800 backdrop-blur-sm',
    };
    return colors[role] || 'bg-gray-100/80 text-gray-800 backdrop-blur-sm';
  };

  return (
    <div>
      {/* Title Section with Decorative Line */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            {t('admin.editors')}
          </h1>
          <div className="w-12 h-1 bg-gradient-to-r from-primary-400 to-primary-200 rounded-full mt-1"></div>
        </div>
        <Link
          to="/admin/editors/create"
          className="btn-primary rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          + {t('editor.create')}
        </Link>
      </div>

      {/* Filters - Glass Card */}
      <div className="bg-white/40 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg p-4 mb-6 hover:shadow-xl transition-all duration-300">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder={t('common.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200 placeholder-gray-400"
            />
          </div>
          <div className="w-48">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200"
            >
              <option value="all">All Roles</option>
              <option value="editor_in_chief">Editor-in-Chief</option>
              <option value="national_editor">National Editor</option>
              <option value="international_editor">International Editor</option>
              <option value="managing_editor">Managing Editor</option>
              <option value="subject_editor">Subject-matter Editor</option>
            </select>
          </div>
          <div className="text-sm text-gray-600 flex items-center px-3 py-1 bg-white/30 backdrop-blur-sm rounded-full">
            {filteredEditors.length} editors found
          </div>
        </div>
      </div>

      {/* Editors List - Glass Table */}
      {filteredEditors.length === 0 ? (
        <div className="text-center py-16 bg-white/30 backdrop-blur-lg border border-white/20 rounded-3xl shadow-lg">
          <div className="text-6xl mb-4">
            <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg">No editors found</p>
        </div>
      ) : (
        <div className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/50 backdrop-blur-sm border-b border-white/20">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Photo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Editor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Institution
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredEditors.map((editor, index) => (
                  <tr 
                    key={editor.id} 
                    className="group hover:bg-white/20 hover:scale-[1.002] transition-all duration-300 animate-fadeInUp cursor-default"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4">
                      {editor.photo ? (
                        <img 
                          src={getFileUrl(editor.photo)} 
                          alt={editor.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-white/20 shadow-sm group-hover:scale-105 transition-transform duration-200"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-10 h-10 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-500 text-xs font-bold border border-white/20">
                          ?
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="ml-0">
                          <div className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                            {editor.name}
                          </div>
                          <div className="text-xs text-gray-500 group-hover:text-primary-500 transition-colors duration-200">
                            {editor.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(editor.role)}`}>
                        {getRoleLabel(editor.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {editor.institution}, {editor.country}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <Link 
                        to={`/admin/editors/edit/${editor.id}`} 
                        className="text-green-600 hover:text-green-800 font-medium text-sm transition-colors duration-200 hover:underline inline-flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(editor.id)} 
                        className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors duration-200 hover:underline inline-flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editors;