'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { GameState, GameAction, Player, PlacedTile, PlayedWord, Direction } from '@/lib/types';
import { BOARD_SIZE, STORAGE_KEY, MAX_PLAYERS } from '@/lib/constants';

// Create empty board
function createEmptyBoard(): (PlacedTile | null)[][] {
  return Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
}

// Initial game state
const initialState: GameState = {
  players: [],
  board: createEmptyBoard(),
  pendingTiles: [],
  currentPlayerId: null,
  gameStarted: false,
};

// Generate unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Game reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ADD_PLAYER': {
      if (state.players.length >= MAX_PLAYERS) return state;
      const newPlayer: Player = {
        id: generateId(),
        name: action.name,
        score: 0,
        words: [],
      };
      const players = [...state.players, newPlayer];
      return {
        ...state,
        players,
        currentPlayerId: state.currentPlayerId || newPlayer.id,
      };
    }

    case 'REMOVE_PLAYER': {
      const players = state.players.filter(p => p.id !== action.playerId);
      const currentPlayerId = state.currentPlayerId === action.playerId
        ? (players[0]?.id || null)
        : state.currentPlayerId;
      return { ...state, players, currentPlayerId };
    }

    case 'UPDATE_PLAYER_NAME': {
      const players = state.players.map(p =>
        p.id === action.playerId ? { ...p, name: action.name } : p
      );
      return { ...state, players };
    }

    case 'UPDATE_PLAYER_SCORE': {
      const players = state.players.map(p =>
        p.id === action.playerId ? { ...p, score: action.score } : p
      );
      return { ...state, players };
    }

    case 'SET_CURRENT_PLAYER': {
      return { ...state, currentPlayerId: action.playerId };
    }

    case 'PLACE_TILE': {
      if (!state.currentPlayerId) return state;
      
      // Check if square is already occupied by a committed tile
      if (state.board[action.row][action.col]) return state;
      
      // Check if there's already a pending tile here
      const existingPending = state.pendingTiles.find(
        t => t.row === action.row && t.col === action.col
      );
      if (existingPending) return state;

      const newTile: PlacedTile = {
        letter: action.letter,
        row: action.row,
        col: action.col,
        playerId: state.currentPlayerId,
        isPending: true,
      };

      return {
        ...state,
        pendingTiles: [...state.pendingTiles, newTile],
      };
    }

    case 'PLACE_WORD': {
      if (!state.currentPlayerId) return state;
      
      const { startRow, startCol, word, direction } = action;
      const newPendingTiles: PlacedTile[] = [];
      
      let currentRow = startRow;
      let currentCol = startCol;
      
      for (const letter of word.toUpperCase()) {
        // Skip if out of bounds
        if (currentRow >= BOARD_SIZE || currentCol >= BOARD_SIZE) break;
        
        // Skip squares that already have committed tiles (but include the letter in word)
        if (!state.board[currentRow][currentCol]) {
          // Check if there's already a pending tile here
          const existingPending = state.pendingTiles.find(
            t => t.row === currentRow && t.col === currentCol
          );
          
          if (!existingPending) {
            newPendingTiles.push({
              letter,
              row: currentRow,
              col: currentCol,
              playerId: state.currentPlayerId!,
              isPending: true,
            });
          }
        }
        
        // Move to next position
        if (direction === 'horizontal') {
          currentCol++;
        } else {
          currentRow++;
        }
      }

      return {
        ...state,
        pendingTiles: [...state.pendingTiles, ...newPendingTiles],
      };
    }

    case 'REMOVE_PENDING_TILE': {
      const pendingTiles = state.pendingTiles.filter(
        t => !(t.row === action.row && t.col === action.col)
      );
      return { ...state, pendingTiles };
    }

    case 'CLEAR_PENDING_TILES': {
      return { ...state, pendingTiles: [] };
    }

    case 'SUBMIT_WORD': {
      if (!state.currentPlayerId || state.pendingTiles.length === 0) return state;

      // Create the played word
      const playedWord: PlayedWord = {
        id: generateId(),
        word: action.word,
        score: action.score,
        tiles: state.pendingTiles.map(t => ({ ...t, isPending: false })),
        timestamp: Date.now(),
      };

      // Commit pending tiles to the board
      const newBoard = state.board.map(row => [...row]);
      for (const tile of state.pendingTiles) {
        newBoard[tile.row][tile.col] = { ...tile, isPending: false };
      }

      // Update player score and words
      const players = state.players.map(p => {
        if (p.id === state.currentPlayerId) {
          return {
            ...p,
            score: p.score + action.score,
            words: [...p.words, playedWord],
          };
        }
        return p;
      });

      // Move to next player
      const currentIndex = players.findIndex(p => p.id === state.currentPlayerId);
      const nextIndex = (currentIndex + 1) % players.length;
      const nextPlayerId = players[nextIndex]?.id || null;

      return {
        ...state,
        board: newBoard,
        pendingTiles: [],
        players,
        currentPlayerId: nextPlayerId,
      };
    }

    case 'START_GAME': {
      return { ...state, gameStarted: true };
    }

    case 'UNDO_LAST_WORD': {
      // Find the last word played across all players
      let lastWordInfo: { playerId: string; word: PlayedWord; timestamp: number } | null = null;
      
      for (const player of state.players) {
        if (player.words.length > 0) {
          const lastWord = player.words[player.words.length - 1];
          if (!lastWordInfo || lastWord.timestamp > lastWordInfo.timestamp) {
            lastWordInfo = { playerId: player.id, word: lastWord, timestamp: lastWord.timestamp };
          }
        }
      }
      
      if (!lastWordInfo) return state;
      
      // Remove the tiles from the board
      const newBoard = state.board.map(row => [...row]);
      for (const tile of lastWordInfo.word.tiles) {
        newBoard[tile.row][tile.col] = null;
      }
      
      // Update the player's score and words
      const players = state.players.map(p => {
        if (p.id === lastWordInfo!.playerId) {
          return {
            ...p,
            score: p.score - lastWordInfo!.word.score,
            words: p.words.slice(0, -1),
          };
        }
        return p;
      });
      
      // Set the current player back to the one who played the undone word
      return {
        ...state,
        board: newBoard,
        players,
        currentPlayerId: lastWordInfo.playerId,
        pendingTiles: [],
      };
    }

    case 'NEW_GAME': {
      return {
        ...initialState,
        players: state.players.map(p => ({ ...p, score: 0, words: [] })),
        currentPlayerId: state.players[0]?.id || null,
        gameStarted: state.players.length > 0,
      };
    }

    case 'FULL_NEW_GAME': {
      return initialState;
    }

    case 'LOAD_STATE': {
      return action.state;
    }

    default:
      return state;
  }
}

// Context type
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  isLoaded: boolean;
}

const GameContext = createContext<GameContextType | null>(null);

// Provider component
export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Validate the parsed state has expected structure
        if (parsed && parsed.players && Array.isArray(parsed.board)) {
          dispatch({ type: 'LOAD_STATE', state: parsed });
        }
      }
    } catch (error) {
      console.warn('Failed to load game state:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.warn('Failed to save game state:', error);
      }
    }
  }, [state, isLoaded]);

  return (
    <GameContext.Provider value={{ state, dispatch, isLoaded }}>
      {children}
    </GameContext.Provider>
  );
}

// Hook to use game context
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

