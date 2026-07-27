import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axiosInstance, { getFileUrl } from '../../api/axiosConfig';

const SettingsForm = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    journal_name: '',
    journal_abbreviation: '',
    publisher: '',
    issn: '',
    logo_url: '',
    contact_email: '',
    contact_phone: '',
    address: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axiosInstance.get('/settings/');
      const settingsData = {};
      response.data.forEach(setting => {
        settingsData[setting.key] = setting.value;
      });
      setSettings(prev => ({ ...prev, ...settingsData }));
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const promises = Object.entries(settings).map(([key, value]) =>
        axiosInstance.put(`/settings/${key}`, { key, value })
      );
      await Promise.all(promises);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings: ' + (error.response?.data?.detail || error.message));
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axiosInstance.post('/upload/', formData);
      setSettings(prev => ({ ...prev, logo_url: response.data.url }));
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Error uploading logo');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent"></div>
        <span className="ml-3 text-gray-600">Loading settings...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('settings.journalName')}
          </label>
          <input
            type="text"
            name="journal_name"
            value={settings.journal_name}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200 placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('settings.journalAbbreviation')}
          </label>
          <input
            type="text"
            name="journal_abbreviation"
            value={settings.journal_abbreviation}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200 placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('settings.publisher')}
          </label>
          <input
            type="text"
            name="publisher"
            value={settings.publisher}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200 placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('settings.issn')}
          </label>
          <input
            type="text"
            name="issn"
            value={settings.issn}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200 placeholder-gray-400"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('settings.logo')}
          </label>
          <div className="flex items-center space-x-4">
            {settings.logo_url && (
              <img 
                src={getFileUrl(settings.logo_url)}
                alt="Logo"
                className="w-20 h-20 object-contain rounded-xl border-2 border-white/20 shadow-sm bg-gray-50/50 p-2"
              />
            )}
            <div className="flex-1">
              <input
                type="text"
                name="logo_url"
                value={settings.logo_url}
                onChange={handleChange}
                placeholder="Logo URL"
                className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200 placeholder-gray-400 mb-2"
              />
              <div className="text-sm text-gray-500">
                Or upload a new logo:
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('settings.contactEmail')}
          </label>
          <input
            type="email"
            name="contact_email"
            value={settings.contact_email}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200 placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('settings.contactPhone')}
          </label>
          <input
            type="text"
            name="contact_phone"
            value={settings.contact_phone}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200 placeholder-gray-400"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('settings.address')}
          </label>
          <textarea
            name="address"
            value={settings.address}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow duration-200 placeholder-gray-400"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-white/20">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-white/30 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/50 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="btn-primary rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
};

export default SettingsForm;