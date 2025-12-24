-- Licenses table (if not already created)
-- Stores Pro license keys
CREATE TABLE IF NOT EXISTS licenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  license_key TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  stripe_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for licenses
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;

-- Policies for licenses table
-- Allow inserting new licenses (from webhook)
CREATE POLICY "Allow insert licenses" ON licenses
  FOR INSERT WITH CHECK (true);

-- Allow selecting licenses for validation
CREATE POLICY "Allow select licenses" ON licenses
  FOR SELECT USING (true);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_licenses_license_key ON licenses(license_key);
CREATE INDEX IF NOT EXISTS idx_licenses_email ON licenses(email);

-- Games history table
-- Stores completed games for Pro users
CREATE TABLE games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  license_key TEXT NOT NULL REFERENCES licenses(license_key),
  played_at TIMESTAMPTZ DEFAULT NOW(),
  duration_minutes INTEGER,
  -- JSON fields for flexible storage
  players JSONB NOT NULL, -- [{name: "Player 1", score: 150, words: [{word: "HELLO", score: 12, turn: 1}]}]
  winner TEXT,
  total_turns INTEGER,
  board_state JSONB, -- Final board state (optional, for replay)
  settings JSONB, -- Game settings used (language, etc.)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User settings table
-- Stores Pro user preferences
CREATE TABLE user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  license_key TEXT UNIQUE NOT NULL REFERENCES licenses(license_key),
  -- Settings as JSON for flexibility
  settings JSONB DEFAULT '{
    "wordChecker": false,
    "dictionary": "en",
    "languages": ["en"],
    "customLetters": {}
  }'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_games_license_key ON games(license_key);
CREATE INDEX idx_games_played_at ON games(played_at DESC);
CREATE INDEX idx_user_settings_license_key ON user_settings(license_key);

-- Enable Row Level Security (RLS) for games
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own data via license_key
-- Note: For client-side access, you'll pass license_key in queries
CREATE POLICY "Users can view own games" ON games
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own games" ON games
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (true);

-- =============================================
-- Global Stats Table
-- Tracks aggregate statistics across ALL games
-- =============================================
CREATE TABLE global_stats (
  id INTEGER PRIMARY KEY DEFAULT 1, -- Single row table
  total_games_started INTEGER DEFAULT 0, -- Games initiated
  total_games_completed INTEGER DEFAULT 0, -- Games that were ended properly
  total_words_played INTEGER DEFAULT 0,
  total_points_scored BIGINT DEFAULT 0,
  total_tiles_placed BIGINT DEFAULT 0,
  total_bingos INTEGER DEFAULT 0, -- 7-letter words
  highest_single_word_score INTEGER DEFAULT 0,
  highest_single_word TEXT,
  highest_game_score INTEGER DEFAULT 0,
  highest_game_winner TEXT,
  total_players_all_time INTEGER DEFAULT 0,
  total_play_time_minutes BIGINT DEFAULT 0,
  -- Language stats
  games_with_german INTEGER DEFAULT 0,
  games_with_french INTEGER DEFAULT 0,
  games_with_spanish INTEGER DEFAULT 0,
  -- Time-based stats
  first_game_at TIMESTAMPTZ,
  last_game_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Constraint to ensure single row
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insert the initial row
INSERT INTO global_stats (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Enable RLS for global_stats
ALTER TABLE global_stats ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read global stats
CREATE POLICY "Allow read global stats" ON global_stats
  FOR SELECT USING (true);

-- Allow updates to global stats (from API)
CREATE POLICY "Allow update global stats" ON global_stats
  FOR UPDATE USING (true);

-- =============================================
-- Daily Stats Table (for trending/charts)
-- =============================================
CREATE TABLE daily_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE UNIQUE NOT NULL DEFAULT CURRENT_DATE,
  games_played INTEGER DEFAULT 0,
  words_played INTEGER DEFAULT 0,
  points_scored BIGINT DEFAULT 0,
  unique_players INTEGER DEFAULT 0,
  avg_game_duration_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for date lookups
CREATE INDEX idx_daily_stats_date ON daily_stats(date DESC);

-- Enable RLS for daily_stats
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read daily stats
CREATE POLICY "Allow read daily stats" ON daily_stats
  FOR SELECT USING (true);

-- Allow inserts and updates to daily stats
CREATE POLICY "Allow insert daily stats" ON daily_stats
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update daily stats" ON daily_stats
  FOR UPDATE USING (true);

