import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

// Runs daily via Vercel Cron (see vercel.json). Each run recomputes the current
// and previous week so the previous week is finalised after Sunday's games, and
// the daily query keeps the Supabase project from pausing due to inactivity.

const DAY_MS = 24 * 60 * 60 * 1000;

// Monday (UTC) of the week containing `date`, as YYYY-MM-DD
function weekStart(date: Date): string {
  const day = date.getUTCDay(); // 0 = Sunday
  const diff = (day + 6) % 7; // days since Monday
  const monday = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - diff * DAY_MS);
  return monday.toISOString().split('T')[0];
}

function addDays(isoDate: string, days: number): string {
  return new Date(new Date(`${isoDate}T00:00:00Z`).getTime() + days * DAY_MS).toISOString().split('T')[0];
}

async function rollupWeek(start: string) {
  const supabase = getSupabase();
  const end = addDays(start, 7);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;

  const [daily, proGames, newLicenses, totalLicenses, global] = await Promise.all([
    db.from('daily_stats').select('games_played, words_played, points_scored, unique_players').gte('date', start).lt('date', end),
    db.from('games').select('id', { count: 'exact', head: true }).gte('played_at', start).lt('played_at', end),
    db.from('licenses').select('id', { count: 'exact', head: true }).gte('created_at', start).lt('created_at', end),
    db.from('licenses').select('id', { count: 'exact', head: true }),
    db.from('global_stats').select('total_games_started, total_games_completed').eq('id', 1).single(),
  ]);

  for (const result of [daily, proGames, newLicenses, totalLicenses, global]) {
    if (result.error) throw result.error;
  }

  const days: { games_played: number; words_played: number; points_scored: number; unique_players: number }[] = daily.data || [];

  const row = {
    week_start: start,
    games_played: days.reduce((sum, d) => sum + (d.games_played || 0), 0),
    words_played: days.reduce((sum, d) => sum + (d.words_played || 0), 0),
    points_scored: days.reduce((sum, d) => sum + (d.points_scored || 0), 0),
    unique_players: days.reduce((sum, d) => sum + (d.unique_players || 0), 0),
    active_days: days.filter((d) => (d.games_played || 0) > 0).length,
    pro_games_saved: proGames.count || 0,
    new_licenses: newLicenses.count || 0,
    total_licenses: totalLicenses.count || 0,
    total_games_started: global.data?.total_games_started || 0,
    total_games_completed: global.data?.total_games_completed || 0,
    updated_at: new Date().toISOString(),
  };

  const { error } = await db.from('weekly_stats').upsert(row, { onConflict: 'week_start' });
  if (error) throw error;

  return row;
}

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const thisWeek = weekStart(new Date());
    const lastWeek = addDays(thisWeek, -7);

    const weeks = [await rollupWeek(lastWeek), await rollupWeek(thisWeek)];
    console.log('Weekly stats rolled up:', weeks);

    return NextResponse.json({ success: true, weeks });
  } catch (error) {
    console.error('Weekly stats rollup failed:', error);
    return NextResponse.json({ error: 'Failed to roll up weekly stats' }, { status: 500 });
  }
}
