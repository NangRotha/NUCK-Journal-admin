import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#eef2ff] via-[#f5f3ff] to-[#ede9fe] p-6">
      {/* Glassmorphism Container */}
      <div className="relative w-full max-w-lg bg-white/40 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl p-8 md:p-12 text-center animate-fadeInUp">
        {/* 404 Number */}
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-primary-500/20 blur-3xl rounded-full"></div>
          <h1 className="relative text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400 drop-shadow-lg">
            404
          </h1>
        </div>

        {/* SVG Icon */}
        <div className="flex justify-center mb-6 animate-pulse-slow">
          <div className="w-20 h-20 bg-primary-100/50 backdrop-blur-sm rounded-2xl flex items-center justify-center text-primary-600 border border-primary-200/30">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-4 animate-fadeInUp animation-delay-200">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            {t('notFound.title')}
          </h1>
          <p className="text-gray-600 max-w-sm mx-auto leading-relaxed">
            {t('notFound.description')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-fadeInUp animation-delay-400">
          <Link
            to="/"
            className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <svg className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {t('notFound.goHome')} {/* ✅ ប្តូរទៅជា notFound.goHome */}
          </Link>
          <button
            onClick={() => window.history.back()}
            className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-sm border border-white/40 text-gray-700 rounded-full hover:bg-white/80 hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('notFound.goBack')}
          </button>
        </div>

        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-300/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-300/10 rounded-full blur-2xl pointer-events-none"></div>
      </div>
    </div>
  );
};

export default NotFound;