'use client';

import { useMemo } from 'react';
import { useGame } from '@/context/GameContext';
import { usePro } from '@/context/ProContext';
import { LANGUAGE_CONFIGS } from '@/components/ProSettings';
import { resolveTileSet } from '@/lib/tileSets';
import { getLetterValue } from '@/lib/scoring';

/**
 * Letter values for the current game: the game's tile set (edition), plus any
 * extra letters Pro users mix in from Pro Settings. Extras never override the
 * edition's own values.
 */
export function useLetterValues() {
  const { state } = useGame();
  const { isPro, settings } = usePro();
  const tileSet = resolveTileSet(state.tileSet);

  return useMemo(() => {
    const extras: Record<string, number> = {};

    if (isPro) {
      for (const lang of settings.languages || []) {
        for (const [letter, data] of Object.entries(LANGUAGE_CONFIGS[lang]?.customLetters || {})) {
          extras[letter] = data.value;
        }
      }
      for (const [letter, data] of Object.entries(settings.customLetters || {})) {
        extras[letter] = data.value;
      }
    }

    const extraLetters = Object.keys(extras).filter((letter) => !(letter in tileSet.values));
    const values: Record<string, number> = { ...extras, ...tileSet.values };

    return {
      tileSet,
      values,
      baseLetters: tileSet.letters,
      extraLetters,
      getValue: (letter: string) => getLetterValue(letter, values),
    };
  }, [tileSet, isPro, settings.languages, settings.customLetters]);
}
