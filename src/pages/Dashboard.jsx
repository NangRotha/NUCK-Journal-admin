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
    <div className="relative space-y-8 animate-fadeInUp">
      {/* ✅ Welcome Card */}
      <div className="relative z-10 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm animate-fadeInUp animation-delay-100">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          {t('admin.welcome') || 'Welcome back!'}
        </h2>
        <p className="text-gray-600 text-sm md:text-base max-w-xl">
          Here's what's happening with your journal today. Manage your content and track performance from one place.
        </p>
      </div>

      {/* ✅ Dashboard Stats */}
      <div className="relative z-10 animate-fadeInUp animation-delay-200">
        <DashboardStats stats={stats} />
      </div>
      
      {/* ✅ Recent Activity & Quick Actions */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeInUp animation-delay-400">
        <RecentActivity activities={activities} />
        
        {/* Quick Actions - កែតម្រូវដោយយក href ចេញទាំងស្រុង */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all duration-300">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/admin/articles/create"
              className="group block w-full px-4 py-3 bg-gray-50 text-blue-700 rounded-xl hover:bg-blue-50 hover:shadow-sm transition-all duration-200 text-left font-medium border border-gray-100"
            >
              <span className="flex items-center gap-3 group-hover:translate-x-1 transition-transform duration-200">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Article
              </span>
            </Link>
            <Link
              to="/admin/editors/create"
              className="group block w-full px-4 py-3 bg-gray-50 text-green-700 rounded-xl hover:bg-green-50 hover:shadow-sm transition-all duration-200 text-left font-medium border border-gray-100"
            >
              <span className="flex items-center gap-3 group-hover:translate-x-1 transition-transform duration-200">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Add New Editor
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* ✅ Charts Section */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeInUp animation-delay-600">
        {/* Bar Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all duration-300">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Articles by Domain</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
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

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all duration-300">
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
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
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