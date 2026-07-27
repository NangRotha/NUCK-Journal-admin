import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../api/axiosConfig';
import Loading from '../components/common/Loading';

const ContactMessages = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axiosInstance.get('/contact-messages');
      console.log('🟢 Raw Backend Response:', response.data);
      
      const messagesData = Array.isArray(response.data) ? response.data : [];
      setMessages(messagesData);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axiosInstance.put(`/contact-messages/${id}`, { is_read: true });
      fetchMessages();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await axiosInstance.delete(`/contact-messages/${id}`);
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'unread') return !msg.is_read;
    return true;
  });

  if (loading) {
    return <Loading fullScreen message="Loading messages..." />;
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
      {/* Title Section with Decorative Line */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Contact Messages</h1>
          <div className="w-12 h-1 bg-gradient-to-r from-primary-400 to-primary-200 rounded-full mt-1"></div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200"
          >
            <option value="all">All Messages</option>
            <option value="unread">Unread Only</option>
          </select>
        </div>
      </div>

      {filteredMessages.length === 0 ? (
        <div className="text-center py-16 bg-white/30 backdrop-blur-lg border border-white/20 rounded-3xl shadow-lg">
          <div className="text-6xl mb-4">
            <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg">No messages found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((msg, index) => (
            <div 
              key={msg.id} 
              className={`group bg-white/30 backdrop-blur-lg border border-white/20 rounded-3xl shadow-lg p-6 hover:shadow-3xl hover:scale-[1.005] transition-all duration-300 animate-fadeInUp ${msg.is_read ? 'border-gray-300/50' : 'border-primary-500/50'}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary-600 transition-colors duration-200">
                      {msg.subject}
                    </h3>
                    {!msg.is_read && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-white bg-red-500/80 backdrop-blur-sm rounded-full animate-pulse shadow-sm">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">From:</span> {msg.name} ({msg.email})
                  </p>
                  <p className="text-gray-700 leading-relaxed group-hover:text-primary-700 transition-colors duration-200">
                    {msg.message}
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{new Date(msg.created_at).toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col gap-2 md:items-end">
                  {!msg.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(msg.id)}
                      className="text-primary-600 hover:text-primary-800 text-sm font-medium transition-colors duration-200 hover:underline inline-flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors duration-200 hover:underline inline-flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactMessages;