'use client';

import { useLanguage } from '@/context/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  // Pick a random phrase on each render (client-side only)
  const randomPhrase = t.footer.funnyPhrases[Math.floor(Math.random() * t.footer.funnyPhrases.length)];

  return (
    <footer className="py-6 px-4 mt-8">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-[#1e3a5f]/40 text-xs italic mb-2">
          {randomPhrase}
        </p>
        <p className="text-[#1e3a5f]/40 text-xs">
          {t.footer.madeBy}{' '}
          <span className="font-bold text-[#1e3a5f]/60 hover:text-[#1e3a5f] transition-colors cursor-pointer">
            Mayke
          </span>
          {' '}• © {new Date().getFullYear()} Skrabble Keeper •{' '}
          <a 
            href="https://x.com/skrabblekeeper" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-medium text-[#1e3a5f]/60 hover:text-[#1e3a5f] transition-colors"
          >
            @skrabblekeeper
          </a>
        </p>
      </div>
    </footer>
  );
}

