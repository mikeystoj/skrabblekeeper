'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ALPHABET, LETTER_VALUES, BOARD_SIZE } from '@/lib/constants';
import { Direction } from '@/lib/types';

interface LetterPickerProps {
  startRow: number;
  startCol: number;
  board: (unknown | null)[][];
  onPlaceWord: (word: string, direction: Direction) => void;
  onClose: () => void;
}

export function LetterPicker({ 
  startRow, 
  startCol, 
  board,
  onPlaceWord, 
  onClose 
}: LetterPickerProps) {
  const [word, setWord] = useState('');
  const [direction, setDirection] = useState<Direction>('horizontal');
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Calculate available spaces in each direction
  const getAvailableSpaces = useCallback((dir: Direction): number => {
    let count = 0;
    let row = startRow;
    let col = startCol;
    
    while (row < BOARD_SIZE && col < BOARD_SIZE) {
      // Count empty squares and squares with existing tiles (for extending words)
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

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
    const maxLength = direction === 'horizontal' ? horizontalSpaces : verticalSpaces;
    setWord(value.slice(0, maxLength));
  };

  const handleLetterClick = (letter: string) => {
    const maxLength = direction === 'horizontal' ? horizontalSpaces : verticalSpaces;
    if (word.length < maxLength) {
      setWord(prev => prev + letter);
    }
    inputRef.current?.focus();
  };

  const handleBackspace = () => {
    setWord(prev => prev.slice(0, -1));
    inputRef.current?.focus();
  };

  const handleSubmit = () => {
    if (word.length > 0) {
      onPlaceWord(word, direction);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && word.length > 0) {
      handleSubmit();
    }
  };

  // Calculate score preview
  const calculatePreviewScore = (): number => {
    let score = 0;
    for (const letter of word) {
      score += LETTER_VALUES[letter] || 0;
    }
    return score;
  };

  const maxLength = direction === 'horizontal' ? horizontalSpaces : verticalSpaces;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Place a Word</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Direction Toggle */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600 block mb-2">Direction</label>
          <div className="flex rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setDirection('horizontal')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2
                ${direction === 'horizontal' 
                  ? 'bg-white shadow text-emerald-600' 
                  : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              <span>→</span>
              <span>Horizontal</span>
              <span className="text-xs text-gray-400">({horizontalSpaces} spaces)</span>
            </button>
            <button
              onClick={() => setDirection('vertical')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2
                ${direction === 'vertical' 
                  ? 'bg-white shadow text-emerald-600' 
                  : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              <span>↓</span>
              <span>Vertical</span>
              <span className="text-xs text-gray-400">({verticalSpaces} spaces)</span>
            </button>
          </div>
        </div>

        {/* Word Input */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600 block mb-2">
            Type your word ({word.length}/{maxLength} letters)
          </label>
          <input
            ref={inputRef}
            type="text"
            value={word}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type letters..."
            className="w-full px-4 py-3 text-xl font-bold tracking-widest text-center
              border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500
              text-gray-800 uppercase"
            maxLength={maxLength}
          />
        </div>

        {/* Word Preview */}
        {word.length > 0 && (
          <div className="mb-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {word.split('').map((letter, i) => (
                  <div 
                    key={i}
                    className="w-8 h-8 bg-emerald-400 rounded flex items-center justify-center
                      text-emerald-900 font-bold text-sm shadow-sm relative"
                  >
                    {letter}
                    <span className="absolute bottom-0 right-0.5 text-[8px] opacity-60">
                      {LETTER_VALUES[letter]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="text-right">
                <div className="text-xs text-emerald-600">Base Score</div>
                <div className="text-xl font-bold text-emerald-700">+{calculatePreviewScore()}</div>
              </div>
            </div>
            <p className="text-xs text-emerald-600 mt-2">
              * Final score will include board multipliers
            </p>
          </div>
        )}

        {/* Letter Grid */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600 block mb-2">
            Or click letters below
          </label>
          <div className="grid grid-cols-9 gap-1.5">
            {ALPHABET.map((letter) => (
              <button
                key={letter}
                onClick={() => handleLetterClick(letter)}
                disabled={word.length >= maxLength}
                className="relative aspect-square flex items-center justify-center 
                  bg-amber-100 hover:bg-amber-300 disabled:bg-gray-100 disabled:text-gray-400
                  text-amber-900 font-bold text-sm
                  rounded-md transition-all duration-150 hover:scale-105 shadow-sm
                  border border-amber-300 disabled:border-gray-200"
              >
                {letter}
                <span className="absolute bottom-0 right-0.5 text-[7px] opacity-60">
                  {LETTER_VALUES[letter]}
                </span>
              </button>
            ))}
            {/* Backspace button */}
            <button
              onClick={handleBackspace}
              disabled={word.length === 0}
              className="aspect-square flex items-center justify-center 
                bg-red-100 hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400
                text-red-700 font-bold text-lg
                rounded-md transition-all duration-150 shadow-sm
                border border-red-300 disabled:border-gray-200"
            >
              ←
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 
              text-gray-700 font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={word.length === 0}
            className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 
              disabled:bg-gray-300 disabled:text-gray-400
              text-white font-bold rounded-lg transition-colors"
          >
            Place Word
          </button>
        </div>
      </div>
    </div>
  );
}
