'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { NewGameModal } from './NewGameModal';
import { ProModal } from './ProModal';
import { InfoModal } from './InfoModal';

// Info icon component
function InfoIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className}
      width="18" 
      height="18" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

export function Header() {
  const { state, dispatch } = useGame();
  const [showNewGameModal, setShowNewGameModal] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const handleRestartSamePlayers = () => {
    dispatch({ type: 'NEW_GAME' });
    setShowNewGameModal(false);
  };

  const handleNewGameNewPlayers = () => {
    dispatch({ type: 'FULL_NEW_GAME' });
    setShowNewGameModal(false);
  };

  return (
    <>
      <header className="py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Image
            src="/SkrabbleKeeperLogo.svg"
            alt="Skrabble Keeper"
            width={280}
            height={130}
            priority
            className="h-12 sm:h-16 w-auto"
          />
          
          <div className="flex items-center gap-2">
            {/* Info Button */}
            <button
              onClick={() => setShowInfoModal(true)}
              className="p-2 text-[#1e3a5f]/60 hover:text-[#1e3a5f] 
                hover:bg-[#e8dfd2] rounded-lg transition-all"
              title="About this app"
            >
              <InfoIcon />
            </button>

            {/* Pro Button */}
            <button
              onClick={() => setShowProModal(true)}
              className="py-2 px-3 bg-[#c4a882] 
                text-[#1e3a5f] font-bold 
                rounded-lg transition-all text-sm hover:shadow-lg 
                transform hover:-translate-y-0.5 flex items-center gap-1"
            >
              <span>Keeper Pro</span>
            </button>

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
        </div>
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
    </>
  );
}
