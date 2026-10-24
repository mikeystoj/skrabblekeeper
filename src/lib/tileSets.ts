import { ALPHABET, LETTER_VALUES } from './constants';

// Official letter values and tile counts for each language edition of Scrabble.
// The board layout and 50-point bingo are the same in every edition.

export type TileSetId = 'en' | 'de' | 'fr' | 'es' | 'it';

export interface TileSet {
  id: TileSetId;
  name: string; // English name, e.g. "German"
  nativeName: string; // e.g. "Deutsch"
  values: Record<string, number>;
  counts: Record<string, number>; // Excluding the 2 blanks every edition has
  letters: string[]; // Picker order
}

// Build values/counts from rows of [points, [letter, count], ...]
function fromRows(rows: [number, [string, number][]][]) {
  const values: Record<string, number> = {};
  const counts: Record<string, number> = {};
  for (const [points, letters] of rows) {
    for (const [letter, count] of letters) {
      values[letter] = points;
      counts[letter] = count;
    }
  }
  return { values, counts };
}

// Alphabet first, then accented letters, so the picker reads naturally
function pickerOrder(values: Record<string, number>): string[] {
  const letters = Object.keys(values);
  const plain = ALPHABET.filter((l) => letters.includes(l));
  const special = letters.filter((l) => !ALPHABET.includes(l)).sort((a, b) => a.localeCompare(b));
  return [...plain, ...special];
}

const ENGLISH_COUNTS: Record<string, number> = {
  A: 9, B: 2, C: 2, D: 4, E: 12, F: 2, G: 3, H: 2, I: 9, J: 1, K: 1, L: 4, M: 2,
  N: 6, O: 8, P: 2, Q: 1, R: 6, S: 4, T: 6, U: 4, V: 2, W: 2, X: 1, Y: 2, Z: 1,
};

const german = fromRows([
  [1, [['E', 15], ['N', 9], ['S', 7], ['I', 6], ['R', 6], ['T', 6], ['U', 6], ['A', 5], ['D', 4]]],
  [2, [['H', 4], ['G', 3], ['L', 3], ['O', 3]]],
  [3, [['M', 4], ['B', 2], ['W', 1], ['Z', 1]]],
  [4, [['C', 2], ['F', 2], ['K', 2], ['P', 1]]],
  [6, [['Ä', 1], ['J', 1], ['Ü', 1], ['V', 1]]],
  [8, [['Ö', 1], ['X', 1]]],
  [10, [['Q', 1], ['Y', 1]]],
]);

const french = fromRows([
  [1, [['E', 15], ['A', 9], ['I', 8], ['N', 6], ['O', 6], ['R', 6], ['S', 6], ['T', 6], ['U', 6], ['L', 5]]],
  [2, [['D', 3], ['G', 2], ['M', 3]]],
  [3, [['B', 2], ['C', 2], ['P', 2]]],
  [4, [['F', 2], ['H', 2], ['V', 2]]],
  [8, [['J', 1], ['Q', 1]]],
  [10, [['K', 1], ['W', 1], ['X', 1], ['Y', 1], ['Z', 1]]],
]);

const spanish = fromRows([
  [1, [['A', 12], ['E', 12], ['O', 9], ['I', 6], ['S', 6], ['N', 5], ['R', 5], ['U', 5], ['L', 4], ['T', 4]]],
  [2, [['D', 5], ['G', 2]]],
  [3, [['C', 4], ['B', 2], ['M', 2], ['P', 2]]],
  [4, [['H', 2], ['F', 1], ['V', 1], ['Y', 1]]],
  [5, [['Q', 1]]],
  [8, [['J', 1], ['Ñ', 1], ['X', 1]]],
  [10, [['Z', 1]]],
]);

const italian = fromRows([
  [1, [['A', 14], ['E', 11], ['I', 12], ['O', 15]]],
  [2, [['C', 6], ['R', 6], ['S', 6], ['T', 6]]],
  [3, [['L', 5], ['M', 5], ['N', 5], ['U', 5]]],
  [5, [['B', 3], ['D', 3], ['F', 3], ['P', 3], ['V', 3]]],
  [8, [['G', 2], ['H', 2], ['Z', 2]]],
  [10, [['Q', 1]]],
]);

export const TILE_SETS: Record<TileSetId, TileSet> = {
  en: {
    id: 'en', name: 'English', nativeName: 'English',
    values: LETTER_VALUES, counts: ENGLISH_COUNTS, letters: pickerOrder(LETTER_VALUES),
  },
  de: {
    id: 'de', name: 'German', nativeName: 'Deutsch',
    ...german, letters: pickerOrder(german.values),
  },
  fr: {
    id: 'fr', name: 'French', nativeName: 'Français',
    ...french, letters: pickerOrder(french.values),
  },
  es: {
    id: 'es', name: 'Spanish', nativeName: 'Español',
    // CH, LL and RR double-letter tiles aren't supported yet (see playerSetup.spanishDigraphNote)
    ...spanish, letters: pickerOrder(spanish.values),
  },
  it: {
    id: 'it', name: 'Italian', nativeName: 'Italiano',
    ...italian, letters: pickerOrder(italian.values),
  },
};

export const TILE_SET_IDS = Object.keys(TILE_SETS) as TileSetId[];

export function isTileSetId(value: unknown): value is TileSetId {
  return typeof value === 'string' && value in TILE_SETS;
}

// Saved games from before tile sets existed were scored in English
export function resolveTileSet(id: TileSetId | undefined): TileSet {
  return TILE_SETS[id && isTileSetId(id) ? id : 'en'];
}
