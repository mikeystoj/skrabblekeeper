'use client';

import { useState, useMemo, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { BoardSquare } from './BoardSquare';
import { LetterPicker } from '@/components/LetterPicker';
import { BOARD_SIZE, LETTER_VALUES, BOARD_LAYOUT, BINGO_BONUS } from '@/lib/constants';
import { Direction, PlacedTile } from '@/lib/types';

interface PreviewSquare {
  row: number;
  col: number;
  letter?: string;
}

// Confetti component for Bingo celebration
function BingoConfetti({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Generate confetti pieces
  const confettiPieces = useMemo(() => {
    const pieces = [];
    const colors = ['#1e3a5f', '#c4a882', '#f5f0e8', '#3d5a80', '#e8dfd2', '#ffd700', '#ff6b6b', '#4ecdc4'];
    
    for (let i = 0; i < 100; i++) {
      pieces.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 6 + Math.random() * 8,
        rotation: Math.random() * 360,
      });
    }
    return pieces;
  }, []);

  return (
    <div 
      className="fixed inset-0 z-50 pointer-events-none overflow-hidden"
      style={{ perspective: '1000px' }}
    >
      {/* Confetti pieces */}
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${piece.left}%`,
            top: '-20px',
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            transform: `rotate(${piece.rotation}deg)`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
        />
      ))}
      
      {/* Center celebration message */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
        <div 
          className="bg-[#1e3a5f] text-[#f5f0e8] px-8 py-6 rounded-2xl shadow-2xl 
            animate-bounce-in text-center transform"
          onClick={onComplete}
        >
          <div className="text-4xl mb-2">🎉</div>
          <h2 className="text-2xl font-bold mb-1">LEGENDARY!</h2>
          <p className="text-[#c4a882] font-medium">All 7 letters used!</p>
          <p className="text-[#f5f0e8]/70 text-sm mt-2">+{BINGO_BONUS} bonus points</p>
          <button 
            className="mt-4 px-4 py-2 bg-[#c4a882] hover:bg-[#b39872] text-[#1e3a5f] 
              font-bold rounded-lg transition-colors text-sm"
          >
            LETS GO!
          </button>
        </div>
      </div>
    </div>
  );
}

export function Board() {
  const { state, dispatch } = useGame();
  const [selectedSquare, setSelectedSquare] = useState<{ row: number; col: number } | null>(null);
  const [previewWord, setPreviewWord] = useState('');
  const [previewDirection, setPreviewDirection] = useState<Direction>('horizontal');
  const [showBingoCelebration, setShowBingoCelebration] = useState(false);

  // Calculate preview squares based on current input in the letter picker
  const previewSquares = useMemo((): PreviewSquare[] => {
    if (!selectedSquare) return [];
    
    const squares: PreviewSquare[] = [];
    let row = selectedSquare.row;
    let col = selectedSquare.col;
    let letterIndex = 0;
    
    // Show available path for word placement
    while (row < BOARD_SIZE && col < BOARD_SIZE) {
      // Skip squares with committed tiles
      if (state.board[row][col]) {
        if (previewDirection === 'horizontal') {
          col++;
        } else {
          row++;
        }
        continue;
      }
      
      // Skip squares with pending tiles
      const hasPending = state.pendingTiles.some(t => t.row === row && t.col === col);
      if (hasPending) {
        if (previewDirection === 'horizontal') {
          col++;
        } else {
          row++;
        }
        continue;
      }
      
      squares.push({
        row,
        col,
        letter: previewWord[letterIndex] || undefined,
      });
      
      letterIndex++;
      
      if (previewDirection === 'horizontal') {
        col++;
      } else {
        row++;
      }
    }
    
    return squares;
  }, [selectedSquare, previewWord, previewDirection, state.board, state.pendingTiles]);

  const handleSquareClick = (row: number, col: number) => {
    // If there are pending tiles, don't allow opening a new letter picker
    // User must submit or clear current word first
    if (state.pendingTiles.length > 0) {
      // If clicking on a pending tile, remove it
      const pendingTile = state.pendingTiles.find(t => t.row === row && t.col === col);
      if (pendingTile) {
        dispatch({ type: 'REMOVE_PENDING_TILE', row, col });
      }
      // Otherwise ignore the click - they need to submit or clear first
      return;
    }

    // If square is occupied by committed tile, do nothing
    if (state.board[row][col]) return;

    // Open letter picker with this starting position
    setSelectedSquare({ row, col });
    setPreviewWord('');
    setPreviewDirection('horizontal');
  };

  // Helper to check if a letter is a blank tile (lowercase = blank)
  const isBlankTile = (letter: string) => letter === letter.toLowerCase() && letter !== letter.toUpperCase();

  // Calculate score for placed tiles including board multipliers and perpendicular words
  const calculatePlacedWordScore = (
    word: string, 
    startRow: number, 
    startCol: number, 
    dir: Direction
  ): { totalScore: number; wordDisplay: string; isBingo: boolean } => {
    // Build the tiles that will be placed
    const newTiles: { letter: string; row: number; col: number; isNew: boolean }[] = [];
    let row = startRow;
    let col = startCol;
    
    for (const letter of word) {
      if (row >= BOARD_SIZE || col >= BOARD_SIZE) break;
      
      // Check if there's an existing tile
      const existingTile = state.board[row][col];
      
      if (existingTile) {
        // Existing tile - include in word but not as new
        newTiles.push({
          letter: (existingTile as PlacedTile).letter,
          row,
          col,
          isNew: false,
        });
      } else {
        // New tile
        newTiles.push({
          letter,
          row,
          col,
          isNew: true,
        });
      }
      
      if (dir === 'horizontal') {
        col++;
      } else {
        row++;
      }
    }

    // Calculate main word score
    let mainWordScore = 0;
    let wordMultiplier = 1;
    
    for (const tile of newTiles) {
      const letterValue = isBlankTile(tile.letter) ? 0 : (LETTER_VALUES[tile.letter.toUpperCase()] || 0);
      
      if (tile.isNew) {
        const multiplier = BOARD_LAYOUT[tile.row]?.[tile.col];
        switch (multiplier) {
          case 'DL':
            mainWordScore += letterValue * 2;
            break;
          case 'TL':
            mainWordScore += letterValue * 3;
            break;
          case 'DW':
          case 'STAR':
            mainWordScore += letterValue;
            wordMultiplier *= 2;
            break;
          case 'TW':
            mainWordScore += letterValue;
            wordMultiplier *= 3;
            break;
          default:
            mainWordScore += letterValue;
        }
      } else {
        mainWordScore += letterValue;
      }
    }
    
    mainWordScore *= wordMultiplier;

    // Find perpendicular words
    const perpDirection = dir === 'horizontal' ? 'vertical' : 'horizontal';
    const perpWords: { word: string; score: number }[] = [];
    
    for (const tile of newTiles) {
      if (!tile.isNew) continue; // Only check new tiles for perpendicular words
      
      // Find start of perpendicular word
      let perpStartRow = tile.row;
      let perpStartCol = tile.col;
      
      if (perpDirection === 'horizontal') {
        while (perpStartCol > 0 && state.board[perpStartRow][perpStartCol - 1]) {
          perpStartCol--;
        }
      } else {
        while (perpStartRow > 0 && state.board[perpStartRow - 1][perpStartCol]) {
          perpStartRow--;
        }
      }
      
      // Build perpendicular word
      const perpTiles: { letter: string; row: number; col: number; isNew: boolean }[] = [];
      let pRow = perpStartRow;
      let pCol = perpStartCol;
      
      while (pRow < BOARD_SIZE && pCol < BOARD_SIZE) {
        // Check if this is the new tile position
        if (pRow === tile.row && pCol === tile.col) {
          perpTiles.push({ ...tile });
        } else {
          const existingTile = state.board[pRow][pCol] as PlacedTile | null;
          if (!existingTile) break;
          perpTiles.push({
            letter: existingTile.letter,
            row: pRow,
            col: pCol,
            isNew: false,
          });
        }
        
        if (perpDirection === 'horizontal') {
          pCol++;
        } else {
          pRow++;
        }
      }
      
      // Only count if perpendicular word has 2+ letters
      if (perpTiles.length >= 2) {
        let perpScore = 0;
        let perpMultiplier = 1;
        
        for (const pTile of perpTiles) {
          const letterValue = isBlankTile(pTile.letter) ? 0 : (LETTER_VALUES[pTile.letter.toUpperCase()] || 0);
          
          if (pTile.isNew) {
            const multiplier = BOARD_LAYOUT[pTile.row]?.[pTile.col];
            switch (multiplier) {
              case 'DL':
                perpScore += letterValue * 2;
                break;
              case 'TL':
                perpScore += letterValue * 3;
                break;
              case 'DW':
              case 'STAR':
                perpScore += letterValue;
                perpMultiplier *= 2;
                break;
              case 'TW':
                perpScore += letterValue;
                perpMultiplier *= 3;
                break;
              default:
                perpScore += letterValue;
            }
          } else {
            perpScore += letterValue;
          }
        }
        
        perpScore *= perpMultiplier;
        const perpWord = perpTiles.map(t => t.letter.toUpperCase()).join('');
        perpWords.push({ word: perpWord, score: perpScore });
      }
    }
    
    // Calculate total
    let totalScore = mainWordScore + perpWords.reduce((sum, w) => sum + w.score, 0);
    
    // Check for bingo (7 tiles placed)
    const newTileCount = newTiles.filter(t => t.isNew).length;
    const isBingo = newTileCount === 7;
    if (isBingo) {
      totalScore += BINGO_BONUS;
    }
    
    // Build word display
    const mainWord = newTiles.map(t => t.letter.toUpperCase()).join('');
    const allWords = [mainWord, ...perpWords.map(w => w.word)];
    const wordDisplay = allWords.join(' + ');
    
    return { totalScore, wordDisplay, isBingo };
  };

  const handlePlaceWord = (word: string, direction: Direction) => {
    if (selectedSquare) {
      // Calculate score before placing
      const { totalScore, wordDisplay, isBingo } = calculatePlacedWordScore(
        word, 
        selectedSquare.row, 
        selectedSquare.col, 
        direction
      );
      
      // Place the word (adds to pending tiles)
      dispatch({
        type: 'PLACE_WORD',
        startRow: selectedSquare.row,
        startCol: selectedSquare.col,
        word,
        direction,
      });
      
      // Show bingo celebration if 7 tiles used
      if (isBingo) {
        setShowBingoCelebration(true);
      }
      
      // Immediately submit the word (commits tiles and moves to next player)
      // Use setTimeout to ensure PLACE_WORD is processed first
      setTimeout(() => {
        dispatch({
          type: 'SUBMIT_WORD',
          word: wordDisplay,
          score: totalScore,
        });
      }, 0);
      
      setSelectedSquare(null);
      setPreviewWord('');
    }
  };

  const handleClosePicker = () => {
    setSelectedSquare(null);
    setPreviewWord('');
  };

  // Callback to update preview from LetterPicker
  const handlePreviewUpdate = (word: string, direction: Direction) => {
    setPreviewWord(word);
    setPreviewDirection(direction);
  };

  const isSelectable = !!state.currentPlayerId && state.gameStarted;

  // Check if a square is in the preview path
  const getPreviewInfo = (row: number, col: number): { isPreview: boolean; letter?: string } => {
    const preview = previewSquares.find(p => p.row === row && p.col === col);
    if (preview) {
      return { isPreview: true, letter: preview.letter };
    }
    return { isPreview: false };
  };

  return (
    <div className="relative">
      {/* Bingo Celebration */}
      {showBingoCelebration && (
        <BingoConfetti onComplete={() => setShowBingoCelebration(false)} />
      )}

      {/* Board Grid */}
      <div 
        className="grid gap-0.5 sm:gap-1 p-2 sm:p-3 bg-[#1e3a5f] rounded-lg shadow-lg mx-auto"
        style={{ 
          gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
          maxWidth: '560px',
        }}
      >
        {Array.from({ length: BOARD_SIZE }).map((_, row) =>
          Array.from({ length: BOARD_SIZE }).map((_, col) => {
            const tile = state.board[row][col];
            const pendingTile = state.pendingTiles.find(t => t.row === row && t.col === col) || null;
            const { isPreview, letter: previewLetter } = getPreviewInfo(row, col);
            
            return (
              <BoardSquare
                key={`${row}-${col}`}
                row={row}
                col={col}
                tile={tile}
                pendingTile={pendingTile}
                previewLetter={previewLetter}
                isPreview={isPreview}
                onClick={() => handleSquareClick(row, col)}
                isSelectable={isSelectable}
              />
            );
          })
        )}
      </div>

      {/* Letter Picker Modal */}
      {selectedSquare && (
        <LetterPickerWithPreview
          startRow={selectedSquare.row}
          startCol={selectedSquare.col}
          board={state.board}
          onPlaceWord={handlePlaceWord}
          onClose={handleClosePicker}
          onPreviewUpdate={handlePreviewUpdate}
        />
      )}
    </div>
  );
}

// Wrapper component that passes preview updates to parent
interface LetterPickerWithPreviewProps {
  startRow: number;
  startCol: number;
  board: (unknown | null)[][];
  onPlaceWord: (word: string, direction: Direction) => void;
  onClose: () => void;
  onPreviewUpdate: (word: string, direction: Direction) => void;
}

function LetterPickerWithPreview({
  startRow,
  startCol,
  board,
  onPlaceWord,
  onClose,
  onPreviewUpdate,
}: LetterPickerWithPreviewProps) {
  return (
    <LetterPickerEnhanced
      startRow={startRow}
      startCol={startCol}
      board={board}
      onPlaceWord={onPlaceWord}
      onClose={onClose}
      onPreviewUpdate={onPreviewUpdate}
    />
  );
}

// Enhanced LetterPicker with preview callback
import { useState as useStateEnhanced, useEffect as useEffectEnhanced, useRef, useCallback, useMemo as useMemoEnhanced } from 'react';
import { ALPHABET } from '@/lib/constants';
import { usePro } from '@/context/ProContext';
import { LANGUAGE_CONFIGS } from '@/components/ProSettings';

interface LetterPickerEnhancedProps {
  startRow: number;
  startCol: number;
  board: (unknown | null)[][];
  onPlaceWord: (word: string, direction: Direction) => void;
  onClose: () => void;
  onPreviewUpdate: (word: string, direction: Direction) => void;
}

interface IntersectionInfo {
  position: number; // Index in the word
  row: number;
  col: number;
  existingLetter: string;
  expectedLetter: string;
  matches: boolean;
}

// Helper to check if a letter is a blank (lowercase = blank tile)
const isBlankTile = (letter: string) => letter === letter.toLowerCase() && letter !== letter.toUpperCase();

function LetterPickerEnhanced({ 
  startRow, 
  startCol, 
  board,
  onPlaceWord, 
  onClose,
  onPreviewUpdate,
}: LetterPickerEnhancedProps) {
  const { isPro, settings } = usePro();
  const [word, setWord] = useStateEnhanced('');
  const [direction, setDirection] = useStateEnhanced<Direction>('horizontal');
  const [showBlankPicker, setShowBlankPicker] = useStateEnhanced(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Build custom letters from selected languages
  const customLetters: Record<string, { value: number; count: number }> = useMemoEnhanced(() => {
    const letters: Record<string, { value: number; count: number }> = {};
    
    if (isPro && settings.languages && settings.languages.length > 0) {
      settings.languages.forEach(lang => {
        const config = LANGUAGE_CONFIGS[lang];
        if (config?.customLetters) {
          Object.assign(letters, config.customLetters);
        }
      });
    }
    
    // Also merge any directly stored custom letters from settings
    if (isPro && settings.customLetters) {
      Object.assign(letters, settings.customLetters);
    }
    
    return letters;
  }, [isPro, settings.languages, settings.customLetters]);
  
  const customLettersList = Object.keys(customLetters);
  const hasCustomLetters = customLettersList.length > 0;

  // Check if the board is empty (first move)
  const isBoardEmpty = useMemoEnhanced(() => {
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (board[r][c]) return false;
      }
    }
    return true;
  }, [board]);

  // Calculate available spaces in each direction
  const getAvailableSpaces = useCallback((dir: Direction): number => {
    let count = 0;
    let row = startRow;
    let col = startCol;
    
    while (row < BOARD_SIZE && col < BOARD_SIZE) {
      count++;
      if (dir === 'horizontal') {
        col++;
      } else {
        row++;
      }
    }
    return count;
  }, [startRow, startCol]);

  const horizontalSpaces = getAvailableSpaces('horizontal');
  const verticalSpaces = getAvailableSpaces('vertical');

  // Check for intersections with existing tiles
  // The word typed should match the full word including existing tiles
  const getIntersections = useCallback((inputWord: string, dir: Direction): IntersectionInfo[] => {
    const intersections: IntersectionInfo[] = [];
    let row = startRow;
    let col = startCol;
    let wordIndex = 0;
    
    // Walk through the board positions for the length of the input word
    while (wordIndex < inputWord.length && row < BOARD_SIZE && col < BOARD_SIZE) {
      const existingTile = board[row][col] as { letter: string } | null;
      
      if (existingTile) {
        // There's an existing tile here - check if the typed letter matches
        const expectedLetter = inputWord[wordIndex].toUpperCase();
        const existingLetter = existingTile.letter.toUpperCase();
        
        intersections.push({
          position: wordIndex,
          row,
          col,
          existingLetter,
          expectedLetter,
          matches: existingLetter === expectedLetter,
        });
      }
      
      wordIndex++;
      
      if (dir === 'horizontal') {
        col++;
      } else {
        row++;
      }
    }
    
    return intersections;
  }, [startRow, startCol, board]);

  // Check if the word connects to existing tiles (adjacent or through)
  const checkWordConnectsToBoard = useCallback((inputWord: string, dir: Direction): boolean => {
    if (isBoardEmpty) return true; // First word doesn't need to connect
    
    let row = startRow;
    let col = startCol;
    
    // Walk through each position the word will occupy
    for (let i = 0; i < inputWord.length; i++) {
      // Check if this position has an existing tile (intersection)
      if (board[row][col]) {
        return true; // Word goes through an existing tile
      }
      
      // Check adjacent tiles (perpendicular to word direction)
      if (dir === 'horizontal') {
        // Check above and below
        if (row > 0 && board[row - 1][col]) return true;
        if (row < BOARD_SIZE - 1 && board[row + 1][col]) return true;
      } else {
        // Check left and right
        if (col > 0 && board[row][col - 1]) return true;
        if (col < BOARD_SIZE - 1 && board[row][col + 1]) return true;
      }
      
      if (dir === 'horizontal') {
        col++;
      } else {
        row++;
      }
    }
    
    // Also check tile immediately before the word start
    if (dir === 'horizontal' && startCol > 0 && board[startRow][startCol - 1]) return true;
    if (dir === 'vertical' && startRow > 0 && board[startRow - 1][startCol]) return true;
    
    // Also check tile immediately after the word end
    const endRow = dir === 'vertical' ? startRow + inputWord.length : startRow;
    const endCol = dir === 'horizontal' ? startCol + inputWord.length : startCol;
    if (dir === 'horizontal' && endCol < BOARD_SIZE && board[startRow][endCol]) return true;
    if (dir === 'vertical' && endRow < BOARD_SIZE && board[endRow][startCol]) return true;
    
    return false;
  }, [board, startRow, startCol, isBoardEmpty]);

  // Check if first word covers the center star
  const checkFirstWordCoversCenter = useCallback((inputWord: string, dir: Direction): boolean => {
    if (!isBoardEmpty) return true; // Only applies to first word
    
    const centerRow = 7;
    const centerCol = 7;
    
    if (dir === 'horizontal') {
      // Word must be on center row and span across center column
      if (startRow !== centerRow) return false;
      const endCol = startCol + inputWord.length - 1;
      return startCol <= centerCol && endCol >= centerCol;
    } else {
      // Word must be on center column and span across center row
      if (startCol !== centerCol) return false;
      const endRow = startRow + inputWord.length - 1;
      return startRow <= centerRow && endRow >= centerRow;
    }
  }, [isBoardEmpty, startRow, startCol]);

  // Get current intersections
  const intersections = useMemoEnhanced(() => {
    return getIntersections(word, direction);
  }, [word, direction, getIntersections]);

  // Check if there are any conflicts
  const hasConflicts = intersections.some(i => !i.matches);
  const hasIntersections = intersections.length > 0;
  
  // Check connectivity rules
  const connectsToBoard = useMemoEnhanced(() => {
    if (word.length === 0) return true;
    return checkWordConnectsToBoard(word, direction);
  }, [word, direction, checkWordConnectsToBoard]);
  
  const coversCenter = useMemoEnhanced(() => {
    if (word.length === 0) return true;
    return checkFirstWordCoversCenter(word, direction);
  }, [word, direction, checkFirstWordCoversCenter]);
  
  // Combined validation
  const hasPlacementError = !connectsToBoard || !coversCenter;

  // Update preview whenever word or direction changes
  useEffectEnhanced(() => {
    onPreviewUpdate(word, direction);
  }, [word, direction, onPreviewUpdate]);

  // Focus input on mount
  useEffectEnhanced(() => {
    inputRef.current?.focus();
  }, []);

  // Close on escape key
  useEffectEnhanced(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showBlankPicker) {
          setShowBlankPicker(false);
        } else {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, showBlankPicker]);

  // Close on click outside
  useEffectEnhanced(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow uppercase letters and custom letters
    const validChars = new Set([...ALPHABET, ...customLettersList]);
    const value = e.target.value.toUpperCase();
    let filtered = '';
    for (const char of value) {
      if (validChars.has(char)) {
        filtered += char;
      }
    }
    const maxLength = direction === 'horizontal' ? horizontalSpaces : verticalSpaces;
    setWord(filtered.slice(0, maxLength));
  };

  const handleLetterClick = (letter: string) => {
    const maxLength = direction === 'horizontal' ? horizontalSpaces : verticalSpaces;
    if (word.length < maxLength) {
      setWord(prev => prev + letter);
    }
    inputRef.current?.focus();
  };

  const handleBlankTileClick = () => {
    const maxLength = direction === 'horizontal' ? horizontalSpaces : verticalSpaces;
    if (word.length < maxLength) {
      setShowBlankPicker(true);
    }
  };

  const handleBlankLetterSelect = (letter: string) => {
    // Add as lowercase to indicate it's a blank tile
    setWord(prev => prev + letter.toLowerCase());
    setShowBlankPicker(false);
    inputRef.current?.focus();
  };

  const handleBackspace = () => {
    setWord(prev => prev.slice(0, -1));
    inputRef.current?.focus();
  };

  const handleSubmit = () => {
    if (word.length > 0 && !hasConflicts && !hasPlacementError) {
      onPlaceWord(word, direction);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && word.length > 0 && !hasConflicts && !hasPlacementError) {
      handleSubmit();
    }
  };

  const handleDirectionChange = (newDirection: Direction) => {
    setDirection(newDirection);
    // Trim word if it exceeds the new direction's available spaces
    const maxLength = newDirection === 'horizontal' ? horizontalSpaces : verticalSpaces;
    if (word.length > maxLength) {
      setWord(word.slice(0, maxLength));
    }
  };

  // Get letter value (check custom letters first, then standard)
  const getLetterValue = (letter: string): number => {
    const upperLetter = letter.toUpperCase();
    if (customLetters[upperLetter]) {
      return customLetters[upperLetter].value;
    }
    return LETTER_VALUES[upperLetter] || 0;
  };

  // Calculate score preview (blank tiles = lowercase = 0 points)
  const calculatePreviewScore = (): number => {
    let score = 0;
    for (const letter of word) {
      // Lowercase letters are blank tiles worth 0 points
      if (isBlankTile(letter)) {
        score += 0;
      } else {
        score += getLetterValue(letter);
      }
    }
    return score;
  };

  const maxLength = direction === 'horizontal' ? horizontalSpaces : verticalSpaces;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-start sm:items-center justify-center z-50 p-4 pt-2 sm:pt-4">
      <div 
        ref={modalRef}
        className="bg-[#faf8f5] rounded-xl shadow-xl p-4 sm:p-5 max-w-md w-full max-h-[90vh] overflow-y-auto relative"
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold text-[#1e3a5f]">Place a Word</h3>
          <button
            onClick={onClose}
            className="text-[#1e3a5f] hover:text-[#0f1f36] text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Direction Toggle */}
        <div className="mb-3">
          <div className="flex rounded-md bg-[#e8dfd2] p-1">
            <button
              onClick={() => handleDirectionChange('horizontal')}
              className={`flex-1 py-2 px-2 rounded text-sm font-medium transition-all flex items-center justify-center gap-1
                ${direction === 'horizontal' 
                  ? 'bg-[#1e3a5f] text-[#f5f0e8]' 
                  : 'text-[#1e3a5f] hover:bg-[#d4c4a8]'
                }`}
            >
              <span>→</span>
              <span className="text-xs">({horizontalSpaces})</span>
            </button>
            <button
              onClick={() => handleDirectionChange('vertical')}
              className={`flex-1 py-2 px-2 rounded text-sm font-medium transition-all flex items-center justify-center gap-1
                ${direction === 'vertical' 
                  ? 'bg-[#1e3a5f] text-[#f5f0e8]' 
                  : 'text-[#1e3a5f] hover:bg-[#d4c4a8]'
                }`}
            >
              <span>↓</span>
              <span className="text-xs">({verticalSpaces})</span>
            </button>
          </div>
        </div>

        {/* Word Input */}
        <div className="mb-3">
          <input
            ref={inputRef}
            type="text"
            value={word}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type letters..."
            className="w-full px-3 py-2 text-lg font-bold tracking-widest text-center
              border border-[#d4c4a8] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]
              text-[#1e3a5f] bg-white uppercase"
            maxLength={maxLength}
          />
          <p className="text-xs text-[#1e3a5f] opacity-60 mt-1 text-center">
            {word.length}/{maxLength} letters
          </p>
        </div>

        {/* Word Preview */}
        {word.length > 0 && (
          <div className={`mb-3 p-2 rounded-md border ${
            hasConflicts 
              ? 'bg-red-50 border-red-300' 
              : 'bg-[#e8dfd2] border-[#d4c4a8]'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex gap-1 flex-wrap">
                {word.split('').map((letter, i) => {
                  const intersection = intersections.find(int => int.position === i);
                  const isConflict = intersection && !intersection.matches;
                  const isMatch = intersection && intersection.matches;
                  const isBlank = isBlankTile(letter);
                  
                  return (
                    <div 
                      key={i}
                      className={`w-7 h-7 rounded flex items-center justify-center
                        font-bold text-sm relative
                        ${isConflict 
                          ? 'bg-red-500 text-white' 
                          : isMatch
                            ? 'bg-[#3d5a80] text-[#f5f0e8]'
                            : isBlank
                              ? 'bg-stone-200 text-stone-700 border-2 border-dashed border-stone-400'
                              : 'bg-[#1e3a5f] text-[#f5f0e8]'
                        }`}
                    >
                      {letter.toUpperCase()}
                      <span className="absolute bottom-0 right-0.5 text-[7px] opacity-60">
                        {isBlank ? '0' : getLetterValue(letter)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="text-right ml-2">
                <div className={`text-xl font-bold ${hasConflicts ? 'text-red-600' : 'text-[#1e3a5f]'}`}>
                  +{calculatePreviewScore()}
                </div>
              </div>
            </div>
            
            {/* Conflict Warning */}
            {hasConflicts && (
              <div className="mt-2 p-2 bg-red-100 rounded text-xs text-red-700">
                ⚠️ Letter conflict - change word to match existing tiles
              </div>
            )}
            
            {/* Placement Error Warnings */}
            {!coversCenter && (
              <div className="mt-2 p-2 bg-amber-100 rounded text-xs text-amber-700">
                ⚠️ First word must cover the center star (★)
              </div>
            )}
            
            {!connectsToBoard && coversCenter && (
              <div className="mt-2 p-2 bg-amber-100 rounded text-xs text-amber-700">
                ⚠️ Word must connect to existing tiles on the board
              </div>
            )}
          </div>
        )}

        {/* Letter Grid */}
        <div className="mb-3">
          <div className="grid grid-cols-9 gap-1">
            {ALPHABET.map((letter) => (
              <button
                key={letter}
                onClick={() => handleLetterClick(letter)}
                onKeyDown={(e) => e.key === 'Enter' && word.length > 0 && !hasConflicts && !hasPlacementError && handleSubmit()}
                disabled={word.length >= maxLength}
                className="relative aspect-square flex items-center justify-center 
                  bg-[#e8dfd2] hover:bg-[#d4c4a8] disabled:opacity-40
                  text-[#1e3a5f] font-bold text-sm
                  rounded transition-all"
              >
                {letter}
                <span className="absolute bottom-0 right-0.5 text-[6px] opacity-50">
                  {LETTER_VALUES[letter]}
                </span>
              </button>
            ))}
            {/* Custom letters (German, French, Spanish, etc.) */}
            {hasCustomLetters && customLettersList.map((letter) => (
              <button
                key={letter}
                onClick={() => handleLetterClick(letter)}
                disabled={word.length >= maxLength}
                className="relative aspect-square flex items-center justify-center 
                  bg-[#1e3a5f] hover:bg-[#162d4d] disabled:opacity-40
                  text-[#f5f0e8] font-bold text-sm
                  rounded transition-all"
              >
                {letter}
                <span className="absolute bottom-0 right-0.5 text-[6px] opacity-80">
                  {customLetters[letter]?.value || 0}
                </span>
              </button>
            ))}
            {/* Blank tile button */}
            <button
              onClick={handleBlankTileClick}
              onKeyDown={(e) => e.key === 'Enter' && word.length > 0 && !hasConflicts && !hasPlacementError && handleSubmit()}
              disabled={word.length >= maxLength}
              className="relative aspect-square flex items-center justify-center 
                bg-stone-100 hover:bg-stone-200 disabled:bg-stone-50 disabled:text-stone-300
                text-stone-500 font-bold text-xs
                rounded transition-all border-2 border-dashed border-stone-400 disabled:border-stone-200"
              title="Blank tile (0 points) - click to choose letter"
            >
              ?
              <span className="absolute bottom-0 right-0.5 text-[6px] opacity-50">
                0
              </span>
            </button>
            {/* Backspace button */}
            <button
              onClick={handleBackspace}
              onKeyDown={(e) => e.key === 'Enter' && word.length > 0 && !hasConflicts && !hasPlacementError && handleSubmit()}
              disabled={word.length === 0}
              className="aspect-square flex items-center justify-center 
                bg-[#c4a882] hover:bg-[#b39872] disabled:opacity-40
                text-[#1e3a5f] font-bold text-lg rounded transition-all"
            >
              ←
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-3 bg-[#e8dfd2] hover:bg-[#d4c4a8] 
              text-[#1e3a5f] font-medium rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={word.length === 0 || hasConflicts || hasPlacementError}
            className={`flex-1 py-2 px-3 font-bold rounded-md transition-colors
              ${hasConflicts || hasPlacementError
                ? 'bg-red-200 text-red-400 cursor-not-allowed' 
                : 'bg-[#1e3a5f] hover:bg-[#162d4d] text-[#f5f0e8] disabled:opacity-40'
              }`}
          >
            {hasConflicts ? 'Fix Conflicts' : hasPlacementError ? 'Invalid Placement' : 'Place Word'}
          </button>
        </div>

        {/* Blank Tile Letter Picker Overlay */}
        {showBlankPicker && (
          <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center p-4">
            <div className="bg-[#faf8f5] rounded-lg p-4 max-w-xs w-full shadow-xl">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-[#1e3a5f]">Choose letter for blank tile</h4>
                <button
                  onClick={() => setShowBlankPicker(false)}
                  className="text-[#1e3a5f] hover:text-[#0f1f36] text-xl leading-none"
                >
                  ×
                </button>
              </div>
              <p className="text-xs text-[#1e3a5f] opacity-60 mb-3">
                Blank tiles are worth 0 points but can represent any letter.
              </p>
              <div className="grid grid-cols-9 gap-1">
                {ALPHABET.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => handleBlankLetterSelect(letter)}
                    className="aspect-square flex items-center justify-center 
                      bg-stone-100 hover:bg-stone-300 
                      text-stone-700 font-bold text-sm
                      rounded transition-all border border-stone-300"
                  >
                    {letter}
                  </button>
                ))}
                {/* Custom letters for blank tiles */}
                {hasCustomLetters && customLettersList.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => handleBlankLetterSelect(letter)}
                    className="aspect-square flex items-center justify-center 
                      bg-[#1e3a5f] hover:bg-[#162d4d] 
                      text-[#f5f0e8] font-bold text-sm
                      rounded transition-all"
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
