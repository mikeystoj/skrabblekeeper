import { Language, Translations, SUPPORTED_LANGUAGES } from './types';
import { en } from './en';
import { de } from './de';
import { fr } from './fr';
import { es } from './es';
import { it } from './it';

export { SUPPORTED_LANGUAGES };
export type { Language, Translations };

const translations: Record<Language, Translations> = {
  en,
  de,
  fr,
  es,
  it,
};

export function getTranslations(language: Language): Translations {
  return translations[language] || translations.en;
}

export function getLanguageConfig(code: Language) {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
}

// Helper to detect browser language
export function detectBrowserLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  
  const browserLang = navigator.language.split('-')[0].toLowerCase();
  const supportedCodes = SUPPORTED_LANGUAGES.map(l => l.code);
  
  if (supportedCodes.includes(browserLang as Language)) {
    return browserLang as Language;
  }
  
  return 'en';
}

