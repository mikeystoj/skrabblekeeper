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

