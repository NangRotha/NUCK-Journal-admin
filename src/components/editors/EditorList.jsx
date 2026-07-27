import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const EditorList = ({ editors, onDelete }) => {
  const { t } = useTranslation();

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

  if (!editors || editors.length === 0) {
    return (
      <div className="text-center py-16 bg-white/30 backdrop-blur-lg border border-white/20 rounded-3xl shadow-lg">
        <div className="text-6xl mb-4">
          <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
        <p className="text-gray-500 text-lg">No editors found</p>
      </div>
    );
  }

  return (
    <div className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/50 backdrop-blur-sm border-b border-white/20">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Editor</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{t('editor.role')}</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{t('editor.institution')}</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{t('common.email')}</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {editors.map((editor, index) => (
              <tr 
                key={editor.id} 
                className="group hover:bg-white/20 hover:scale-[1.002] transition-all duration-300 animate-fadeInUp cursor-default"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary-500/20">
                      {editor.name?.charAt(0) || '?'}
                    </div>
                    <div className="ml-4">
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
                <td className="px-6 py-4 text-sm text-gray-500">
                  <a href={`mailto:${editor.email}`} className="text-primary-600 hover:text-primary-700 transition-colors duration-200">
                    {editor.email}
                  </a>
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <Link
                    to={`/admin/editors/edit/${editor.id}`}
                    className="text-green-600 hover:text-green-800 font-medium text-sm transition-colors duration-200 hover:underline inline-flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {t('common.edit')}
                  </Link>
                  <button 
                    onClick={() => onDelete(editor.id)} 
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

export default EditorList;