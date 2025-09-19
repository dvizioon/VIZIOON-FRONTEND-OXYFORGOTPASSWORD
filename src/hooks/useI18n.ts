import { useState, useEffect } from 'react';
import { ptBR } from '../lang/pt-br';
import { en } from '../lang/en';

type Language = 'pt-BR' | 'en';
type Theme = 'light' | 'dark';

interface I18nContextType {
  t: (key: string) => string;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const translations = {
  'pt-BR': ptBR,
  'en': en
};

export const useI18n = (): I18nContextType => {
  const [language, setLanguageState] = useState<Language>('pt-BR');
  const [theme, setThemeState] = useState<Theme>('light');

  // Carregar preferências do localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('oxyforgotpassword-language') as Language;
    const savedTheme = localStorage.getItem('oxyforgotpassword-theme') as Theme;
    
    if (savedLanguage && ['pt-BR', 'en'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
    
    if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
      setThemeState(savedTheme);
    }
  }, []);

  // Aplicar tema no documento
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('oxyforgotpassword-language', lang);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('oxyforgotpassword-theme', newTheme);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Retorna a chave se não encontrar a tradução
      }
    }
    
    if (typeof value === 'string') {
      // Substituir {systemName} pelo nome dinâmico do sistema
      return value.replace('{systemName}', 'OxyForgotPassword');
    }
    
    return key;
  };

  return {
    t,
    language,
    setLanguage,
    theme,
    setTheme
  };
};
