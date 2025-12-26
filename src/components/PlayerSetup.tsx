'use client';

import { useState, useRef } from 'react';
import { useGame } from '@/context/GameContext';
import { usePro } from '@/context/ProContext';
import { useLanguage } from '@/context/LanguageContext';
import { MAX_PLAYERS } from '@/lib/constants';
import {
  XMarkIcon,
  PlusIcon,
  Bars2Icon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { ProModal } from './ProModal';

export function PlayerSetup() {
  const { state, dispatch } = useGame();
  const { isPro, settings, updateSettings } = usePro();
  const { t } = useLanguage();
  const [newPlayerName, setNewPlayerName] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [showProModal, setShowProModal] = useState(false);
  const dragNodeRef = useRef<HTMLDivElement | null>(null);

  const savedPlayers = settings.savedPlayers || [];
  const availableSavedPlayers = savedPlayers.filter(
    name => !state.players.some(p => p.name === name)
  );

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newPlayerName.trim();
    if (name && state.players.length < MAX_PLAYERS) {
      dispatch({ type: 'ADD_PLAYER', name });
      setNewPlayerName('');
      
      // Auto-save new player names to settings if Pro
      if (isPro && !savedPlayers.includes(name)) {
        updateSettings({
          savedPlayers: [...savedPlayers, name],
        });
      }
    }
  };

  const handleAddSavedPlayer = (name: string) => {
    if (state.players.length < MAX_PLAYERS) {
      dispatch({ type: 'ADD_PLAYER', name });
    }
  };

  const handleRemovePlayer = (playerId: string) => {
    dispatch({ type: 'REMOVE_PLAYER', playerId });
  };

  const handleStartGame = () => {
    if (state.players.length >= 1) {
      dispatch({ type: 'START_GAME' });
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    dragNodeRef.current = e.currentTarget;
    e.dataTransfer.effectAllowed = 'move';
    // Add a slight delay to allow the drag image to be captured
    setTimeout(() => {
      if (dragNodeRef.current) {
        dragNodeRef.current.style.opacity = '0.5';
      }
    }, 0);
  };

  const handleDragEnd = () => {
    if (dragNodeRef.current) {
      dragNodeRef.current.style.opacity = '1';
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
    dragNodeRef.current = null;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, toIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === toIndex) return;
    
    dispatch({ 
      type: 'REORDER_PLAYERS', 
      fromIndex: draggedIndex, 
      toIndex 
    });
    
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Mobile reorder handlers
  const handleMoveUp = (index: number) => {
    if (index > 0) {
      dispatch({ type: 'REORDER_PLAYERS', fromIndex: index, toIndex: index - 1 });
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < state.players.length - 1) {
      dispatch({ type: 'REORDER_PLAYERS', fromIndex: index, toIndex: index + 1 });
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4">
      <div className="bg-[#faf8f5] rounded-lg shadow-md p-5">
        <h2 className="text-xl font-bold text-[#1e3a5f] mb-4 text-center">
          {t.playerSetup.addPlayer}
        </h2>

        {/* Saved Players Quick Add (Pro only) */}
        {isPro && availableSavedPlayers.length > 0 && state.players.length < MAX_PLAYERS && (
          <div className="mb-4">
            <p className="text-xs text-[#1e3a5f]/60 mb-2">{t.playerSetup.savedPlayers}</p>
            <div className="flex flex-wrap gap-2">
              {availableSavedPlayers.map((name) => (
                <button
                  key={name}
                  onClick={() => handleAddSavedPlayer(name)}
                  className="px-3 py-1.5 bg-[#e8dfd2] hover:bg-[#d4c4a8] 
                    text-[#1e3a5f] text-sm font-medium rounded-lg transition-colors
                    flex items-center gap-1"
                >
                  <PlusIcon className="w-3 h-3" />
                  <span>{name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add Player Form */}
        <form onSubmit={handleAddPlayer} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder={t.playerSetup.enterName}
              maxLength={20}
              className="flex-1 px-3 py-2 border border-[#d4c4a8] rounded-md 
                focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]
                text-[#1e3a5f] placeholder-[#c4a882] bg-white"
            />
            <button
              type="submit"
              disabled={!newPlayerName.trim() || state.players.length >= MAX_PLAYERS}
              className="px-4 py-2 bg-[#1e3a5f] hover:bg-[#162d4d] disabled:opacity-40
                text-[#f5f0e8] font-medium rounded-md transition-colors disabled:cursor-not-allowed"
            >
              {t.common.add}
            </button>
          </div>
          <p className="text-xs text-[#1e3a5f] mt-2 opacity-70">
            {state.players.length}/{MAX_PLAYERS} {t.playerSetup.title.toLowerCase()}
          </p>
        </form>

        {/* Player List */}
        {state.players.length > 0 && (
          <div className="space-y-2 mb-4">
            <p className="text-xs text-[#1e3a5f]/60 mb-1">
              {t.playerSetup.turnOrder} {state.players.length > 1 && t.playerSetup.dragToReorder}:
            </p>
            {state.players.map((player, index) => (
              <div
                key={player.id}
                draggable={state.players.length > 1}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                className={`flex items-center justify-between p-2 rounded-md transition-all ${
                  index === 0 ? 'bg-[#1e3a5f]/10 ring-1 ring-[#1e3a5f]/30' : 'bg-[#e8dfd2]'
                } ${draggedIndex === index ? 'opacity-50' : ''} 
                  ${dragOverIndex === index ? 'ring-2 ring-[#1e3a5f] scale-[1.02]' : ''}
                  ${state.players.length > 1 ? 'cursor-grab active:cursor-grabbing' : ''}`}
              >
                <div className="flex items-center gap-2">
                  {/* Drag Handle */}
                  {state.players.length > 1 && (
                    <div className="text-[#1e3a5f]/40 hover:text-[#1e3a5f] touch-none">
                      <Bars2Icon className="w-4 h-4" />
                    </div>
                  )}
                  <span className={`w-6 h-6 flex items-center justify-center 
                    font-bold rounded-full text-xs ${
                      index === 0 
                        ? 'bg-[#1e3a5f] text-[#f5f0e8]' 
                        : 'bg-[#c4a882] text-[#1e3a5f]'
                    }`}>
                    {index + 1}
                  </span>
                  <span className="font-medium text-[#1e3a5f]">
                    {player.name}
                    {index === 0 && <span className="text-xs ml-2 text-[#1e3a5f]/60">{t.playerSetup.goesFirst}</span>}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {/* Mobile reorder buttons */}
                  {state.players.length > 1 && (
                    <div className="flex flex-col sm:hidden">
                      <button
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="p-0.5 text-[#1e3a5f]/60 hover:text-[#1e3a5f] disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleMoveDown(index)}
                        disabled={index === state.players.length - 1}
                        className="p-0.5 text-[#1e3a5f]/60 hover:text-[#1e3a5f] disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => handleRemovePlayer(player.id)}
                    className="p-1 text-[#1e3a5f] hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Start Game Button */}
        <button
          onClick={handleStartGame}
          disabled={state.players.length < 1}
          className="w-full py-3 bg-[#1e3a5f] hover:bg-[#162d4d] disabled:opacity-40
            text-[#f5f0e8] font-bold rounded-md transition-colors disabled:cursor-not-allowed"
        >
          {state.players.length < 1 
            ? t.playerSetup.minPlayers
            : t.playerSetup.startGame
          }
        </button>

        {/* Pro Promo Banner (only when not Pro) */}
        {!isPro && (
          <button
            onClick={() => setShowProModal(true)}
            className="w-full mt-3 py-3 px-4 bg-gradient-to-r from-[#1e3a5f] to-[#3d5a80] 
              hover:from-[#162d4d] hover:to-[#2d4a70]
              text-[#f5f0e8] rounded-lg transition-all text-left
              flex items-center gap-3 group"
          >
            <div className="w-8 h-8 rounded-full bg-[#c4a882]/20 flex items-center justify-center flex-shrink-0">
              <SparklesIcon className="w-4 h-4 text-[#c4a882]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{t.gameControls.proPromo}</p>
              <p className="text-xs text-[#f5f0e8]/70">{t.gameControls.proPromoSubtitle}</p>
            </div>
          </button>
        )}
      </div>

      {/* Pro Modal */}
      <ProModal isOpen={showProModal} onClose={() => setShowProModal(false)} />
    </div>
  );
}
