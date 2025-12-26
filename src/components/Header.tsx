'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useGame } from '@/context/GameContext';
import { usePro } from '@/context/ProContext';
import { useLanguage } from '@/context/LanguageContext';
import { NewGameModal } from './NewGameModal';
import { ProModal } from './ProModal';
import { InfoModal } from './InfoModal';
import { ProSettings } from './ProSettings';
import { GameHistory } from './GameHistory';
import {
  InformationCircleIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  KeyIcon,
  DevicePhoneMobileIcon,
  ArrowPathIcon,
  StarIcon,
  LanguageIcon,
} from '@heroicons/react/24/outline';
import { Language } from '@/lib/i18n';

// Mobile Language Selector (inline in menu)
function MobileLanguageSelector({ onClose }: { onClose: () => void }) {
  const { language, setLanguage, supportedLanguages } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const currentLang = supportedLanguages.find(l => l.code === language);

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full px-4 py-3 text-left text-sm text-[#1e3a5f] hover:bg-[#e8dfd2] 
          flex items-center gap-3 border-b border-[#e8dfd2]"
      >
        <LanguageIcon className="w-5 h-5 opacity-60" />
        <span className="flex-1">{currentLang?.nativeName}</span>
        <span className="text-base">{currentLang?.flag}</span>
      </button>
    );
  }

  return (
    <div className="border-b border-[#e8dfd2] bg-[#e8dfd2]/30">
      {supportedLanguages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => { 
            setLanguage(lang.code as Language); 
            setIsExpanded(false);
          }}
          className={`w-full px-4 py-2.5 text-left text-sm hover:bg-[#e8dfd2] 
            flex items-center gap-3
            ${language === lang.code ? 'bg-[#e8dfd2] font-medium text-[#1e3a5f]' : 'text-[#1e3a5f]/80'}`}
        >
          <span className="text-base">{lang.flag}</span>
          {lang.nativeName}
        </button>
      ))}
    </div>
  );
}

// Install prompt modal for PWA
function InstallPrompt({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua));
    setIsAndroid(/Android/.test(ua));
  }, []);

  return (
    <div 
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#faf8f5] rounded-xl shadow-xl max-w-sm w-full overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-[#1e3a5f] px-5 py-4">
          <h2 className="text-lg font-bold text-[#f5f0e8]">{t.installPrompt.title}</h2>
        </div>

        <div className="px-5 py-4 space-y-3">
          <p className="text-sm text-[#1e3a5f]">
            {t.installPrompt.description}
          </p>

          {isIOS ? (
            <div className="text-sm text-[#1e3a5f] space-y-2">
              <p className="font-medium">{t.installPrompt.iosSafari}</p>
              <ol className="list-decimal ml-5 space-y-1">
                {t.installPrompt.iosSteps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          ) : isAndroid ? (
            <div className="text-sm text-[#1e3a5f] space-y-2">
              <p className="font-medium">{t.installPrompt.androidChrome}</p>
              <ol className="list-decimal ml-5 space-y-1">
                {t.installPrompt.androidSteps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          ) : (
            <div className="text-sm text-[#1e3a5f] space-y-2">
              <ol className="list-decimal ml-5 space-y-1">
                {t.installPrompt.browserSteps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <div className="px-5 pb-5">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-[#1e3a5f] hover:bg-[#162d4d] 
              text-[#f5f0e8] font-medium rounded-lg transition-colors"
          >
            {t.common.gotIt}
          </button>
        </div>
      </div>
    </div>
  );
}

// Language Dropdown
function LanguageDropdown() {
  const { language, setLanguage, supportedLanguages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = supportedLanguages.find(l => l.code === language);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 py-1.5 text-[#1e3a5f]/60 hover:text-[#1e3a5f] 
          hover:bg-[#e8dfd2] rounded-lg transition-all flex items-center gap-1"
        title="Language"
      >
        <span className="text-base">{currentLang?.flag}</span>
        <ChevronDownIcon className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-[#faf8f5] rounded-lg shadow-lg border border-[#e8dfd2] overflow-hidden z-50">
          {supportedLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { setLanguage(lang.code as Language); setIsOpen(false); }}
              className={`w-full px-4 py-2.5 text-left text-sm hover:bg-[#e8dfd2] 
                flex items-center gap-3 border-b border-[#e8dfd2] last:border-0
                ${language === lang.code ? 'bg-[#e8dfd2] font-medium text-[#1e3a5f]' : 'text-[#1e3a5f]/80'}`}
            >
              <span className="text-base">{lang.flag}</span>
              {lang.nativeName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Pro Dropdown Menu
function ProDropdown({ 
  onSettings, 
  onHistory,
  onManageLicense,
}: { 
  onSettings: () => void;
  onHistory: () => void;
  onManageLicense: () => void;
}) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="py-2 px-3 bg-[#1e3a5f] 
          text-[#f5f0e8] font-bold 
          rounded-lg transition-all text-sm hover:bg-[#162d4d]
          flex items-center gap-1"
      >
        <StarIcon className="w-4 h-4 text-[#c4a882]" />
        Pro
        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#faf8f5] rounded-lg shadow-lg border border-[#e8dfd2] overflow-hidden z-50">
          <button
            onClick={() => { onHistory(); setIsOpen(false); }}
            className="w-full px-4 py-3 text-left text-sm text-[#1e3a5f] hover:bg-[#e8dfd2] 
              flex items-center gap-3 border-b border-[#e8dfd2]"
          >
            <ChartBarIcon className="w-5 h-5" />
            {t.header.gameHistory}
          </button>
          <button
            onClick={() => { onSettings(); setIsOpen(false); }}
            className="w-full px-4 py-3 text-left text-sm text-[#1e3a5f] hover:bg-[#e8dfd2] 
              flex items-center gap-3 border-b border-[#e8dfd2]"
          >
            <Cog6ToothIcon className="w-5 h-5" />
            {t.proSettings.title}
          </button>
          <button
            onClick={() => { onManageLicense(); setIsOpen(false); }}
            className="w-full px-4 py-3 text-left text-sm text-[#1e3a5f]/60 hover:bg-[#e8dfd2] 
              flex items-center gap-3"
          >
            <KeyIcon className="w-5 h-5" />
            {t.header.manageLicense}
          </button>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const { state, dispatch } = useGame();
  const { isPro } = usePro();
  const { t } = useLanguage();
  const [showNewGameModal, setShowNewGameModal] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed as PWA
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIsStandalone(isInStandaloneMode);
  }, []);

  const handleRestartSamePlayers = () => {
    dispatch({ type: 'NEW_GAME' });
    setShowNewGameModal(false);
    setShowMobileMenu(false);
  };

  const handleNewGameNewPlayers = () => {
    dispatch({ type: 'FULL_NEW_GAME' });
    setShowNewGameModal(false);
    setShowMobileMenu(false);
  };

  return (
    <>
      <header className="py-3 px-4 sm:py-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Image
            src="/SkrabbleKeeperLogo.svg"
            alt="Skrabble Keeper"
            width={280}
            height={130}
            priority
            className="h-10 sm:h-16 w-auto"
          />
          
          {/* Desktop buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => setShowInfoModal(true)}
              className="p-2 text-[#1e3a5f]/60 hover:text-[#1e3a5f] 
                hover:bg-[#e8dfd2] rounded-lg transition-all"
              title={t.header.about}
            >
              <InformationCircleIcon className="w-5 h-5" />
            </button>

            <LanguageDropdown />

            {isPro ? (
              <ProDropdown 
                onSettings={() => setShowSettings(true)}
                onHistory={() => setShowHistory(true)}
                onManageLicense={() => setShowProModal(true)}
              />
            ) : (
              <button
                onClick={() => setShowProModal(true)}
                className="py-2 px-3 bg-[#c4a882] 
                  text-[#1e3a5f] font-bold 
                  rounded-lg transition-all text-sm hover:shadow-lg 
                  transform hover:-translate-y-0.5"
              >
                {t.header.keeperPro}
              </button>
            )}

            {state.gameStarted && (
              <button
                onClick={() => setShowNewGameModal(true)}
                className="py-2 px-4 bg-[#1e3a5f] hover:bg-[#162d4d] 
                  text-[#f5f0e8] font-medium rounded-lg transition-colors text-sm"
              >
                {t.header.newGame}
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="sm:hidden p-2 text-[#1e3a5f] hover:bg-[#e8dfd2] rounded-lg transition-all"
          >
            {showMobileMenu ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {showMobileMenu && (
          <div className="sm:hidden mt-3 bg-[#faf8f5] rounded-lg shadow-lg border border-[#e8dfd2] overflow-hidden">
            <button
              onClick={() => {
                setShowInfoModal(true);
                setShowMobileMenu(false);
              }}
              className="w-full px-4 py-3 text-left text-sm text-[#1e3a5f] hover:bg-[#e8dfd2] 
                flex items-center gap-3 border-b border-[#e8dfd2]"
            >
              <InformationCircleIcon className="w-5 h-5 opacity-60" />
              {t.header.about}
            </button>

            {/* Mobile Language Selector */}
            <MobileLanguageSelector onClose={() => setShowMobileMenu(false)} />

            {isPro ? (
              <>
                <button
                  onClick={() => {
                    setShowHistory(true);
                    setShowMobileMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-[#1e3a5f] hover:bg-[#e8dfd2] 
                    flex items-center gap-3 border-b border-[#e8dfd2]"
                >
                  <ChartBarIcon className="w-5 h-5" />
                  {t.header.gameHistory}
                </button>
                <button
                  onClick={() => {
                    setShowSettings(true);
                    setShowMobileMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-[#1e3a5f] hover:bg-[#e8dfd2] 
                    flex items-center gap-3 border-b border-[#e8dfd2]"
                >
                  <Cog6ToothIcon className="w-5 h-5" />
                  {t.header.proSettings}
                </button>
                <button
                  onClick={() => {
                    setShowProModal(true);
                    setShowMobileMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-[#1e3a5f]/60 hover:bg-[#e8dfd2] 
                    flex items-center gap-3 border-b border-[#e8dfd2]"
                >
                  <KeyIcon className="w-5 h-5" />
                  {t.header.manageLicense}
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setShowProModal(true);
                  setShowMobileMenu(false);
                }}
                className="w-full px-4 py-3 text-left text-sm text-[#1e3a5f] hover:bg-[#e8dfd2] 
                  flex items-center gap-3 border-b border-[#e8dfd2]"
              >
                <StarIcon className="w-5 h-5 text-[#c4a882]" />
                {t.header.keeperPro}
              </button>
            )}

            {!isStandalone && (
              <button
                onClick={() => {
                  setShowInstallPrompt(true);
                  setShowMobileMenu(false);
                }}
                className="w-full px-4 py-3 text-left text-sm text-[#1e3a5f] hover:bg-[#e8dfd2] 
                  flex items-center gap-3 border-b border-[#e8dfd2]"
              >
                <DevicePhoneMobileIcon className="w-5 h-5" />
                {t.header.addAsApp}
              </button>
            )}

            {state.gameStarted && (
              <button
                onClick={() => {
                  setShowNewGameModal(true);
                  setShowMobileMenu(false);
                }}
                className="w-full px-4 py-3 text-left text-sm font-medium text-[#1e3a5f] 
                  hover:bg-[#e8dfd2] flex items-center gap-3"
              >
                <ArrowPathIcon className="w-5 h-5" />
                {t.header.newGame}
              </button>
            )}
          </div>
        )}
      </header>

      <NewGameModal
        isOpen={showNewGameModal}
        onClose={() => setShowNewGameModal(false)}
        onRestartSamePlayers={handleRestartSamePlayers}
        onNewGameNewPlayers={handleNewGameNewPlayers}
      />

      <ProModal
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
      />

      <InfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
      />

      <ProSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      <GameHistory
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
      />

      {showInstallPrompt && (
        <InstallPrompt onClose={() => setShowInstallPrompt(false)} />
      )}
    </>
  );
}
