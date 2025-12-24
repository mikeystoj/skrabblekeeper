'use client';

import { useGame } from '@/context/GameContext';
import { PlayerScoreCard } from './PlayerScoreCard';

export function ScoreView() {
  const { state } = useGame();

  // Sort players by score for ranking
  const sortedPlayers = [...state.players].sort((a, b) => b.score - a.score);
  
  // Create a map of player ID to rank
  const rankMap = new Map<string, number>();
  sortedPlayers.forEach((player, index) => {
    rankMap.set(player.id, index + 1);
  });

  return (
    <div className="max-w-xl mx-auto p-3">
      <h2 className="text-xl font-bold text-[#1e3a5f] mb-4 text-center">
        Scores
      </h2>

      {state.players.length === 0 ? (
        <div className="text-center text-[#1e3a5f] opacity-60 py-8">
          No players added yet
        </div>
      ) : (
        <div className="space-y-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {state.players.map((player) => (
            <PlayerScoreCard
              key={player.id}
              player={player}
              isCurrentPlayer={player.id === state.currentPlayerId}
              rank={rankMap.get(player.id) || 0}
            />
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {state.players.length > 0 && (
        <div className="mt-4 p-3 bg-[#e8dfd2] rounded-lg">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-xl font-bold text-[#1e3a5f]">
                {state.players.reduce((sum, p) => sum + p.score, 0)}
              </div>
              <div className="text-xs text-[#1e3a5f] opacity-70">Total</div>
            </div>
            <div>
              <div className="text-xl font-bold text-[#1e3a5f]">
                {state.players.reduce((sum, p) => sum + p.words.length, 0)}
              </div>
              <div className="text-xs text-[#1e3a5f] opacity-70">Words</div>
            </div>
            <div>
              <div className="text-xl font-bold text-[#1e3a5f]">
                {sortedPlayers[0]?.name || '-'}
              </div>
              <div className="text-xs text-[#1e3a5f] opacity-70">Leader</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
