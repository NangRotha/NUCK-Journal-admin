import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import Loading from '../components/common/Loading';
import ArticleList from '../components/articles/ArticleList';

const Articles = () => {
  const { t } = useTranslation();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteDeadline, setInviteDeadline] = useState('');

  // 🟢 States សម្រាប់ Assign Volume/Issue Modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignData, setAssignData] = useState({ volume: '', issue: '', pages: '' });

  useEffect(() => {
    fetchArticles();
  }, [filterStatus]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      const response = await axiosInstance.get('/articles/', { params });
      setArticles(response.data.articles || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      await axiosInstance.delete(`/articles/${id}/`);
      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Failed to delete article');
    }
  };

  const handleInviteReviewer = async (e) => {
    e.preventDefault();
    if (!selectedArticle) return;
    
    try {
      const formData = new FormData();
      formData.append('reviewer_email', inviteEmail);
      formData.append('reviewer_name', inviteName);
      if (inviteDeadline) {
        formData.append('review_deadline', new Date(inviteDeadline).toISOString());
      }
      
      await axiosInstance.post(`/articles/${selectedArticle.id}/invite-reviewer/`, formData);
      
      setShowInviteModal(false);
      setSelectedArticle(null);
      setInviteEmail('');
      setInviteName('');
      setInviteDeadline('');
      alert('Reviewer invited successfully!');
    } catch (error) {
      console.error('Error inviting reviewer:', error);
      alert('Failed to invite reviewer');
    }
  };

  const handleStatusChange = async (articleId, newStatus) => {
    try {
      await axiosInstance.put(`/articles/${articleId}/`, { status: newStatus });
      fetchArticles();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  // 🟢 អនុគមន៍សម្រាប់ចាត់តាំង Volume/Issue/Pages
  const handleAssignVolumeIssue = async (e) => {
    e.preventDefault();
    if (!selectedArticle) return;

    try {
      const updateData = {
        volume: assignData.volume || null,
        issue: assignData.issue || null,
        pages: assignData.pages || null,
      };
      await axiosInstance.put(`/articles/${selectedArticle.id}/`, updateData);
      
      setShowAssignModal(false);
      setSelectedArticle(null);
      setAssignData({ volume: '', issue: '', pages: '' });
      alert('Volume, Issue, and Pages assigned successfully!');
      fetchArticles();
    } catch (error) {
      console.error('Error assigning volume/issue:', error);
      alert('Failed to assign volume/issue.');
    }
  };

  if (loading) {
    return <Loading fullScreen message="Loading articles..." />;
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
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            {t('admin.articles')}
          </h1>
          <p className="text-gray-600 mt-1">
            {articles.length} article{articles.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200"
          >
            <option value="">All Status</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="accepted">Accepted</option>
            <option value="published">Published</option>
            <option value="rejected">Rejected</option>
          </select>
          <Link
            to="/admin/articles/create"
            className="btn-primary rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            {t('article.create')}
          </Link>
        </div>
      </div>

      {/* Articles List */}
      <ArticleList 
        articles={articles} 
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        onInviteReviewer={(article) => {
          setSelectedArticle(article);
          setShowInviteModal(true);
        }}
        onAssignVolumeIssue={(article) => {
          setSelectedArticle(article);
          setAssignData({
            volume: article.volume || '',
            issue: article.issue || '',
            pages: article.pages || ''
          });
          setShowAssignModal(true);
        }}
      />

      {/* Invite Reviewer Modal (ដូចដើម) */}
      {showInviteModal && selectedArticle && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fadeInUp">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Invite Reviewer</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Invite a reviewer for: <span className="font-medium text-gray-800">{selectedArticle.title}</span>
            </p>
            <form onSubmit={handleInviteReviewer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reviewer Email *</label>
                <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="reviewer@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reviewer Name</label>
                <input type="text" value={inviteName} onChange={(e) => setInviteName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="Dr. John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Review Deadline</label>
                <input type="datetime-local" value={inviteDeadline} onChange={(e) => setInviteDeadline(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowInviteModal(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">Cancel</button>
                <button type="submit" className="btn-primary px-6 py-2 rounded-lg">Send Invitation</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🟢 NEW: Assign Volume/Issue Modal */}
      {showAssignModal && selectedArticle && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fadeInUp">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Assign Publication Details</h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Assign Volume, Issue, and Pages for: <span className="font-medium text-gray-800">{selectedArticle.title}</span>
            </p>
            <form onSubmit={handleAssignVolumeIssue} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Volume</label>
                <input 
                  type="text" 
                  value={assignData.volume} 
                  onChange={(e) => setAssignData({ ...assignData, volume: e.target.value })} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                  placeholder="e.g. 1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issue</label>
                <input 
                  type="text" 
                  value={assignData.issue} 
                  onChange={(e) => setAssignData({ ...assignData, issue: e.target.value })} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                  placeholder="e.g. 1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pages</label>
                <input 
                  type="text" 
                  value={assignData.pages} 
                  onChange={(e) => setAssignData({ ...assignData, pages: e.target.value })} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                  placeholder="e.g. 10-20"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAssignModal(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">Cancel</button>
                <button type="submit" className="btn-primary px-6 py-2 rounded-lg">Assign</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Articles;