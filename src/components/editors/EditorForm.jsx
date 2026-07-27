import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance, { getFileUrl } from '../../api/axiosConfig';
import Loading from '../common/Loading';

const EditorForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [existingPhoto, setExistingPhoto] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    role: 'national_editor',
    domain: '',
    email: '',
    institution: '',
    country: '',
    biography: '',
    expertise: '',
    responsibilities: '',
    photo: null,
  });

  useEffect(() => {
    if (id) {
      fetchEditor();
    }
  }, [id]);

  const fetchEditor = async () => {
    try {
      const response = await axiosInstance.get(`/editors/${id}`);
      const data = response.data;
      setFormData({
        name: data.name || '',
        title: data.title || '',
        role: data.role || 'national_editor',
        domain: data.domain || '',
        email: data.email || '',
        institution: data.institution || '',
        country: data.country || '',
        biography: data.biography || '',
        expertise: data.expertise || '',
        responsibilities: data.responsibilities || '',
        photo: null,
      });
      setExistingPhoto(data.photo || '');
    } catch (error) {
      console.error('Error fetching editor:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataObj = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== '' && key !== 'photo') {
          formDataObj.append(key, formData[key]);
        }
      });
      if (formData.photo) {
        formDataObj.append('photo', formData.photo);
      }

      if (id) {
        await axiosInstance.put(`/editors/${id}`, formDataObj, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axiosInstance.post('/editors', formDataObj, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      
      navigate('/admin/editors');
    } catch (error) {
      console.error('Error saving editor:', error);
      let errorMessage = 'Error saving editor. Please check your inputs.';
      if (error.response?.data?.detail) {
        if (Array.isArray(error.response.data.detail)) {
          errorMessage = error.response.data.detail.map(err => err.msg).join(', ');
        } else {
          errorMessage = error.response.data.detail;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      alert('Error saving editor: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <Loading fullScreen message="Loading editor data..." />;
  }

  return (
    <div className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-3xl shadow-lg p-6 max-w-4xl mx-auto animate-fadeInUp">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 tracking-tight">
        {id ? 'Edit Editor' : 'Create New Editor'}
      </h2>
      <div className="w-12 h-1 bg-gradient-to-r from-primary-400 to-primary-200 rounded-full mb-6"></div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
            <select 
              name="role" 
              value={formData.role} 
              onChange={handleChange} 
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200"
            >
              <option value="editor_in_chief">Editor-in-Chief</option>
              <option value="national_editor">National Editor</option>
              <option value="international_editor">International Editor</option>
              <option value="managing_editor">Managing Editor</option>
              <option value="subject_editor">Subject-matter Editor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
            <input 
              type="text" 
              name="domain" 
              value={formData.domain} 
              onChange={handleChange} 
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Institution *</label>
            <input 
              type="text" 
              name="institution" 
              value={formData.institution} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
            <input 
              type="text" 
              name="country" 
              value={formData.country} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200" 
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
            <div className="flex items-center space-x-4 mb-2">
              {existingPhoto && (
                <img 
                  src={getFileUrl(existingPhoto)} 
                  alt="Editor Preview" 
                  className="w-20 h-20 object-cover rounded-full border-2 border-white/20 shadow-sm" 
                />
              )}
              <div className="flex-1">
                <input
                  type="file"
                  name="photo"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {existingPhoto ? 'Leave empty to keep current photo.' : 'Upload a photo (Optional)'}
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Biography</label>
            <textarea 
              name="biography" 
              value={formData.biography} 
              onChange={handleChange} 
              rows="4" 
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200" 
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Expertise</label>
            <textarea 
              name="expertise" 
              value={formData.expertise} 
              onChange={handleChange} 
              rows="3" 
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200" 
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities</label>
            <textarea 
              name="responsibilities" 
              value={formData.responsibilities} 
              onChange={handleChange} 
              rows="3" 
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200" 
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-white/20">
          <button 
            type="button" 
            onClick={() => navigate('/admin/editors')} 
            className="px-4 py-2 bg-white/30 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading} 
            className="btn-primary rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            {loading ? 'Saving...' : (id ? 'Update' : 'Create')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditorForm;