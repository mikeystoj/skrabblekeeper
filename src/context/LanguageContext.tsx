'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, Translations, getTranslations, detectBrowserLanguage, SUPPORTED_LANGUAGES } from '@/lib/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  supportedLanguages: typeof SUPPORTED_LANGUAGES;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = 'skrabble-language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  // Load saved language or detect from browser
  useEffect(() => {
    const savedLanguage = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (savedLanguage && SUPPORTED_LANGUAGES.some(l => l.code === savedLanguage)) {
      setLanguageState(savedLanguage);
    } else {
      const detected = detectBrowserLanguage();
      setLanguageState(detected);
    }
  }, []);

  // Save language preference
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  };

  const t = getTranslations(language);

  // Render on the server too (in English) so crawlers get real HTML. The game UI
  // waits for GameContext's isLoaded, by which point the saved language is applied.
  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t,
      supportedLanguages: SUPPORTED_LANGUAGES,
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Hook for just translations (shorter alias)
export function useT() {
  const { t } = useLanguage();
  return t;
}

