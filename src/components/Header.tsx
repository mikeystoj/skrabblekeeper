'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useGame } from '@/context/GameContext';
import { usePro } from '@/context/ProContext';
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
} from '@heroicons/react/24/outline';

// Install prompt modal for PWA
function InstallPrompt({ onClose }: { onClose: () => void }) {
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
          <h2 className="text-lg font-bold text-[#f5f0e8]">Add to Home Screen</h2>
        </div>

        <div className="px-5 py-4 space-y-3">
          <p className="text-sm text-[#1e3a5f]">
            Install Skrabble Keeper as an app for quick access!
          </p>

          {isIOS ? (
            <div className="text-sm text-[#1e3a5f] space-y-2">
              <p className="font-medium">On Safari:</p>
              <ol className="list-decimal ml-5 space-y-1">
                <li>Tap the <strong>Share</strong> button</li>
                <li>Scroll down and tap <strong>Add to Home Screen</strong></li>
                <li>Tap <strong>Add</strong></li>
              </ol>
            </div>
          ) : isAndroid ? (
            <div className="text-sm text-[#1e3a5f] space-y-2">
              <p className="font-medium">On Chrome:</p>
              <ol className="list-decimal ml-5 space-y-1">
                <li>Tap the <strong>menu</strong> button</li>
                <li>Tap <strong>Add to Home screen</strong></li>
                <li>Tap <strong>Add</strong></li>
              </ol>
            </div>
          ) : (
            <div className="text-sm text-[#1e3a5f] space-y-2">
              <p className="font-medium">On your browser:</p>
              <ol className="list-decimal ml-5 space-y-1">
                <li>Look for the install icon in the address bar</li>
                <li>Or use your browser&apos;s menu to &quot;Install app&quot;</li>
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
            Got it
          </button>
        </div>
      </div>
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
            Game History
          </button>
          <button
            onClick={() => { onSettings(); setIsOpen(false); }}
            className="w-full px-4 py-3 text-left text-sm text-[#1e3a5f] hover:bg-[#e8dfd2] 
              flex items-center gap-3 border-b border-[#e8dfd2]"
          >
            <Cog6ToothIcon className="w-5 h-5" />
            Settings
          </button>
          <button
            onClick={() => { onManageLicense(); setIsOpen(false); }}
            className="w-full px-4 py-3 text-left text-sm text-[#1e3a5f]/60 hover:bg-[#e8dfd2] 
              flex items-center gap-3"
          >
            <KeyIcon className="w-5 h-5" />
            Manage License
          </button>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const { state, dispatch } = useGame();
  const { isPro } = usePro();
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
              title="About this app"
            >
              <InformationCircleIcon className="w-5 h-5" />
            </button>

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
                Keeper Pro
              </button>
            )}

            {state.gameStarted && (
              <button
                onClick={() => setShowNewGameModal(true)}
                className="py-2 px-4 bg-[#1e3a5f] hover:bg-[#162d4d] 
                  text-[#f5f0e8] font-medium rounded-lg transition-colors text-sm"
              >
                New Game
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
              About
            </button>

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
                  Game History
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
                  Pro Settings
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
                  Manage License
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
                Keeper Pro
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
                Add as App
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
                New Game
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
