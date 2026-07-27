import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import DashboardStats from '../components/dashboard/DashboardStats';
import RecentActivity from '../components/dashboard/RecentActivity';
import Loading from '../components/common/Loading';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const Dashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [statusData, setStatusData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [articlesRes, editorsRes, issuesRes] = await Promise.all([
        axiosInstance.get('/articles/').catch(() => ({ data: { articles: [] } })),
        axiosInstance.get('/editors/').catch(() => ({ data: { editors: [] } })),
        axiosInstance.get('/issues/').catch(() => ({ data: { issues: [] } })),
      ]);

      const articles = articlesRes.data.articles || [];
      const editors = editorsRes.data.editors || [];
      const issues = issuesRes.data.issues || [];

      setStats({
        totalArticles: articles.length,
        totalEditors: editors.length,
        totalIssues: issues.length,
        pendingReviews: articles.filter(a => a.status === 'under_review').length,
      });

      const domainCounts = { A: 0, B: 0 };
      articles.forEach(article => {
        if (article.domain === 'A') domainCounts.A++;
        else if (article.domain === 'B') domainCounts.B++;
      });
      setChartData([
        { name: 'Domain A', value: domainCounts.A },
        { name: 'Domain B', value: domainCounts.B },
      ]);

      const statusCounts = {};
      articles.forEach(article => {
        const status = article.status || 'unknown';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });
      setStatusData(
        Object.keys(statusCounts).map(key => ({
          name: key.replace('_', ' '),
          value: statusCounts[key],
        }))
      );

      const recent = [
        ...articles.slice(0, 5).map(a => ({ ...a, type: 'article' })),
        ...editors.slice(0, 3).map(e => ({ ...e, type: 'editor' })),
      ].sort((a, b) => new Date(b.created_at || b.submitted_date) - new Date(a.created_at || a.submitted_date));

      setActivities(recent);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981'];

  if (loading) {
    return <Loading fullScreen message="Loading dashboard..." />;
  }

  return (
    <div className="relative space-y-8">
      
      {/* ✅ Decorative Background Shapes with Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%233b82f6%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>

      {/* ✅ Welcome Card with Glass UI */}
      <div className="relative z-10 bg-gradient-to-r from-primary-600/80 via-primary-500/80 to-primary-400/80 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-white shadow-2xl animate-fadeInUp overflow-hidden">
        <div className="absolute top-[-50%] right-[-20%] w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-[-50%] left-[-20%] w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            {t('admin.welcome') || 'Welcome back!'}
          </h2>
          <p className="text-primary-100/90 text-sm md:text-base max-w-xl">
            Here's what's happening with your journal today. Manage your content and track performance from one place.
          </p>
        </div>
      </div>

      {/* ✅ Dashboard Stats */}
      <div className="relative z-10 animate-fadeInUp animation-delay-200">
        <DashboardStats stats={stats} />
      </div>
      
      {/* ✅ Recent Activity & Quick Actions */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeInUp animation-delay-400">
        <RecentActivity activities={activities} />
        
        {/* Quick Actions Glass Card */}
        <div className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-6 hover:shadow-3xl hover:scale-[1.01] transition-all duration-300">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/admin/articles/create"
              className="group block w-full px-4 py-3 bg-white/40 backdrop-blur-sm text-primary-700 rounded-xl hover:bg-white/60 hover:shadow-md hover:scale-105 transition-all duration-200 text-left font-medium border border-white/20"
            >
              <span className="flex items-center gap-3 group-hover:translate-x-1 transition-transform duration-200">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Article
              </span>
            </Link>
            <Link
              to="/admin/editors/create"
              className="group block w-full px-4 py-3 bg-white/40 backdrop-blur-sm text-green-700 rounded-xl hover:bg-white/60 hover:shadow-md hover:scale-105 transition-all duration-200 text-left font-medium border border-white/20"
            >
              <span className="flex items-center gap-3 group-hover:translate-x-1 transition-transform duration-200">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Add New Editor
              </span>
            </Link>
            <Link
              to="/admin/announcements/create"
              className="group block w-full px-4 py-3 bg-white/40 backdrop-blur-sm text-purple-700 rounded-xl hover:bg-white/60 hover:shadow-md hover:scale-105 transition-all duration-200 text-left font-medium border border-white/20"
            >
              <span className="flex items-center gap-3 group-hover:translate-x-1 transition-transform duration-200">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.068-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                Create Announcement
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* ✅ Charts Section */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeInUp animation-delay-600">
        {/* Bar Chart - Domain Distribution */}
        <div className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-6 hover:shadow-3xl transition-all duration-300">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Articles by Domain</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb/50" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                    backdropFilter: 'blur(8px)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="url(#barGradient)" 
                  radius={[8, 8, 0, 0]}
                  animationDuration={1500}
                >
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                  </defs>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Status Distribution */}
        <div className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-6 hover:shadow-3xl transition-all duration-300">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Articles by Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                    backdropFilter: 'blur(8px)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend 
                  wrapperStyle={{
                    paddingTop: '10px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;