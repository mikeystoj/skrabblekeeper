import { MultiplierType } from './constants';

// A single tile placed on the board
export interface PlacedTile {
  letter: string;
  row: number;
  col: number;
  playerId: string;
  isPending?: boolean; // True when tile is being placed but not yet submitted
}

// Individual word score breakdown
export interface WordScore {
  word: string;
  score: number;
}

// A word that has been played
export interface PlayedWord {
  id: string;
  word: string;
  score: number;
  tiles: PlacedTile[];
  timestamp: number;
  breakdown?: WordScore[]; // Individual word scores if multiple words formed
}

// A player in the game
export interface Player {
  id: string;
  name: string;
  score: number;
  words: PlayedWord[];
}

// The complete game state
export interface GameState {
  players: Player[];
  board: (PlacedTile | null)[][];
  pendingTiles: PlacedTile[];
  currentPlayerId: string | null;
  gameStarted: boolean;
}

// Direction for word placement
export type Direction = 'horizontal' | 'vertical';

// Action types for the reducer
export type GameAction =
  | { type: 'ADD_PLAYER'; name: string }
  | { type: 'REMOVE_PLAYER'; playerId: string }
  | { type: 'UPDATE_PLAYER_NAME'; playerId: string; name: string }
  | { type: 'UPDATE_PLAYER_SCORE'; playerId: string; score: number }
  | { type: 'REORDER_PLAYERS'; fromIndex: number; toIndex: number }
  | { type: 'SET_CURRENT_PLAYER'; playerId: string }
  | { type: 'PLACE_TILE'; row: number; col: number; letter: string }
  | { type: 'PLACE_WORD'; startRow: number; startCol: number; word: string; direction: Direction }
  | { type: 'REMOVE_PENDING_TILE'; row: number; col: number }
  | { type: 'CLEAR_PENDING_TILES' }
  | { type: 'SUBMIT_WORD'; word: string; score: number; breakdown?: WordScore[] }
  | { type: 'UNDO_LAST_WORD' }
  | { type: 'START_GAME' }
  | { type: 'NEW_GAME' }
  | { type: 'FULL_NEW_GAME' }
  | { type: 'LOAD_STATE'; state: GameState };

// View mode for the app
export type ViewMode = 'board' | 'scores';

// Position on the board
export interface BoardPosition {
  row: number;
  col: number;
}

// Square info including multiplier
export interface SquareInfo {
  row: number;
  col: number;
  multiplier: MultiplierType;
  tile: PlacedTile | null;
  isPending: boolean;
}

