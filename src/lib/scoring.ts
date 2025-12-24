import { LETTER_VALUES, BOARD_LAYOUT, BINGO_BONUS, BOARD_SIZE } from './constants';
import { PlacedTile } from './types';

interface WordResult {
  word: string;
  score: number;
  tiles: { letter: string; row: number; col: number; isNew: boolean }[];
}

interface ScoringResult {
  totalScore: number;
  words: WordResult[];
}

/**
 * Calculate scores for all words formed by the pending tiles
 * This includes the main word and any perpendicular words created
 */
export function calculateAllWordsScore(
  pendingTiles: PlacedTile[],
  board: (PlacedTile | null)[][]
): ScoringResult {
  if (pendingTiles.length === 0) {
    return { totalScore: 0, words: [] };
  }

  const words: WordResult[] = [];
  const pendingPositions = new Set(
    pendingTiles.map(t => `${t.row},${t.col}`)
  );

  // Helper to check if a position has a pending tile
  const isPendingTile = (row: number, col: number): boolean => {
    return pendingPositions.has(`${row},${col}`);
  };

  // Helper to get tile at position (either from board or pending)
  const getTileAt = (row: number, col: number): PlacedTile | null => {
    if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) {
      return null;
    }
    const pending = pendingTiles.find(t => t.row === row && t.col === col);
    if (pending) return pending;
    return board[row][col];
  };

  // Determine the direction of the main word
  const isHorizontal = pendingTiles.length === 1 || 
    pendingTiles.every(t => t.row === pendingTiles[0].row);
  const isVertical = pendingTiles.length === 1 || 
    pendingTiles.every(t => t.col === pendingTiles[0].col);

  // Find the main word (the word formed by all pending tiles in a line)
  const findMainWord = (): WordResult | null => {
    if (pendingTiles.length === 0) return null;

    // Sort pending tiles
    const sorted = [...pendingTiles].sort((a, b) => {
      if (a.row !== b.row) return a.row - b.row;
      return a.col - b.col;
    });

    const firstTile = sorted[0];
    const direction = isHorizontal ? 'horizontal' : 'vertical';
    
    // Find the start of the word (extend backwards)
    let startRow = firstTile.row;
    let startCol = firstTile.col;
    
    if (direction === 'horizontal') {
      while (startCol > 0 && getTileAt(startRow, startCol - 1)) {
        startCol--;
      }
    } else {
      while (startRow > 0 && getTileAt(startRow - 1, startCol)) {
        startRow--;
      }
    }

    // Build the word from start
    const tiles: { letter: string; row: number; col: number; isNew: boolean }[] = [];
    let row = startRow;
    let col = startCol;

    while (row < BOARD_SIZE && col < BOARD_SIZE) {
      const tile = getTileAt(row, col);
      if (!tile) break;

      tiles.push({
        letter: tile.letter,
        row,
        col,
        isNew: isPendingTile(row, col),
      });

      if (direction === 'horizontal') {
        col++;
      } else {
        row++;
      }
    }

    if (tiles.length < 2) return null;

    const word = tiles.map(t => t.letter.toUpperCase()).join('');
    const score = calculateWordScoreWithContext(tiles);

    return { word, score, tiles };
  };

  // Find perpendicular words created by each pending tile
  const findPerpendicularWords = (): WordResult[] => {
    const perpWords: WordResult[] = [];
    const perpDirection = isHorizontal ? 'vertical' : 'horizontal';

    for (const pendingTile of pendingTiles) {
      // Check if this tile creates a perpendicular word
      let startRow = pendingTile.row;
      let startCol = pendingTile.col;

      // Find start of perpendicular word
      if (perpDirection === 'horizontal') {
        while (startCol > 0 && getTileAt(startRow, startCol - 1)) {
          startCol--;
        }
      } else {
        while (startRow > 0 && getTileAt(startRow - 1, startCol)) {
          startRow--;
        }
      }

      // Build the perpendicular word
      const tiles: { letter: string; row: number; col: number; isNew: boolean }[] = [];
      let row = startRow;
      let col = startCol;

      while (row < BOARD_SIZE && col < BOARD_SIZE) {
        const tile = getTileAt(row, col);
        if (!tile) break;

        tiles.push({
          letter: tile.letter,
          row,
          col,
          isNew: isPendingTile(row, col),
        });

        if (perpDirection === 'horizontal') {
          col++;
        } else {
          row++;
        }
      }

      // Only count if it's actually a word (more than 1 letter)
      if (tiles.length >= 2) {
        const word = tiles.map(t => t.letter.toUpperCase()).join('');
        const score = calculateWordScoreWithContext(tiles);
        perpWords.push({ word, score, tiles });
      }
    }

    return perpWords;
  };

  // Get main word
  const mainWord = findMainWord();
  if (mainWord) {
    words.push(mainWord);
  }

  // Get perpendicular words
  const perpWords = findPerpendicularWords();
  words.push(...perpWords);

  // Calculate total score
  let totalScore = words.reduce((sum, w) => sum + w.score, 0);

  // Add bingo bonus if all 7 tiles were used
  if (pendingTiles.length === 7) {
    totalScore += BINGO_BONUS;
  }

  return { totalScore, words };
}

// Helper to check if a letter is a blank tile (lowercase = blank)
const isBlankTile = (letter: string) => letter === letter.toLowerCase() && letter !== letter.toUpperCase();

/**
 * Calculate score for a single word with context about which tiles are new
 * Multipliers only apply to newly placed tiles
 */
function calculateWordScoreWithContext(
  tiles: { letter: string; row: number; col: number; isNew: boolean }[]
): number {
  let wordScore = 0;
  let wordMultiplier = 1;

  for (const tile of tiles) {
    // Blank tiles (lowercase letters) are worth 0 points
    const letterValue = isBlankTile(tile.letter) ? 0 : (LETTER_VALUES[tile.letter.toUpperCase()] || 0);
    
    // Only apply multipliers to newly placed tiles
    if (tile.isNew) {
      const multiplier = BOARD_LAYOUT[tile.row]?.[tile.col];

      switch (multiplier) {
        case 'DL':
          wordScore += letterValue * 2;
          break;
        case 'TL':
          wordScore += letterValue * 3;
          break;
        case 'DW':
        case 'STAR':
          wordScore += letterValue;
          wordMultiplier *= 2;
          break;
        case 'TW':
          wordScore += letterValue;
          wordMultiplier *= 3;
          break;
        default:
          wordScore += letterValue;
      }
    } else {
      // Existing tiles just add their face value
      wordScore += letterValue;
    }
  }

  return wordScore * wordMultiplier;
}

/**
 * Simple score calculation for just the pending tiles (legacy/backup)
 */
export function calculateWordScore(tiles: PlacedTile[]): number {
  if (tiles.length === 0) return 0;

  let wordScore = 0;
  let wordMultiplier = 1;

  for (const tile of tiles) {
    // Blank tiles (lowercase letters) are worth 0 points
    const letterValue = isBlankTile(tile.letter) ? 0 : (LETTER_VALUES[tile.letter.toUpperCase()] || 0);
    const multiplier = BOARD_LAYOUT[tile.row]?.[tile.col];

    switch (multiplier) {
      case 'DL':
        wordScore += letterValue * 2;
        break;
      case 'TL':
        wordScore += letterValue * 3;
        break;
      case 'DW':
      case 'STAR':
        wordScore += letterValue;
        wordMultiplier *= 2;
        break;
      case 'TW':
        wordScore += letterValue;
        wordMultiplier *= 3;
        break;
      default:
        wordScore += letterValue;
    }
  }

  // Apply word multiplier
  wordScore *= wordMultiplier;

  // Add bingo bonus if all 7 tiles were used
  if (tiles.length === 7) {
    wordScore += BINGO_BONUS;
  }

  return wordScore;
}

/**
 * Get the word string from placed tiles
 * Assumes tiles are in order (left-to-right or top-to-bottom)
 */
export function getWordFromTiles(tiles: PlacedTile[]): string {
  // Sort tiles by position (row first, then column)
  const sorted = [...tiles].sort((a, b) => {
    if (a.row !== b.row) return a.row - b.row;
    return a.col - b.col;
  });
  
  return sorted.map(t => t.letter.toUpperCase()).join('');
}

/**
 * Get the point value for a single letter
 * Blank tiles (lowercase letters) are worth 0 points
 */
export function getLetterValue(letter: string): number {
  if (isBlankTile(letter)) return 0;
  return LETTER_VALUES[letter.toUpperCase()] || 0;
}
