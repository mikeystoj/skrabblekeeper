'use client';

import { useEffect, useState } from 'react';
import { usePro, GameHistoryEntry } from '@/context/ProContext';
import {
  TrophyIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { BOARD_LAYOUT } from '@/lib/constants';

interface GameHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDuration(minutes: number | null): string {
  if (!minutes) return '-';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

// Mini board component for game history - matches main board color palette
function MiniBoard({ boardState }: { boardState: { letter: string; row: number; col: number }[] | null }) {
  if (!boardState || boardState.length === 0) {
    return (
      <div className="text-xs text-[#1e3a5f]/40 text-center py-4">
        No board data available
      </div>
    );
  }

  // Create a 15x15 grid
  const grid: (string | null)[][] = Array(15).fill(null).map(() => Array(15).fill(null));
  
  // Fill in the letters
  for (const tile of boardState) {
    if (tile.row >= 0 && tile.row < 15 && tile.col >= 0 && tile.col < 15) {
      grid[tile.row][tile.col] = tile.letter;
    }
  }

  // Get multiplier styling for empty squares - matches MULTIPLIER_COLORS from constants
  const getMultiplierStyle = (row: number, col: number): string => {
    const multiplier = BOARD_LAYOUT[row]?.[col];
    switch (multiplier) {
      case 'TW': return 'bg-[#1e3a5f]'; // Navy - Triple Word
      case 'DW': return 'bg-[#3d5a80]'; // Lighter Navy - Double Word
      case 'TL': return 'bg-[#8b7355]'; // Brown - Triple Letter
      case 'DL': return 'bg-[#a69076]'; // Tan - Double Letter
      case 'STAR': return 'bg-[#3d5a80]'; // Lighter Navy - Center Star
      default: return 'bg-[#404f71]'; // Default dark tile
    }
  };

  return (
    <div 
      className="grid gap-[1px] p-1.5 bg-[#1e3a5f] rounded-md shadow-md"
      style={{ 
        gridTemplateColumns: 'repeat(15, 1fr)',
        width: '100%',
        maxWidth: '180px',
      }}
    >
      {grid.map((row, rowIndex) =>
        row.map((letter, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`aspect-square flex items-center justify-center text-[5px] font-bold rounded-[1px]
              ${letter 
                ? 'bg-[#f5f0e8] text-[#1e3a5f] shadow-sm' 
                : getMultiplierStyle(rowIndex, colIndex)
              }`}
          >
            {letter?.toUpperCase() || ''}
          </div>
        ))
      )}
    </div>
  );
}

function GameCard({ game }: { game: GameHistoryEntry }) {
  const [showBoard, setShowBoard] = useState(false);
  const sortedPlayers = [...game.players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];

  return (
    <div className="bg-white rounded-lg border border-[#e8dfd2] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-[#f5f0e8] border-b border-[#e8dfd2] flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-[#1e3a5f]">
            {formatDate(game.playedAt)}
          </p>
          <p className="text-xs text-[#1e3a5f]/50">
            {game.totalTurns ? `${game.totalTurns} turns` : ''} 
            {game.durationMinutes ? ` • ${formatDuration(game.durationMinutes)}` : ''}
          </p>
        </div>
        {game.settings?.languages && game.settings.languages.length > 0 && (
          <div className="flex gap-1">
            {game.settings.languages.slice(0, 3).map(lang => (
              <span key={lang} className="text-xs bg-[#e8dfd2] px-2 py-0.5 rounded">
                {lang.toUpperCase()}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content: Players + Mini Board */}
      <div className="p-4">
        <div className="flex gap-4">
          {/* Players list */}
          <div className="flex-1 space-y-2">
            {sortedPlayers.map((player, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-2 rounded ${
                  index === 0 ? 'bg-[#c4a882]/20' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  {index === 0 && <TrophyIcon className="w-4 h-4 text-yellow-500" />}
                  <span className={`text-sm ${index === 0 ? 'font-bold' : ''} text-[#1e3a5f]`}>
                    {player.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#1e3a5f]/50">
                    {player.words.length} words
                  </span>
                  <span className={`font-bold ${index === 0 ? 'text-[#1e3a5f]' : 'text-[#1e3a5f]/70'}`}>
                    {player.score}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Mini Board Preview (always visible if board data exists) */}
          {game.boardState && game.boardState.length > 0 && (
            <div className="flex-shrink-0">
              <MiniBoard boardState={game.boardState} />
            </div>
          )}
        </div>

        {/* Toggle to show/hide board on mobile or if no inline board */}
        {game.boardState && game.boardState.length > 0 && (
          <button
            onClick={() => setShowBoard(!showBoard)}
            className="mt-3 text-xs text-[#1e3a5f]/60 hover:text-[#1e3a5f] 
              transition-colors underline sm:hidden"
          >
            {showBoard ? 'Hide board' : 'Show board'}
          </button>
        )}

        {/* Expanded board view for mobile */}
        {showBoard && game.boardState && (
          <div className="mt-3 flex justify-center sm:hidden">
            <MiniBoard boardState={game.boardState} />
          </div>
        )}

        {/* Top words preview */}
        {winner.words.length > 0 && (
          <div className="mt-3 pt-3 border-t border-[#e8dfd2]">
            <p className="text-xs text-[#1e3a5f]/50 mb-1">Top words by {winner.name}:</p>
            <div className="flex flex-wrap gap-1">
              {winner.words
                .sort((a, b) => b.score - a.score)
                .slice(0, 5)
                .map((word, i) => (
                  <span 
                    key={i}
                    className="text-xs bg-[#e8dfd2] px-2 py-0.5 rounded"
                  >
                    {word.word} ({word.score})
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function GameHistory({ isOpen, onClose }: GameHistoryProps) {
  const { isPro, gameHistory, isLoadingHistory, loadGameHistory } = usePro();

  useEffect(() => {
    if (isOpen && isPro) {
      loadGameHistory();
    }
  }, [isOpen, isPro, loadGameHistory]);

  if (!isOpen) return null;

  if (!isPro) {
    return (
      <div 
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <div 
          className="bg-[#faf8f5] rounded-xl shadow-xl max-w-md w-full p-6 text-center"
          onClick={e => e.stopPropagation()}
        >
          <p className="text-[#1e3a5f]">Pro features require an active license.</p>
          <button
            onClick={onClose}
            className="mt-4 py-2 px-4 bg-[#1e3a5f] text-[#f5f0e8] rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalGames = gameHistory.length;
  const avgScore = totalGames > 0
    ? Math.round(
        gameHistory.reduce((acc, game) => {
          const maxScore = Math.max(...game.players.map(p => p.score));
          return acc + maxScore;
        }, 0) / totalGames
      )
    : 0;

  return (
    <div 
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#faf8f5] rounded-xl shadow-xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1e3a5f] px-5 py-4">
          <h2 className="text-lg font-bold text-[#f5f0e8]">Game History</h2>
          <p className="text-[#f5f0e8]/70 text-sm">Your past games</p>
        </div>

        {/* Stats */}
        <div className="px-5 py-4 bg-[#f5f0e8] border-b border-[#e8dfd2] flex justify-around">
          <div className="text-center">
            <p className="text-2xl font-bold text-[#1e3a5f]">{totalGames}</p>
            <p className="text-xs text-[#1e3a5f]/50">Games</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#1e3a5f]">{avgScore}</p>
            <p className="text-xs text-[#1e3a5f]/50">Avg High Score</p>
          </div>
        </div>

        {/* Games List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {isLoadingHistory ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-3 border-[#1e3a5f] border-t-transparent 
                rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-[#1e3a5f]/50">Loading history...</p>
            </div>
          ) : gameHistory.length === 0 ? (
            <div className="text-center py-8">
              <ChartBarIcon className="w-12 h-12 text-[#1e3a5f]/30 mx-auto mb-2" />
              <p className="text-[#1e3a5f] font-medium">No games yet</p>
              <p className="text-sm text-[#1e3a5f]/50">
                Complete a game to see it here
              </p>
            </div>
          ) : (
            gameHistory.map(game => (
              <GameCard key={game.id} game={game} />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 pt-2 bg-[#faf8f5]">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-[#1e3a5f] hover:bg-[#162d4d] 
              text-[#f5f0e8] font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
