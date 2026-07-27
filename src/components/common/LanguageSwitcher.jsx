import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const LanguageSwitcher = () => {
  const { language, changeLanguage } = useLanguage();

  return (
    <button
      onClick={() => changeLanguage(language === 'en' ? 'km' : 'en')}
      className="px-3 py-1.5 bg-white/50 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/80 transition-all duration-200 text-sm font-medium shadow-sm"
    >
      {language === 'en' ? '🇬🇧 EN' : '🇰🇭 ខ្មែរ'}
    </button>
  );
};

export default LanguageSwitcher;