'use client';

import { useGame } from '@/context/GameContext';
import { calculateAllWordsScore } from '@/lib/scoring';
import { ViewMode } from '@/lib/types';
import { useMemo } from 'react';

interface GameControlsProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

// Total tiles in a standard Scrabble game
const TOTAL_TILES = 100;

export function GameControls({ viewMode, onViewModeChange }: GameControlsProps) {
  const { state, dispatch } = useGame();

  const currentPlayer = state.players.find(p => p.id === state.currentPlayerId);
  
  const scoringResult = useMemo(() => {
    return calculateAllWordsScore(state.pendingTiles, state.board);
  }, [state.pendingTiles, state.board]);

  const canUndo = useMemo(() => {
    return state.players.some(p => p.words.length > 0);
  }, [state.players]);

  const lastWordInfo = useMemo(() => {
    let lastWord: { playerName: string; word: string; score: number; timestamp: number } | null = null;
    
    for (const player of state.players) {
      if (player.words.length > 0) {
        const word = player.words[player.words.length - 1];
        if (!lastWord || word.timestamp > lastWord.timestamp) {
          lastWord = { 
            playerName: player.name, 
            word: word.word, 
            score: word.score,
            timestamp: word.timestamp 
          };
        }
      }
    }
    return lastWord;
  }, [state.players]);

  // Calculate game stats
  const gameStats = useMemo(() => {
    // Count tiles on board
    let tilesOnBoard = 0;
    for (let row = 0; row < state.board.length; row++) {
      for (let col = 0; col < state.board[row].length; col++) {
        if (state.board[row][col]) {
          tilesOnBoard++;
        }
      }
    }

    // Calculate remaining tiles (assuming 7 tiles per player in hand)
    const tilesInHands = state.players.length * 7;
    const tilesRemaining = Math.max(0, TOTAL_TILES - tilesOnBoard - tilesInHands);

    // Find leader
    const sortedPlayers = [...state.players].sort((a, b) => b.score - a.score);
    const leader = sortedPlayers[0];
    const totalScore = state.players.reduce((sum, p) => sum + p.score, 0);

    return {
      tilesRemaining,
      tilesOnBoard,
      leader,
      totalScore,
    };
  }, [state.board, state.players]);

  const handleSubmitWord = () => {
    if (state.pendingTiles.length > 0 && currentPlayer) {
      const wordDisplay = scoringResult.words.map(w => w.word).join(' + ');
      dispatch({
        type: 'SUBMIT_WORD',
        word: wordDisplay,
        score: scoringResult.totalScore,
      });
    }
  };

  const handleClearPending = () => {
    dispatch({ type: 'CLEAR_PENDING_TILES' });
  };

  const handleUndo = () => {
    dispatch({ type: 'UNDO_LAST_WORD' });
  };

  const handlePass = () => {
    if (state.players.length > 1 && state.currentPlayerId) {
      const currentIndex = state.players.findIndex(p => p.id === state.currentPlayerId);
      const nextIndex = (currentIndex + 1) % state.players.length;
      dispatch({ type: 'SET_CURRENT_PLAYER', playerId: state.players[nextIndex].id });
    }
  };

  return (
    <div className="bg-[#faf8f5] rounded-lg shadow-md p-3 space-y-3">
      {/* View Toggle */}
      <div className="flex rounded-md bg-[#e8dfd2] p-1">
        <button
          onClick={() => onViewModeChange('board')}
          className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-all
            ${viewMode === 'board' 
              ? 'bg-[#1e3a5f] text-[#f5f0e8]' 
              : 'text-[#1e3a5f] hover:bg-[#d4c4a8]'
            }`}
        >
          Board
        </button>
        <button
          onClick={() => onViewModeChange('scores')}
          className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-all
            ${viewMode === 'scores' 
              ? 'bg-[#1e3a5f] text-[#f5f0e8]' 
              : 'text-[#1e3a5f] hover:bg-[#d4c4a8]'
            }`}
        >
          Scores
        </button>
      </div>

      {/* Current Player */}
      {currentPlayer && viewMode === 'board' && (
        <div className="p-2 bg-[#e8dfd2] rounded-md">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#1e3a5f]">Turn: <strong>{currentPlayer.name}</strong></span>
            <span className="text-[#1e3a5f]">Score: <strong>{currentPlayer.score}</strong></span>
          </div>
        </div>
      )}

      {/* Pending Words Preview */}
      {state.pendingTiles.length > 0 && viewMode === 'board' && (
        <div className="p-2 bg-[#d4c4a8] rounded-md">
          {scoringResult.words.length > 0 && (
            <div className="space-y-1 mb-2">
              <span className="text-xs font-medium text-[#1e3a5f]">Words:</span>
              {scoringResult.words.map((wordResult, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="font-bold text-[#1e3a5f]">{wordResult.word}</span>
                  <span className="text-[#1e3a5f]">+{wordResult.score}</span>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between pt-1 border-t border-[#c4a882]">
            <span className="text-sm font-medium text-[#1e3a5f]">Total:</span>
            <span className="text-xl font-bold text-[#1e3a5f]">+{scoringResult.totalScore}</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {viewMode === 'board' && (
        <div className="flex gap-2">
          <button
            onClick={handleClearPending}
            disabled={state.pendingTiles.length === 0}
            className="flex-1 py-2 px-3 bg-[#e8dfd2] hover:bg-[#d4c4a8] 
              disabled:opacity-40 disabled:cursor-not-allowed
              text-[#1e3a5f] font-medium rounded-md transition-colors text-sm"
          >
            Clear
          </button>
          <button
            onClick={handleSubmitWord}
            disabled={state.pendingTiles.length === 0}
            className="flex-1 py-2 px-3 bg-[#1e3a5f] hover:bg-[#162d4d] 
              disabled:opacity-40 disabled:cursor-not-allowed
              text-[#f5f0e8] font-medium rounded-md transition-colors text-sm"
          >
            Submit
          </button>
        </div>
      )}

      {/* Undo & Pass Buttons */}
      {viewMode === 'board' && (
        <div className="flex gap-2">
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className="flex-1 py-2 px-3 bg-[#e8dfd2] hover:bg-[#d4c4a8] 
              disabled:opacity-40 disabled:cursor-not-allowed
              text-[#1e3a5f] font-medium rounded-md transition-colors text-sm
              flex items-center justify-center gap-1"
          >
            <span>Undo</span>
            {lastWordInfo && (
              <span className="text-xs opacity-70 truncate max-w-[60px]">({lastWordInfo.word})</span>
            )}
          </button>
          <button
            onClick={handlePass}
            disabled={state.players.length < 2}
            className="flex-1 py-2 px-3 bg-[#c4a882] hover:bg-[#b39872] 
              disabled:opacity-40 disabled:cursor-not-allowed
              text-[#1e3a5f] font-medium rounded-md transition-colors text-sm"
          >
            Pass Turn
          </button>
        </div>
      )}

      {/* Game Summary */}
      {viewMode === 'board' && state.players.length > 0 && (
        <div className="p-2 bg-[#e8dfd2] rounded-md">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-[#1e3a5f]">
                ~{gameStats.tilesRemaining}
              </div>
              <div className="text-[10px] text-[#1e3a5f] opacity-70">Tiles Left</div>
            </div>
            <div>
              <div className="text-lg font-bold text-[#1e3a5f] truncate">
                {gameStats.leader?.name || '-'}
              </div>
              <div className="text-[10px] text-[#1e3a5f] opacity-70">Leader</div>
            </div>
            <div>
              <div className="text-lg font-bold text-[#1e3a5f]">
                {gameStats.totalScore}
              </div>
              <div className="text-[10px] text-[#1e3a5f] opacity-70">Total Pts</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
