'use client';

import { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { MAX_PLAYERS } from '@/lib/constants';

export function PlayerSetup() {
  const { state, dispatch } = useGame();
  const [newPlayerName, setNewPlayerName] = useState('');

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newPlayerName.trim();
    if (name && state.players.length < MAX_PLAYERS) {
      dispatch({ type: 'ADD_PLAYER', name });
      setNewPlayerName('');
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
                  className="text-[#1e3a5f] hover:text-[#0f1f36] text-lg leading-none px-2"
                >
                  ×
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
