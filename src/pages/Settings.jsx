import React from 'react';
import { useTranslation } from 'react-i18next';
import SettingsForm from '../components/settings/SettingsForm';

const Settings = () => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            {t('settings.title')}
          </h1>
          <div className="w-12 h-1 bg-gradient-to-r from-primary-400 to-primary-200 rounded-full mt-1"></div>
        </div>
      </div>

      <div className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-3xl shadow-lg p-6 max-w-4xl animate-fadeInUp hover:shadow-xl transition-all duration-300">
        <SettingsForm />
      </div>
    </div>
  );
};

export default Settings;