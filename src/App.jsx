import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminHeader from './components/common/AdminHeader';
import AdminSidebar from './components/common/AdminSidebar';
import axiosInstance from './api/axiosConfig';
import NotFound from './components/common/NotFound';

// --- Pages ---
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Articles from './pages/Articles';
import Editors from './pages/Editors';
import Policies from './pages/Policies';
import Announcements from './pages/Announcements';
import Issues from './pages/Issues';
import Settings from './pages/Settings';
import HeroSlides from './pages/HeroSlides';
import ContactMessages from './pages/ContactMessages';

// 🟢 New User & Review Management Pages
import Users from './pages/Users';
import Reviews from './pages/Reviews';
import ReviewInvitations from './pages/ReviewInvitations';
import ReviewerDashboard from './pages/ReviewerDashboard';
import AuthorDashboard from './pages/AuthorDashboard';

// --- Detail & Form Components ---
import ArticleDetails from './components/articles/ArticleDetails';
import ArticleForm from './components/articles/ArticleForm';
import EditorForm from './components/editors/EditorForm';
import PolicyForm from './components/policies/PolicyForm';
import IssueForm from './components/issues/IssueForm';
import AnnouncementForm from './components/announcements/AnnouncementForm';
import HeroSlideForm from './components/hero/HeroSlideForm';
import ReviewDetails from './pages/ReviewDetails';
import UserDetails from './pages/UserDetails';

// 🟢 New User Form Component
import UserForm from './components/users/UserForm';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  const routerFuture = {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  };

  // 🟢 ទាញយក Logo ពី Backend ហើយកំណត់ជា Favicon + Update Title
  useEffect(() => {
    const fetchFavicon = async () => {
      try {
        const response = await axiosInstance.get('/settings/');
        const settingsData = {};
        response.data.forEach(setting => {
          settingsData[setting.key] = setting.value;
        });

        const baseURL = import.meta.env.VITE_API_URL || 'https://nuck-journal-backend.vercel.app';

        if (settingsData.logo_url) {
          const faviconUrl = `${baseURL}${settingsData.logo_url}`;
          let link = document.querySelector("link[rel~='icon']");
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
          }
          link.href = faviconUrl;
          console.log('✅ Admin Favicon updated to:', faviconUrl);
        }

        if (settingsData.journal_name) {
          document.title = `NUCK Admin - ${settingsData.journal_name}`;
        } else {
          document.title = "NUCK Admin - National University of Cheasim Kamchaymear";
        }

      } catch (error) {
        console.error('❌ Error fetching admin favicon from backend:', error);
      }
    };

    fetchFavicon();
  }, []);

  return (
    <LanguageProvider>
      <AuthProvider>
        <Router future={routerFuture}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />

            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              </ProtectedRoute>
            } />

            {/* 🟢 Articles Routes */}
            <Route path="/admin/articles" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Articles />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/articles/create" element={
              <ProtectedRoute>
                <AdminLayout>
                  <ArticleForm />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/articles/edit/:id" element={
              <ProtectedRoute>
                <AdminLayout>
                  <ArticleForm />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/articles/:id" element={
              <ProtectedRoute>
                <AdminLayout>
                  <ArticleDetails />
                </AdminLayout>
              </ProtectedRoute>
            } />

            {/* 🟢 Editors Routes */}
            <Route path="/admin/editors" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Editors />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/editors/create" element={
              <ProtectedRoute>
                <AdminLayout>
                  <EditorForm />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/editors/edit/:id" element={
              <ProtectedRoute>
                <AdminLayout>
                  <EditorForm />
                </AdminLayout>
              </ProtectedRoute>
            } />

            {/* 🟢 Policies Routes */}
            <Route path="/admin/policies" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Policies />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/policies/create" element={
              <ProtectedRoute>
                <AdminLayout>
                  <PolicyForm />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/policies/edit/:id" element={
              <ProtectedRoute>
                <AdminLayout>
                  <PolicyForm />
                </AdminLayout>
              </ProtectedRoute>
            } />

            {/* 🟢 Announcements Routes */}
            <Route path="/admin/announcements" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Announcements />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/announcements/create" element={
              <ProtectedRoute>
                <AdminLayout>
                  <AnnouncementForm />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/announcements/edit/:id" element={
              <ProtectedRoute>
                <AdminLayout>
                  <AnnouncementForm />
                </AdminLayout>
              </ProtectedRoute>
            } />

            {/* 🟢 Issues Routes */}
            <Route path="/admin/issues" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Issues />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/issues/create" element={
              <ProtectedRoute>
                <AdminLayout>
                  <IssueForm />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/issues/edit/:id" element={
              <ProtectedRoute>
                <AdminLayout>
                  <IssueForm />
                </AdminLayout>
              </ProtectedRoute>
            } />

            {/* 🟢 Settings Routes */}
            <Route path="/admin/settings" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Settings />
                </AdminLayout>
              </ProtectedRoute>
            } />

            {/* 🟢 Hero Slides Routes */}
            <Route path="/admin/hero-slides" element={
              <ProtectedRoute>
                <AdminLayout>
                  <HeroSlides />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/hero-slides/create" element={
              <ProtectedRoute>
                <AdminLayout>
                  <HeroSlideForm />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/hero-slides/edit/:id" element={
              <ProtectedRoute>
                <AdminLayout>
                  <HeroSlideForm />
                </AdminLayout>
              </ProtectedRoute>
            } />

            {/* 🟢 Contact Messages Routes */}
            <Route path="/admin/contact-messages" element={
              <ProtectedRoute>
                <AdminLayout>
                  <ContactMessages />
                </AdminLayout>
              </ProtectedRoute>
            } />

            {/* ========================================== */}
            {/* 🟢 NEW FEATURES: USER & REVIEW MANAGEMENT */}
            {/* ========================================== */}

            {/* 🟢 Users Routes */}
            <Route path="/admin/users" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Users />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/users/:id" element={
              <ProtectedRoute>
                <AdminLayout>
                  <UserDetails />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/users/create" element={
              <ProtectedRoute>
                <AdminLayout>
                  <UserForm />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/users/edit/:id" element={
              <ProtectedRoute>
                <AdminLayout>
                  <UserForm />
                </AdminLayout>
              </ProtectedRoute>
            } />

            {/* 🟢 Reviews Routes */}
            <Route path="/admin/reviews" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Reviews />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/reviews/:id" element={
              <ProtectedRoute>
                <AdminLayout>
                  <ReviewDetails />
                </AdminLayout>
              </ProtectedRoute>
            } />

            {/* 🟢 Review Invitations Routes */}
            <Route path="/admin/review-invitations" element={
              <ProtectedRoute>
                <AdminLayout>
                  <ReviewInvitations />
                </AdminLayout>
              </ProtectedRoute>
            } />

            {/* 🟢 Reviewer Dashboard (Admin can view reviewer's work) */}
            <Route path="/admin/reviewer/:id" element={
              <ProtectedRoute>
                <AdminLayout>
                  <ReviewerDashboard />
                </AdminLayout>
              </ProtectedRoute>
            } />

            {/* 🟢 Author Dashboard (Admin can view author's work) */}
            <Route path="/admin/author/:id" element={
              <ProtectedRoute>
                <AdminLayout>
                  <AuthorDashboard />
                </AdminLayout>
              </ProtectedRoute>
            } />

            {/* ✅ 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;