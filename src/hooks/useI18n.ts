
import { useState, useEffect } from 'react';
import { translations } from './i18n';

export const useI18n = () => {
  const [language, setLanguage] = useState('en');

  const t = (key: string, params: Record<string, string | number> = {}) => {
    let translation = translations[language][key] || key;
    Object.keys(params).forEach(param => {
      translation = translation.replace(`{${param}}`, String(params[param]));
    });
    return translation;
  };

  return { t, setLanguage, language };
};
