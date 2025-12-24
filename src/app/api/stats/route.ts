import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

// GET - Retrieve global stats
export async function GET() {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('global_stats')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) {
      console.error('Failed to fetch global stats:', error);
      return NextResponse.json(
        { error: 'Failed to fetch stats' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Increment game started counter
export async function PATCH() {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    // Get current stats
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: currentStats, error: fetchError } = await (supabase as any)
      .from('global_stats')
      .select('total_games_started, first_game_at')
      .eq('id', 1)
      .single();

    if (fetchError) {
      console.error('Failed to fetch current stats:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }

    const updates: Record<string, unknown> = {
      total_games_started: (currentStats?.total_games_started || 0) + 1,
      updated_at: new Date().toISOString(),
    };

    // Set first_game_at if not already set
    if (!currentStats?.first_game_at) {
      updates.first_game_at = new Date().toISOString();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase as any)
      .from('global_stats')
      .update(updates)
      .eq('id', 1);

    if (updateError) {
      console.error('Failed to update game started count:', updateError);
      return NextResponse.json({ error: 'Failed to update stats' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Stats PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Update global stats after a game
export async function POST(request: NextRequest) {
  try {
    const gameData = await request.json();
    const supabase = getSupabase();

    // Calculate stats from the game
    const {
      players,
      durationMinutes,
      totalTurns,
      settings,
    } = gameData;

    // Calculate totals from this game
    let totalWordsThisGame = 0;
    let totalPointsThisGame = 0;
    let highestWordScoreThisGame = 0;
    let highestWordThisGame = '';
    let highestPlayerScore = 0;
    let highestPlayerName = '';
    let totalTilesThisGame = 0;
    let bingosThisGame = 0;

    for (const player of players || []) {
      totalPointsThisGame += player.score || 0;
      
      if (player.score > highestPlayerScore) {
        highestPlayerScore = player.score;
        highestPlayerName = player.name;
      }

      for (const word of player.words || []) {
        totalWordsThisGame++;
        
        // Estimate tiles from word length (rough approximation)
        const wordLength = word.word?.replace(/[^A-ZÄÖÜßÉÈÊËÀÂÎÏÔÙÛÇŒÑÁÍÓÚ]/gi, '').length || 0;
        totalTilesThisGame += wordLength;
        
        // Check for bingo (7+ letters in a single word entry)
        if (wordLength >= 7) {
          bingosThisGame++;
        }

        if (word.score > highestWordScoreThisGame) {
          highestWordScoreThisGame = word.score;
          highestWordThisGame = word.word;
        }
      }
    }

    // Check language settings
    const languages = settings?.languages || ['en'];
    const hasGerman = languages.includes('de');
    const hasFrench = languages.includes('fr');
    const hasSpanish = languages.includes('es');

    // Get current global stats
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: currentStats, error: fetchError } = await (supabase as any)
      .from('global_stats')
      .select('*')
      .eq('id', 1)
      .single();

    if (fetchError) {
      console.error('Failed to fetch current stats:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch current stats' },
        { status: 500 }
      );
    }

    // Prepare updated stats
    const updatedStats: Record<string, unknown> = {
      total_games_completed: (currentStats?.total_games_completed || 0) + 1,
      total_words_played: (currentStats?.total_words_played || 0) + totalWordsThisGame,
      total_points_scored: (currentStats?.total_points_scored || 0) + totalPointsThisGame,
      total_tiles_placed: (currentStats?.total_tiles_placed || 0) + totalTilesThisGame,
      total_bingos: (currentStats?.total_bingos || 0) + bingosThisGame,
      total_players_all_time: (currentStats?.total_players_all_time || 0) + (players?.length || 0),
      total_play_time_minutes: (currentStats?.total_play_time_minutes || 0) + (durationMinutes || 0),
      last_game_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Update first_game_at if not set
    if (!currentStats?.first_game_at) {
      updatedStats.first_game_at = new Date().toISOString();
    }

    // Update highest word score if beaten
    if (highestWordScoreThisGame > (currentStats?.highest_single_word_score || 0)) {
      updatedStats.highest_single_word_score = highestWordScoreThisGame;
      updatedStats.highest_single_word = highestWordThisGame;
    }

    // Update highest game score if beaten
    if (highestPlayerScore > (currentStats?.highest_game_score || 0)) {
      updatedStats.highest_game_score = highestPlayerScore;
      updatedStats.highest_game_winner = highestPlayerName;
    }

    // Update language counters
    if (hasGerman) {
      updatedStats.games_with_german = (currentStats?.games_with_german || 0) + 1;
    }
    if (hasFrench) {
      updatedStats.games_with_french = (currentStats?.games_with_french || 0) + 1;
    }
    if (hasSpanish) {
      updatedStats.games_with_spanish = (currentStats?.games_with_spanish || 0) + 1;
    }

    // Update global stats
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase as any)
      .from('global_stats')
      .update(updatedStats)
      .eq('id', 1);

    if (updateError) {
      console.error('Failed to update global stats:', updateError);
      return NextResponse.json(
        { error: 'Failed to update stats' },
        { status: 500 }
      );
    }

    // Also update daily stats
    const today = new Date().toISOString().split('T')[0];
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: dailyData, error: dailyFetchError } = await (supabase as any)
      .from('daily_stats')
      .select('*')
      .eq('date', today)
      .single();

    if (dailyFetchError && dailyFetchError.code !== 'PGRST116') {
      // PGRST116 = no rows returned, which is fine
      console.error('Failed to fetch daily stats:', dailyFetchError);
    }

    if (dailyData) {
      // Update existing daily stats
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('daily_stats')
        .update({
          games_played: (dailyData.games_played || 0) + 1,
          words_played: (dailyData.words_played || 0) + totalWordsThisGame,
          points_scored: (dailyData.points_scored || 0) + totalPointsThisGame,
          unique_players: (dailyData.unique_players || 0) + (players?.length || 0),
          updated_at: new Date().toISOString(),
        })
        .eq('date', today);
    } else {
      // Insert new daily stats row
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('daily_stats')
        .insert({
          date: today,
          games_played: 1,
          words_played: totalWordsThisGame,
          points_scored: totalPointsThisGame,
          unique_players: players?.length || 0,
          avg_game_duration_minutes: durationMinutes || 0,
        });
    }

    return NextResponse.json({ 
      success: true, 
      stats: updatedStats 
    });
  } catch (error) {
    console.error('Stats update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

