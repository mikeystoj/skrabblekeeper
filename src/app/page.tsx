'use client';

import { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { Header } from '@/components/Header';
import { Board } from '@/components/Board';
import { ScoreView } from '@/components/ScoreView';
import { PlayerSetup } from '@/components/PlayerSetup';
import { GameControls } from '@/components/GameControls';
import { Footer } from '@/components/Footer';
import { ViewMode } from '@/lib/types';

export default function Home() {
  const { state, isLoaded } = useGame();
  const [viewMode, setViewMode] = useState<ViewMode>('board');

  // Show loading state while hydrating from localStorage
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-[#1e3a5f] border-t-transparent 
            rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-[#1e3a5f]">Loading...</p>
        </div>
      </div>
    );
  }

  // Show player setup if game hasn't started
  if (!state.gameStarted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="py-6 flex-1">
          <PlayerSetup />
        </main>
        <Footer />
      </div>
    );
  }

  // Main game view
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="py-4 px-3 flex-1">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_280px] gap-4">
            {/* Main Content Area */}
            <div>
              {viewMode === 'board' ? <Board /> : <ScoreView />}
            </div>

            {/* Sidebar Controls */}
            <div>
              <GameControls 
                viewMode={viewMode} 
                onViewModeChange={setViewMode} 
              />
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
