'use client';

import { BOARD_LAYOUT, MULTIPLIER_COLORS, LETTER_VALUES } from '@/lib/constants';
import { PlacedTile } from '@/lib/types';
import { usePro } from '@/context/ProContext';
import { LANGUAGE_CONFIGS } from '@/components/ProSettings';
import { useMemo } from 'react';

// Helper to check if a letter is a blank tile (lowercase = blank)
const isBlankTile = (letter: string) => letter === letter.toLowerCase() && letter !== letter.toUpperCase();

interface BoardSquareProps {
  row: number;
  col: number;
  tile: PlacedTile | null;
  pendingTile: PlacedTile | null;
  previewLetter?: string;
  isPreview?: boolean;
  onClick: () => void;
  isSelectable: boolean;
}

export function BoardSquare({ 
  row, 
  col, 
  tile, 
  pendingTile,
  previewLetter,
  isPreview = false,
  onClick, 
  isSelectable 
}: BoardSquareProps) {
  const { isPro, settings } = usePro();
  const multiplier = BOARD_LAYOUT[row][col];
  const colors = (multiplier && MULTIPLIER_COLORS[multiplier]) || MULTIPLIER_COLORS['default'];
  
  const displayTile = tile || pendingTile;
  const isPending = !!pendingTile;
  
  // Check if the tile is a blank (lowercase letter)
  const tileIsBlank = displayTile ? isBlankTile(displayTile.letter) : false;
  const previewIsBlank = previewLetter ? isBlankTile(previewLetter) : false;
  
  // Build custom letters from selected languages
  const customLetters = useMemo(() => {
    const letters: Record<string, { value: number; count: number }> = {};
    
    if (isPro && settings.languages && settings.languages.length > 0) {
      settings.languages.forEach(lang => {
        const config = LANGUAGE_CONFIGS[lang];
        if (config?.customLetters) {
          Object.assign(letters, config.customLetters);
        }
      });
    }
    
    if (isPro && settings.customLetters) {
      Object.assign(letters, settings.customLetters);
    }
    
    return letters;
  }, [isPro, settings.languages, settings.customLetters]);

  // Get letter value (check custom letters first, then standard)
  const getLetterValue = (letter: string): number => {
    const upperLetter = letter.toUpperCase();
    if (customLetters[upperLetter]) {
      return customLetters[upperLetter].value;
    }
    return LETTER_VALUES[upperLetter] || 0;
  };
  
  // Get letter value for display (blank tiles = 0)
  const letterValue = displayTile 
    ? (tileIsBlank ? 0 : getLetterValue(displayTile.letter))
    : previewLetter 
      ? (previewIsBlank ? 0 : getLetterValue(previewLetter))
      : 0;

  // Determine background styling
  const getBackgroundClass = () => {
    if (displayTile) {
      if (tileIsBlank) {
        // Blank tiles have a distinct appearance with dashed border
        return isPending
          ? 'bg-stone-200 text-stone-700 shadow-md scale-105'
          : 'bg-stone-100 text-stone-600 shadow-sm';
      }
      return isPending
        ? 'bg-[#faf8f5] text-[#1e3a5f] ring-2 ring-[#1e3a5f] shadow-md scale-105'
        : 'bg-[#f5f0e8] text-[#1e3a5f] shadow-sm';
    }
    if (isPreview && previewLetter) {
      if (previewIsBlank) {
        return 'bg-stone-200 text-stone-600 shadow-sm';
      }
      return 'bg-[#e8dfd2] text-[#1e3a5f] ring-1 ring-[#1e3a5f] shadow-sm';
    }
    if (isPreview) {
      return 'bg-[#d4c4a8]/50 ring-1 ring-[#1e3a5f]/50';
    }
    return `${colors.bg} ${colors.text}`;
  };
  
  // Get border class - blank tiles get dashed border
  const getBorderClass = () => {
    if (tileIsBlank || previewIsBlank) {
      return 'border-2 border-dashed border-stone-500';
    }
    return 'border border-[#1e3a5f]/20';
  };

  return (
    <button
      onClick={onClick}
      disabled={!isSelectable || !!tile}
      className={`
        relative w-full aspect-square flex items-center justify-center
        text-xs font-bold rounded-sm transition-all duration-150
        ${getBackgroundClass()}
        ${isSelectable && !tile 
          ? 'hover:brightness-110 hover:scale-105 cursor-pointer' 
          : tile 
            ? 'cursor-default' 
            : 'cursor-not-allowed opacity-70'
        }
        ${getBorderClass()}
      `}
    >
      {displayTile ? (
        <>
          <span className="text-sm sm:text-base font-bold">
            {displayTile.letter.toUpperCase()}
          </span>
          <span className="absolute bottom-0.5 right-0.5 text-[8px] sm:text-[10px] font-medium opacity-70">
            {letterValue}
          </span>
        </>
      ) : previewLetter ? (
        <>
          <span className="text-sm sm:text-base font-bold opacity-90">
            {previewLetter.toUpperCase()}
          </span>
          <span className="absolute bottom-0.5 right-0.5 text-[8px] sm:text-[10px] font-medium opacity-50">
            {letterValue}
          </span>
        </>
      ) : (
        <span className="text-[8px] sm:text-[10px] opacity-60">
          {colors.label}
        </span>
      )}
    </button>
  );
}
