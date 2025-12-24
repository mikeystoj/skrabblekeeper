'use client';

import { useState } from 'react';
import { usePro } from '@/context/ProContext';

// Language configurations with custom letter sets
const LANGUAGE_CONFIGS: Record<string, {
  name: string;
  flag: string;
  customLetters?: Record<string, { value: number; count: number }>;
}> = {
  en: { name: 'English', flag: '🇬🇧' },
  de: { 
    name: 'German', 
    flag: '🇩🇪',
    customLetters: {
      'Ä': { value: 6, count: 1 },
      'Ö': { value: 8, count: 1 },
      'Ü': { value: 6, count: 1 },
      'ß': { value: 10, count: 1 },
    }
  },
  fr: { 
    name: 'French', 
    flag: '🇫🇷',
    customLetters: {
      'É': { value: 2, count: 2 },
      'È': { value: 4, count: 1 },
      'Ê': { value: 4, count: 1 },
      'Ë': { value: 4, count: 1 },
      'À': { value: 4, count: 1 },
      'Â': { value: 4, count: 1 },
      'Î': { value: 4, count: 1 },
      'Ï': { value: 4, count: 1 },
      'Ô': { value: 4, count: 1 },
      'Ù': { value: 4, count: 1 },
      'Û': { value: 4, count: 1 },
      'Ç': { value: 4, count: 1 },
      'Œ': { value: 10, count: 1 },
    }
  },
  es: { 
    name: 'Spanish', 
    flag: '🇪🇸',
    customLetters: {
      'Ñ': { value: 8, count: 1 },
      'Á': { value: 4, count: 1 },
      'É': { value: 4, count: 1 },
      'Í': { value: 4, count: 1 },
      'Ó': { value: 4, count: 1 },
      'Ú': { value: 4, count: 1 },
      'Ü': { value: 6, count: 1 },
    }
  },
};

interface ProSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProSettings({ isOpen, onClose }: ProSettingsProps) {
  const { settings, updateSettings, isPro } = usePro();
  const [isSaving, setIsSaving] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    
    // Merge custom letters from selected languages
    const customLetters: Record<string, { value: number; count: number }> = {};
    localSettings.languages.forEach(lang => {
      const config = LANGUAGE_CONFIGS[lang];
      if (config?.customLetters) {
        Object.assign(customLetters, config.customLetters);
      }
    });

    await updateSettings({
      ...localSettings,
      customLetters,
    });
    
    setIsSaving(false);
    onClose();
  };

  const toggleLanguage = (lang: string) => {
    const current = localSettings.languages;
    if (current.includes(lang)) {
      // Don't allow removing the last language
      if (current.length > 1) {
        setLocalSettings({
          ...localSettings,
          languages: current.filter(l => l !== lang),
          dictionary: current.filter(l => l !== lang)[0], // Set primary to first remaining
        });
      }
    } else {
      setLocalSettings({
        ...localSettings,
        languages: [...current, lang],
      });
    }
  };

  const setPrimaryLanguage = (lang: string) => {
    setLocalSettings({
      ...localSettings,
      dictionary: lang,
    });
  };

  if (!isPro) {
    return (
      <div 
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <div 
          className="bg-[#faf8f5] rounded-xl shadow-xl max-w-md w-full p-6 text-center"
          onClick={e => e.stopPropagation()}
        >
          <p className="text-[#1e3a5f]">Pro features require an active license.</p>
          <button
            onClick={onClose}
            className="mt-4 py-2 px-4 bg-[#1e3a5f] text-[#f5f0e8] rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#faf8f5] rounded-xl shadow-xl max-w-md w-full overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1e3a5f] px-5 py-4 sticky top-0">
          <h2 className="text-lg font-bold text-[#f5f0e8]">Pro Settings</h2>
          <p className="text-[#f5f0e8]/70 text-sm">Customize your game experience</p>
        </div>

        <div className="p-5 space-y-6">
          {/* Turn Timer Toggle */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-medium text-[#1e3a5f]">Turn Timer</h3>
                <p className="text-sm text-[#1e3a5f]/60">
                  Set a time limit for each turn
                </p>
              </div>
              <button
                onClick={() => setLocalSettings({ ...localSettings, timerEnabled: !localSettings.timerEnabled })}
                className={`w-12 h-7 rounded-full transition-colors relative ${
                  localSettings.timerEnabled ? 'bg-[#1e3a5f]' : 'bg-[#d4c4a8]'
                }`}
              >
                <span 
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    localSettings.timerEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            {localSettings.timerEnabled && (
              <div className="flex items-center gap-3 bg-[#f5f0e8] rounded-lg p-3">
                <span className="text-sm text-[#1e3a5f]">Minutes per turn:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLocalSettings({ 
                      ...localSettings, 
                      timerMinutes: Math.max(1, (localSettings.timerMinutes || 2) - 1) 
                    })}
                    className="w-8 h-8 rounded-lg bg-[#e8dfd2] hover:bg-[#d4c4a8] 
                      text-[#1e3a5f] font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold text-[#1e3a5f]">
                    {localSettings.timerMinutes || 2}
                  </span>
                  <button
                    onClick={() => setLocalSettings({ 
                      ...localSettings, 
                      timerMinutes: Math.min(10, (localSettings.timerMinutes || 2) + 1) 
                    })}
                    className="w-8 h-8 rounded-lg bg-[#e8dfd2] hover:bg-[#d4c4a8] 
                      text-[#1e3a5f] font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Word Checker Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-[#1e3a5f]">Word Checker</h3>
              <p className="text-sm text-[#1e3a5f]/60">
                Validate words against the dictionary
              </p>
            </div>
            <button
              onClick={() => setLocalSettings({ ...localSettings, wordChecker: !localSettings.wordChecker })}
              className={`w-12 h-7 rounded-full transition-colors relative ${
                localSettings.wordChecker ? 'bg-[#1e3a5f]' : 'bg-[#d4c4a8]'
              }`}
            >
              <span 
                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  localSettings.wordChecker ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Language Selection */}
          <div>
            <h3 className="font-medium text-[#1e3a5f] mb-2">Languages</h3>
            <p className="text-sm text-[#1e3a5f]/60 mb-3">
              Select languages for mixed-language games. Custom letters will be added.
            </p>
            
            <div className="space-y-2">
              {Object.entries(LANGUAGE_CONFIGS).map(([code, config]) => (
                <div 
                  key={code}
                  className={`flex items-center justify-between p-3 rounded-lg border-2 transition-colors ${
                    localSettings.languages.includes(code)
                      ? 'border-[#1e3a5f] bg-[#1e3a5f]/5'
                      : 'border-[#e8dfd2] hover:border-[#d4c4a8]'
                  }`}
                >
                  <button
                    onClick={() => toggleLanguage(code)}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    <span className="text-xl">{config.flag}</span>
                    <div>
                      <span className="font-medium text-[#1e3a5f]">{config.name}</span>
                      {config.customLetters && (
                        <p className="text-xs text-[#1e3a5f]/50">
                          +{Object.keys(config.customLetters).join(', ')}
                        </p>
                      )}
                    </div>
                  </button>
                  
                  {localSettings.languages.includes(code) && (
                    <button
                      onClick={() => setPrimaryLanguage(code)}
                      className={`text-xs px-2 py-1 rounded ${
                        localSettings.dictionary === code
                          ? 'bg-[#1e3a5f] text-[#f5f0e8]'
                          : 'bg-[#e8dfd2] text-[#1e3a5f] hover:bg-[#d4c4a8]'
                      }`}
                    >
                      {localSettings.dictionary === code ? 'Primary' : 'Set Primary'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Custom Letters Preview */}
          {localSettings.languages.some(l => LANGUAGE_CONFIGS[l]?.customLetters) && (
            <div>
              <h3 className="font-medium text-[#1e3a5f] mb-2">Active Custom Letters</h3>
              <div className="flex flex-wrap gap-2">
                {localSettings.languages.map(lang => {
                  const config = LANGUAGE_CONFIGS[lang];
                  if (!config?.customLetters) return null;
                  return Object.entries(config.customLetters).map(([letter, data]) => (
                    <div 
                      key={`${lang}-${letter}`}
                      className="flex items-center gap-1 px-2 py-1 bg-[#e8dfd2] rounded text-sm"
                    >
                      <span className="font-bold text-[#1e3a5f]">{letter}</span>
                      <span className="text-[#1e3a5f]/50 text-xs">({data.value}pts)</span>
                    </div>
                  ));
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 space-y-2 sticky bottom-0 bg-[#faf8f5]">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-2.5 px-4 bg-[#1e3a5f] hover:bg-[#162d4d] 
              text-[#f5f0e8] font-bold rounded-lg transition-colors
              disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 px-4 text-[#1e3a5f]/50 hover:text-[#1e3a5f] 
              text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

