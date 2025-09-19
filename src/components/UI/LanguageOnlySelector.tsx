import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { toast } from 'react-toastify';

export const LanguageOnlySelector: React.FC = () => {
  const { t, language, setLanguage } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'pt-BR', name: t('portuguese'), flag: '🇧🇷' },
    { code: 'en', name: t('english'), flag: '🇺🇸' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode as 'pt-BR' | 'en');
    setIsOpen(false);
    
    // Mostrar toast e recarregar página
    toast.success(t('languageChanged') || 'Idioma alterado com sucesso!');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
        title={t('language')}
      >
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <Globe className="w-4 h-4 text-blue-600" />
        </div>
        <div className="text-left">
          <p className="text-sm font-medium text-gray-900">{currentLanguage?.name}</p>
          <p className="text-xs text-gray-500">{currentLanguage?.flag}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
                  language === lang.code ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400' : ''
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
                {language === lang.code && (
                  <div className="ml-auto w-2 h-2 bg-violet-600 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
