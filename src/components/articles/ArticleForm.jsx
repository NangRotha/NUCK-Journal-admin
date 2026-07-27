import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import Loading from '../common/Loading';

const ArticleForm = ({ article: propArticle, onSave }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [article, setArticle] = useState(propArticle || null);
  const [formData, setFormData] = useState({
    title: propArticle?.title || '',
    title_khmer: propArticle?.title_khmer || '',
    abstract: propArticle?.abstract || '',
    abstract_khmer: propArticle?.abstract_khmer || '',
    keywords: propArticle?.keywords || '',
    authors: propArticle?.authors || '',
    corresponding_author: propArticle?.corresponding_author || '',
    email: propArticle?.email || '',
    institution: propArticle?.institution || '',
    country: propArticle?.country || '',
    domain: propArticle?.domain || 'A',
    subject_area: propArticle?.subject_area || '',
    status: propArticle?.status || 'submitted',
    volume: propArticle?.volume || '',
    issue: propArticle?.issue || '',
    pages: propArticle?.pages || '',
    doi: propArticle?.doi || '',
    pdf_file: null,
    doc_file: null,
    cover_letter: null,
  });

  useEffect(() => {
    if (id && !propArticle) {
      fetchArticle();
    } else if (propArticle) {
      setArticle(propArticle);
    }
  }, [id, propArticle]);

  const fetchArticle = async () => {
    setFetching(true);
    try {
      const response = await axiosInstance.get(`/articles/${id}`);
      const data = response.data;
      setArticle(data);
      setFormData({
        title: data.title || '',
        title_khmer: data.title_khmer || '',
        abstract: data.abstract || '',
        abstract_khmer: data.abstract_khmer || '',
        keywords: data.keywords || '',
        authors: data.authors || '',
        corresponding_author: data.corresponding_author || '',
        email: data.email || '',
        institution: data.institution || '',
        country: data.country || '',
        domain: data.domain || 'A',
        subject_area: data.subject_area || '',
        status: data.status || 'submitted',
        volume: data.volume || '',
        issue: data.issue || '',
        pages: data.pages || '',
        doi: data.doi || '',
        pdf_file: null,
        doc_file: null,
        cover_letter: null,
      });
    } catch (error) {
      console.error('Error fetching article:', error);
      alert('Failed to load article');
      navigate('/admin/articles');
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
      if (article?.id) {
        const updateData = {};
        Object.keys(formData).forEach((key) => {
          if (!['pdf_file', 'doc_file', 'cover_letter'].includes(key) && formData[key] !== null && formData[key] !== '') {
            updateData[key] = formData[key];
          }
        });
        await axiosInstance.put(`/articles/${article.id}`, updateData);
      } else {
        const formDataObj = new FormData();
        Object.keys(formData).forEach((key) => {
          if (formData[key] !== null && formData[key] !== '' && key !== 'pdf_file' && key !== 'doc_file' && key !== 'cover_letter') {
            formDataObj.append(key, formData[key]);
          }
        });
        if (formData.pdf_file) formDataObj.append('pdf_file', formData.pdf_file);
        if (formData.doc_file) formDataObj.append('doc_file', formData.doc_file);
        if (formData.cover_letter) formDataObj.append('cover_letter', formData.cover_letter);
        await axiosInstance.post('/articles/', formDataObj);
      }
      
      if (onSave) onSave();
      navigate('/admin/articles');
    } catch (error) {
      console.error('Error saving article:', error);
      let errorMsg = 'Error saving article';
      if (error.response?.data?.detail) {
        if (Array.isArray(error.response.data.detail)) {
          errorMsg = error.response.data.detail.map(err => `${err.loc?.join('.') || 'field'}: ${err.msg}`).join('\n');
        } else {
          errorMsg = error.response.data.detail;
        }
      }
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <Loading fullScreen message="Loading article data..." />;
  }

  return (
    <div className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-3xl shadow-lg p-6 max-w-4xl mx-auto animate-fadeInUp">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 tracking-tight">
        {article?.id ? 'Edit Article' : 'Create New Article'}
      </h2>
      <div className="w-12 h-1 bg-gradient-to-r from-primary-400 to-primary-200 rounded-full mb-6"></div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="form-label">{t('article.title')} *</label>
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
            <label className="form-label">{t('article.titleKhmer')}</label>
            <input
              type="text"
              name="title_khmer"
              value={formData.title_khmer}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200"
            />
          </div>

          <div className="md:col-span-2">
            <label className="form-label">{t('article.abstract')} *</label>
            <textarea
              name="abstract"
              value={formData.abstract}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200"
            />
          </div>

          <div className="md:col-span-2">
            <label className="form-label">{t('article.abstractKhmer')}</label>
            <textarea
              name="abstract_khmer"
              value={formData.abstract_khmer}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200"
            />
          </div>

          <div>
            <label className="form-label">{t('article.keywords')} *</label>
            <input
              type="text"
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              required
              placeholder="Separate with commas"
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200"
            />
          </div>

          <div>
            <label className="form-label">{t('article.authors')} *</label>
            <input
              type="text"
              name="authors"
              value={formData.authors}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200"
            />
          </div>

          <div>
            <label className="form-label">{t('article.correspondingAuthor')} *</label>
            <input
              type="text"
              name="corresponding_author"
              value={formData.corresponding_author}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200"
            />
          </div>

          <div>
            <label className="form-label">{t('common.email')} *</label>
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
            <label className="form-label">{t('article.institution')} *</label>
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
            <label className="form-label">{t('article.country')} *</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200"
            />
          </div>

          <div>
            <label className="form-label">{t('article.domain')} *</label>
            <select
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200"
            >
              <option value="A">Domain A</option>
              <option value="B">Domain B</option>
            </select>
          </div>

          <div>
            <label className="form-label">{t('article.subjectArea')} *</label>
            <input
              type="text"
              name="subject_area"
              value={formData.subject_area}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200"
            />
          </div>

          <div>
            <label className="form-label">{t('common.status')}</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200"
            >
              <option value="submitted">{t('article.submitted')}</option>
              <option value="under_review">{t('article.underReview')}</option>
              <option value="accepted">{t('article.accepted')}</option>
              <option value="published">{t('article.published')}</option>
              <option value="rejected">{t('article.rejected')}</option>
            </select>
          </div>

          <div>
            <label className="form-label">{t('article.volume')}</label>
            <input
              type="text"
              name="volume"
              value={formData.volume}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200"
            />
          </div>

          <div>
            <label className="form-label">{t('article.issue')}</label>
            <input
              type="text"
              name="issue"
              value={formData.issue}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200"
            />
          </div>

          <div>
            <label className="form-label">{t('article.pages')}</label>
            <input
              type="text"
              name="pages"
              value={formData.pages}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200"
            />
          </div>

          <div>
            <label className="form-label">{t('article.doi')}</label>
            <input
              type="text"
              name="doi"
              value={formData.doi}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200"
            />
          </div>

          {/* File Uploads */}
          <div className="md:col-span-2">
            <label className="form-label">{t('article.pdfFile')} *</label>
            <input
              type="file"
              name="pdf_file"
              onChange={handleFileChange}
              accept=".pdf"
              required={!article?.id}
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200"
            />
            {article?.pdf_file && (
              <p className="text-sm text-gray-500 mt-1">
                Current PDF: {article.pdf_file.split('/').pop()}
              </p>
            )}
          </div>

          <div>
            <label className="form-label">{t('article.docFile')}</label>
            <input
              type="file"
              name="doc_file"
              onChange={handleFileChange}
              accept=".doc,.docx"
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200"
            />
            {article?.doc_file && (
              <p className="text-sm text-gray-500 mt-1">
                Current DOC: {article.doc_file.split('/').pop()}
              </p>
            )}
          </div>

          <div>
            <label className="form-label">{t('article.coverLetter')}</label>
            <input
              type="file"
              name="cover_letter"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200"
            />
            {article?.cover_letter && (
              <p className="text-sm text-gray-500 mt-1">
                Current Cover Letter: {article.cover_letter.split('/').pop()}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-white/20">
          <button
            type="button"
            onClick={() => navigate('/admin/articles')}
            className="px-4 py-2 bg-white/30 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/50 transition-colors duration-200"
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            {loading ? 'Saving...' : article?.id ? t('common.update') : t('common.create')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleForm;