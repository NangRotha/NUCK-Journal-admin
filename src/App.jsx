import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminHeader from './components/common/AdminHeader';
import AdminSidebar from './components/common/AdminSidebar';
import axiosInstance from './api/axiosConfig';
import NotFound from './components/common/NotFound'; // ✅ នាំចូល NotFound

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

// --- Detail & Form Components ---
import ArticleDetails from './components/articles/ArticleDetails';
import ArticleForm from './components/articles/ArticleForm';
import EditorForm from './components/editors/EditorForm';
import PolicyForm from './components/policies/PolicyForm';
import IssueForm from './components/issues/IssueForm';
import AnnouncementForm from './components/announcements/AnnouncementForm';
import HeroSlideForm from './components/hero/HeroSlideForm';

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
  // React Router future flags
  const routerFuture = {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  };

  // 🟢 ទាញយក Logo ពី Backend ហើយកំណត់ជា Favicon + Update Title
  useEffect(() => {
    const fetchFavicon = async () => {
      try {
        const response = await axiosInstance.get('/settings');
        const settingsData = {};
        response.data.forEach(setting => {
          settingsData[setting.key] = setting.value;
        });

        // ✅ 1. ទាញយក Base URL ពី Environment Variable ដើម្បីសុវត្ថិភាព
        const baseURL = import.meta.env.VITE_API_URL || 'https://nuck-journal-backend.vercel.app';

        // ✅ 2. Update Title Icon (Favicon)
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

        // ✅ 3. Update Document Title
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
            <Route path="/login" element={<Login />} />

            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              </ProtectedRoute>
            } />

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

            <Route path="/admin/settings" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Settings />
                </AdminLayout>
              </ProtectedRoute>
            } />

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

            <Route path="/admin/contact-messages" element={
              <ProtectedRoute>
                <AdminLayout>
                  <ContactMessages />
                </AdminLayout>
              </ProtectedRoute>
            } />

            {/* ✅ 404 Route - ត្រូវតែនៅខាងចុងបំផុត */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;