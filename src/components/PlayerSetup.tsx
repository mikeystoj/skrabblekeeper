'use client';

import { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { usePro } from '@/context/ProContext';
import { MAX_PLAYERS } from '@/lib/constants';
import {
  XMarkIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

export function PlayerSetup() {
  const { state, dispatch } = useGame();
  const { isPro, settings, updateSettings } = usePro();
  const [newPlayerName, setNewPlayerName] = useState('');

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

  return (
    <div className="max-w-sm mx-auto p-4">
      <div className="bg-[#faf8f5] rounded-lg shadow-md p-5">
        <h2 className="text-xl font-bold text-[#1e3a5f] mb-4 text-center">
          Add Players
        </h2>

        {/* Saved Players Quick Add (Pro only) */}
        {isPro && availableSavedPlayers.length > 0 && state.players.length < MAX_PLAYERS && (
          <div className="mb-4">
            <p className="text-xs text-[#1e3a5f]/60 mb-2">Quick add saved players:</p>
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
              placeholder="Player name..."
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
              Add
            </button>
          </div>
          <p className="text-xs text-[#1e3a5f] mt-2 opacity-70">
            {state.players.length}/{MAX_PLAYERS} players
            {isPro && <span className="ml-2">• New names auto-saved</span>}
          </p>
        </form>

        {/* Player List */}
        {state.players.length > 0 && (
          <div className="space-y-2 mb-4">
            {state.players.map((player, index) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-2 bg-[#e8dfd2] rounded-md"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 flex items-center justify-center 
                    bg-[#1e3a5f] text-[#f5f0e8] font-bold rounded-full text-xs">
                    {index + 1}
                  </span>
                  <span className="font-medium text-[#1e3a5f]">{player.name}</span>
                </div>
                <button
                  onClick={() => handleRemovePlayer(player.id)}
                  className="p-1 text-[#1e3a5f] hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
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
            ? 'Add at least 1 player' 
            : `Start Game`
          }
        </button>
      </div>
    </div>
  );
}
