'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getSupabase } from '@/lib/supabase';

export interface ProSettings {
  wordChecker: boolean;
  dictionary: string; // 'en', 'de', 'fr', 'es'
  languages: string[]; // Multiple languages for mixed games
  customLetters: Record<string, { value: number; count: number }>;
  timerEnabled: boolean;
  timerMinutes: number; // Default turn timer in minutes
}

export interface GameHistoryEntry {
  id: string;
  playedAt: string;
  durationMinutes: number | null;
  players: {
    name: string;
    score: number;
    words: { word: string; score: number; turn: number }[];
  }[];
  winner: string | null;
  totalTurns: number | null;
  settings: ProSettings | null;
}

interface ProContextType {
  isPro: boolean;
  licenseKey: string | null;
  licenseEmail: string | null;
  settings: ProSettings;
  gameHistory: GameHistoryEntry[];
  isLoadingHistory: boolean;
  // Actions
  activatePro: (key: string, email: string) => void;
  deactivatePro: () => void;
  updateSettings: (settings: Partial<ProSettings>) => Promise<void>;
  saveGame: (gameData: Omit<GameHistoryEntry, 'id' | 'playedAt'>) => Promise<void>;
  loadGameHistory: () => Promise<void>;
}

const defaultSettings: ProSettings = {
  wordChecker: false,
  dictionary: 'en',
  languages: ['en'],
  customLetters: {},
  timerEnabled: false,
  timerMinutes: 2, // Default 2 minutes per turn
};

const ProContext = createContext<ProContextType | undefined>(undefined);

export function ProProvider({ children }: { children: ReactNode }) {
  const [isPro, setIsPro] = useState(false);
  const [licenseKey, setLicenseKey] = useState<string | null>(null);
  const [licenseEmail, setLicenseEmail] = useState<string | null>(null);
  const [settings, setSettings] = useState<ProSettings>(defaultSettings);
  const [gameHistory, setGameHistory] = useState<GameHistoryEntry[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Load Pro status from localStorage on mount
  useEffect(() => {
    const storedKey = localStorage.getItem('skrabble_pro_license');
    const storedEmail = localStorage.getItem('skrabble_pro_email');
    
    if (storedKey && storedEmail) {
      setIsPro(true);
      setLicenseKey(storedKey);
      setLicenseEmail(storedEmail);
      
      // Load settings from Supabase
      loadSettings(storedKey);
    }
  }, []);

  const loadSettings = async (key: string) => {
    try {
      const supabase = getSupabase();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('user_settings')
        .select('settings')
        .eq('license_key', key)
        .single();

      if (!error && data?.settings) {
        setSettings({ ...defaultSettings, ...data.settings });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const activatePro = (key: string, email: string) => {
    localStorage.setItem('skrabble_pro_license', key);
    localStorage.setItem('skrabble_pro_email', email);
    setIsPro(true);
    setLicenseKey(key);
    setLicenseEmail(email);
    loadSettings(key);
  };

  const deactivatePro = () => {
    localStorage.removeItem('skrabble_pro_license');
    localStorage.removeItem('skrabble_pro_email');
    setIsPro(false);
    setLicenseKey(null);
    setLicenseEmail(null);
    setSettings(defaultSettings);
    setGameHistory([]);
  };

  const updateSettings = async (newSettings: Partial<ProSettings>) => {
    if (!licenseKey) return;

    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);

    try {
      const supabase = getSupabase();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('user_settings')
        .upsert({
          license_key: licenseKey,
          settings: updatedSettings,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'license_key',
        });

      if (error) {
        console.error('Failed to save settings:', error);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const saveGame = async (gameData: Omit<GameHistoryEntry, 'id' | 'playedAt'>) => {
    if (!licenseKey) return;

    try {
      const supabase = getSupabase();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('games')
        .insert({
          license_key: licenseKey,
          duration_minutes: gameData.durationMinutes,
          players: gameData.players,
          winner: gameData.winner,
          total_turns: gameData.totalTurns,
          settings: gameData.settings,
        });

      if (error) {
        console.error('Failed to save game:', error);
      } else {
        // Refresh history
        loadGameHistory();
      }
    } catch (error) {
      console.error('Failed to save game:', error);
    }
  };

  const loadGameHistory = useCallback(async () => {
    if (!licenseKey) return;

    setIsLoadingHistory(true);
    try {
      const supabase = getSupabase();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('games')
        .select('*')
        .eq('license_key', licenseKey)
        .order('played_at', { ascending: false })
        .limit(50);

      if (!error && data) {
        const history: GameHistoryEntry[] = data.map((game: {
          id: string;
          played_at: string;
          duration_minutes: number | null;
          players: GameHistoryEntry['players'];
          winner: string | null;
          total_turns: number | null;
          settings: ProSettings | null;
        }) => ({
          id: game.id,
          playedAt: game.played_at,
          durationMinutes: game.duration_minutes,
          players: game.players,
          winner: game.winner,
          totalTurns: game.total_turns,
          settings: game.settings,
        }));
        setGameHistory(history);
      }
    } catch (error) {
      console.error('Failed to load game history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [licenseKey]);

  return (
    <ProContext.Provider
      value={{
        isPro,
        licenseKey,
        licenseEmail,
        settings,
        gameHistory,
        isLoadingHistory,
        activatePro,
        deactivatePro,
        updateSettings,
        saveGame,
        loadGameHistory,
      }}
    >
      {children}
    </ProContext.Provider>
  );
}

export function usePro() {
  const context = useContext(ProContext);
  if (context === undefined) {
    throw new Error('usePro must be used within a ProProvider');
  }
  return context;
}

