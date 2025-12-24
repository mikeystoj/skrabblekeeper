// Standard Scrabble letter values
export const LETTER_VALUES: Record<string, number> = {
  A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8,
  K: 5, L: 1, M: 3, N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1,
  U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10
};

// Board multiplier types
export type MultiplierType = 'TW' | 'DW' | 'TL' | 'DL' | 'STAR' | null;

// Standard 15x15 Scrabble board layout
// TW = Triple Word, DW = Double Word, TL = Triple Letter, DL = Double Letter
// STAR = Center square (also counts as DW)
export const BOARD_LAYOUT: MultiplierType[][] = [
  ['TW', null, null, 'DL', null, null, null, 'TW', null, null, null, 'DL', null, null, 'TW'],
  [null, 'DW', null, null, null, 'TL', null, null, null, 'TL', null, null, null, 'DW', null],
  [null, null, 'DW', null, null, null, 'DL', null, 'DL', null, null, null, 'DW', null, null],
  ['DL', null, null, 'DW', null, null, null, 'DL', null, null, null, 'DW', null, null, 'DL'],
  [null, null, null, null, 'DW', null, null, null, null, null, 'DW', null, null, null, null],
  [null, 'TL', null, null, null, 'TL', null, null, null, 'TL', null, null, null, 'TL', null],
  [null, null, 'DL', null, null, null, 'DL', null, 'DL', null, null, null, 'DL', null, null],
  ['TW', null, null, 'DL', null, null, null, 'STAR', null, null, null, 'DL', null, null, 'TW'],
  [null, null, 'DL', null, null, null, 'DL', null, 'DL', null, null, null, 'DL', null, null],
  [null, 'TL', null, null, null, 'TL', null, null, null, 'TL', null, null, null, 'TL', null],
  [null, null, null, null, 'DW', null, null, null, null, null, 'DW', null, null, null, null],
  ['DL', null, null, 'DW', null, null, null, 'DL', null, null, null, 'DW', null, null, 'DL'],
  [null, null, 'DW', null, null, null, 'DL', null, 'DL', null, null, null, 'DW', null, null],
  [null, 'DW', null, null, null, 'TL', null, null, null, 'TL', null, null, null, 'DW', null],
  ['TW', null, null, 'DL', null, null, null, 'TW', null, null, null, 'DL', null, null, 'TW'],
];

export const BOARD_SIZE = 15;

// Multiplier display colors - Beige and Navy palette
export const MULTIPLIER_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  'TW': { bg: 'bg-[#1e3a5f]', text: 'text-[#f5f0e8]', label: 'TW' },
  'DW': { bg: 'bg-[#3d5a80]', text: 'text-[#f5f0e8]', label: 'DW' },
  'TL': { bg: 'bg-[#8b7355]', text: 'text-[#f5f0e8]', label: 'TL' },
  'DL': { bg: 'bg-[#a69076]', text: 'text-[#f5f0e8]', label: 'DL' },
  'STAR': { bg: 'bg-[#3d5a80]', text: 'text-[#f5f0e8]', label: '★' },
  'default': { bg: 'bg-[#404f71]', text: 'text-[#d4c4a8]', label: '' },
};

// All available letters for the picker
export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Bingo bonus for using all 7 tiles
export const BINGO_BONUS = 50;

// Maximum number of players
export const MAX_PLAYERS = 4;

// localStorage key
export const STORAGE_KEY = 'skrabble-keeper-game';
