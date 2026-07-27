import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import axiosInstance, { getFileUrl } from '../api/axiosConfig';
import Loading from '../components/common/Loading';

const HeroSlides = () => {
  const { t } = useTranslation();
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await axiosInstance.get('/hero-slides/?active_only=false');
      setSlides(response.data || []);
    } catch (error) {
      console.error('Error fetching hero slides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;

    try {
      await axiosInstance.delete(`/hero-slides/${id}`);
      fetchSlides();
    } catch (error) {
      console.error('Error deleting slide:', error);
    }
  };

  if (loading) {
    return <Loading fullScreen message="Loading hero slides..." />;
  }

  return (
    <div>
      {/* Title Section with Decorative Line */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            Hero Slides
          </h1>
          <div className="w-12 h-1 bg-gradient-to-r from-primary-400 to-primary-200 rounded-full mt-1"></div>
        </div>
        <Link
          to="/admin/hero-slides/create"
          className="btn-primary rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          + Create Slide
        </Link>
      </div>

      {/* Slides Grid */}
      {slides.length === 0 ? (
        <div className="text-center py-16 bg-white/30 backdrop-blur-lg border border-white/20 rounded-3xl shadow-lg">
          <div className="text-6xl mb-4">
            <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg">No slides found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slides.map((slide, index) => (
            <div 
              key={slide.id} 
              className="group bg-white/30 backdrop-blur-lg border border-white/20 rounded-3xl shadow-lg overflow-hidden hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 animate-fadeInUp"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="h-48 bg-gray-200/50 relative overflow-hidden">
                {slide.image_url ? (
                  <img 
                    src={getFileUrl(slide.image_url)} 
                    alt={slide.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100/50">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                {!slide.is_active && (
                  <div className="absolute top-4 right-4 bg-gray-600/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                    Inactive
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                  {slide.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {slide.description}
                </p>
                <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                    Order: {slide.order}
                  </span>
                  <div className="space-x-2">
                    <Link
                      to={`/admin/hero-slides/edit/${slide.id}`}
                      className="text-green-600 hover:text-green-800 text-sm font-medium transition-colors duration-200 hover:underline inline-flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(slide.id)}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSlides;