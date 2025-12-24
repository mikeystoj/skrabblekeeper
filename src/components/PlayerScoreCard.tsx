'use client';

import { useState } from 'react';
import { Player } from '@/lib/types';
import { useGame } from '@/context/GameContext';

interface PlayerScoreCardProps {
  player: Player;
  isCurrentPlayer: boolean;
  rank: number;
}

// Edit icon component
function EditIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      width="14" 
      height="14" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}

export function PlayerScoreCard({ player, isCurrentPlayer, rank }: PlayerScoreCardProps) {
  const { dispatch } = useGame();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(player.name);

  const handleSaveEdit = () => {
    if (editName.trim() && editName !== player.name) {
      dispatch({ type: 'UPDATE_PLAYER_NAME', playerId: player.id, name: editName.trim() });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditName(player.name);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div 
      className={`
        rounded-lg p-3 transition-all
        ${isCurrentPlayer 
          ? 'bg-[#d4c4a8] ring-2 ring-[#1e3a5f]' 
          : 'bg-[#faf8f5]'
        }
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`
            w-6 h-6 flex items-center justify-center rounded-full font-bold text-xs
            ${rank === 1 ? 'bg-[#1e3a5f] text-[#f5f0e8]' : 'bg-[#e8dfd2] text-[#1e3a5f]'}
          `}>
            {rank}
          </span>
          <div className="flex items-center gap-1">
            {isEditing ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="font-bold text-[#1e3a5f] bg-white border border-[#d4c4a8] rounded px-2 py-1 w-28 text-sm"
                autoFocus
              />
            ) : (
              <>
                <h3 className="font-bold text-[#1e3a5f]">{player.name}</h3>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 hover:bg-[#e8dfd2] rounded transition-colors text-[#1e3a5f] opacity-60 hover:opacity-100"
                  title="Edit player"
                >
                  <EditIcon />
                </button>
              </>
            )}
          </div>
          {isCurrentPlayer && !isEditing && (
            <span className="text-xs text-[#1e3a5f] opacity-70 bg-[#e8dfd2] px-2 py-0.5 rounded-full">Current</span>
          )}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-[#1e3a5f]">{player.score}</div>
        </div>
      </div>

      {/* Edit Controls */}
      {isEditing && (
        <div className="flex gap-2 mb-2">
          <button
            onClick={handleSaveEdit}
            className="flex-1 py-1 px-2 bg-[#1e3a5f] text-[#f5f0e8] font-medium rounded text-sm"
          >
            Save
          </button>
          <button
            onClick={handleCancelEdit}
            className="flex-1 py-1 px-2 bg-[#e8dfd2] text-[#1e3a5f] font-medium rounded text-sm"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Word History */}
      <div className="border-t border-[#d4c4a8] pt-2">
        <h4 className="text-xs font-medium text-[#1e3a5f] opacity-70 mb-2">
          Words ({player.words.length})
        </h4>
        {player.words.length === 0 ? (
          <p className="text-xs text-[#1e3a5f] opacity-50 italic">No words yet</p>
        ) : (
          <div className="max-h-40 overflow-y-auto">
            {/* 4 columns on desktop, 2 on tablet, stacked on mobile */}
            <div className="grid grid-cols-1 gap-1">
              {player.words.slice().reverse().map((word) => (
                <div 
                  key={word.id}
                  className="flex justify-between items-center text-xs py-1 px-2 bg-[#e8dfd2] rounded"
                >
                  <span className="font-medium text-[#1e3a5f] truncate mr-1">{word.word}</span>
                  <span className="text-[#1e3a5f] font-bold flex-shrink-0">+{word.score}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
