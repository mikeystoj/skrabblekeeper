'use client';

import { useGame } from '@/context/GameContext';
import { usePro } from '@/context/ProContext';
import { calculateAllWordsScore } from '@/lib/scoring';
import { ViewMode } from '@/lib/types';
import { useMemo, useState, useEffect, useCallback } from 'react';

interface GameControlsProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

// Total tiles in a standard Scrabble game
const TOTAL_TILES = 100;

export function GameControls({ viewMode, onViewModeChange }: GameControlsProps) {
  const { state, dispatch } = useGame();
  const { isPro, saveGame, settings } = usePro();
  const [showEndGameModal, setShowEndGameModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [gameStartTime] = useState(() => Date.now());
  
  // Timer state
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);

  const currentPlayer = state.players.find(p => p.id === state.currentPlayerId);

  // Reset timer when player changes
  const resetTimer = useCallback(() => {
    if (isPro && settings.timerEnabled && settings.timerMinutes > 0) {
      setTimeRemaining(settings.timerMinutes * 60);
      setIsTimerRunning(true);
      setTimerExpired(false);
    }
  }, [isPro, settings.timerEnabled, settings.timerMinutes]);

  // Start/reset timer when current player changes
  useEffect(() => {
    if (state.currentPlayerId && isPro && settings.timerEnabled) {
      resetTimer();
    }
  }, [state.currentPlayerId, resetTimer, isPro, settings.timerEnabled]);

  // Timer countdown effect
  useEffect(() => {
    if (!isTimerRunning || timeRemaining === null || timeRemaining <= 0) {
      if (timeRemaining === 0 && !timerExpired) {
        setTimerExpired(true);
        setIsTimerRunning(false);
      }
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, timeRemaining, timerExpired]);

  // Format time for display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get timer color based on remaining time
  const getTimerColor = (): string => {
    if (timeRemaining === null) return 'text-[#1e3a5f]';
    if (timeRemaining <= 10) return 'text-red-500 animate-pulse';
    if (timeRemaining <= 30) return 'text-orange-500';
    return 'text-[#1e3a5f]';
  };
  
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
      // Timer will reset automatically via useEffect when currentPlayerId changes
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
      // Timer will reset automatically via useEffect when currentPlayerId changes
    }
  };

  // Handle timer expiration - auto pass turn
  const handleTimerExpired = () => {
    setTimerExpired(false);
    handlePass();
  };

  const handleEndGame = async (saveToHistory: boolean) => {
    if (saveToHistory && isPro) {
      setIsSaving(true);
      
      // Calculate game duration
      const durationMinutes = Math.round((Date.now() - gameStartTime) / 60000);
      
      // Find winner
      const sortedPlayers = [...state.players].sort((a, b) => b.score - a.score);
      const winner = sortedPlayers[0]?.name || null;
      
      // Calculate total turns
      const totalTurns = state.players.reduce((sum, p) => sum + p.words.length, 0);
      
      // Format players data
      const playersData = state.players.map(p => ({
        name: p.name,
        score: p.score,
        words: p.words.map((w, i) => ({
          word: w.word,
          score: w.score,
          turn: i + 1,
        })),
      }));

      await saveGame({
        durationMinutes,
        players: playersData,
        winner,
        totalTurns,
        settings,
      });
      
      setIsSaving(false);
    }
    
    setShowEndGameModal(false);
    dispatch({ type: 'FULL_NEW_GAME' });
  };

  // End Game Modal
  const EndGameModal = () => {
    if (!showEndGameModal) return null;

    const sortedPlayers = [...state.players].sort((a, b) => b.score - a.score);
    const winner = sortedPlayers[0];

    return (
      <div 
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
        onClick={() => setShowEndGameModal(false)}
      >
        <div 
          className="bg-[#faf8f5] rounded-xl shadow-xl max-w-sm w-full overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <div className="bg-[#1e3a5f] px-5 py-4">
            <h2 className="text-lg font-bold text-[#f5f0e8]">End Game</h2>
            <p className="text-[#f5f0e8]/70 text-sm">Game Summary</p>
          </div>

          <div className="p-5">
            {/* Winner */}
            <div className="text-center mb-4">
              <div className="text-3xl mb-1">🏆</div>
              <p className="text-[#1e3a5f] font-bold text-lg">{winner?.name || 'No winner'}</p>
              <p className="text-[#1e3a5f]/60 text-sm">{winner?.score || 0} points</p>
            </div>

            {/* All Players */}
            <div className="space-y-2 mb-4">
              {sortedPlayers.map((player, index) => (
                <div 
                  key={player.id}
                  className={`flex items-center justify-between p-2 rounded ${
                    index === 0 ? 'bg-[#c4a882]/30' : 'bg-[#e8dfd2]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}</span>
                    <span className="text-sm text-[#1e3a5f]">{player.name}</span>
                  </div>
                  <span className="font-bold text-[#1e3a5f]">{player.score}</span>
                </div>
              ))}
            </div>

            {/* Save to History (Pro only) */}
            {isPro && (
              <div className="bg-[#f5f0e8] rounded-lg p-3 mb-4">
                <p className="text-xs text-[#1e3a5f]/70 text-center">
                  ✨ Pro: This game will be saved to your history
                </p>
              </div>
            )}
          </div>

          <div className="px-5 pb-5 space-y-2">
            <button
              onClick={() => handleEndGame(true)}
              disabled={isSaving}
              className="w-full py-2.5 px-4 bg-[#1e3a5f] hover:bg-[#162d4d] 
                text-[#f5f0e8] font-bold rounded-lg transition-colors
                disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : isPro ? 'End & Save to History' : 'End Game'}
            </button>
            {isPro && (
              <button
                onClick={() => handleEndGame(false)}
                className="w-full py-2 px-4 text-[#1e3a5f]/50 hover:text-[#1e3a5f] 
                  text-sm transition-colors"
              >
                End without saving
              </button>
            )}
            <button
              onClick={() => setShowEndGameModal(false)}
              className="w-full py-2 px-4 text-[#1e3a5f]/50 hover:text-[#1e3a5f] 
                text-sm transition-colors"
            >
              Continue Playing
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
    <EndGameModal />
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
          
          {/* Timer Display */}
          {isPro && settings.timerEnabled && timeRemaining !== null && (
            <div className="mt-2 pt-2 border-t border-[#d4c4a8]">
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs text-[#1e3a5f]/60">⏱️ Time:</span>
                <span className={`text-2xl font-bold font-mono ${getTimerColor()}`}>
                  {formatTime(timeRemaining)}
                </span>
                {/* Pause/Resume Button */}
                {!timerExpired && (
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className={`ml-2 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isTimerRunning 
                        ? 'bg-[#1e3a5f] hover:bg-[#162d4d] text-[#f5f0e8]' 
                        : 'bg-amber-500 hover:bg-amber-600 text-white'
                    }`}
                    title={isTimerRunning ? 'Pause timer' : 'Resume timer'}
                  >
                    {isTimerRunning ? (
                      <span className="text-xs font-bold">⏸</span>
                    ) : (
                      <span className="text-xs font-bold">▶</span>
                    )}
                  </button>
                )}
              </div>
              
              {/* Paused indicator */}
              {!isTimerRunning && !timerExpired && (
                <p className="text-xs text-amber-600 text-center mt-1 animate-pulse">Timer paused</p>
              )}
              
              {/* Timer Expired Warning */}
              {timerExpired && (
                <div className="mt-2 bg-red-100 border border-red-300 rounded-md p-2 text-center">
                  <p className="text-red-600 text-sm font-medium">⏰ Time&apos;s up!</p>
                  <button
                    onClick={handleTimerExpired}
                    className="mt-1 text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Pass Turn
                  </button>
                </div>
              )}
            </div>
          )}
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

      {/* End Game Button */}
      {state.players.length > 0 && state.players.some(p => p.words.length > 0) && (
        <button
          onClick={() => setShowEndGameModal(true)}
          className="w-full py-2 px-3 bg-[#c4a882] hover:bg-[#b39872] 
            text-[#1e3a5f] font-medium rounded-md transition-colors text-sm"
        >
          🏁 End Game
        </button>
      )}
    </div>
    </>
  );
}
