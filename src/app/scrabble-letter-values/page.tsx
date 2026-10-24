import type { Metadata } from 'next';
import { ArticleShell } from '@/components/ArticleShell';
import { FaqList, LetterValuesTable } from '@/components/SeoContent';
import { buildFaqJsonLd, pageMetadata } from '@/lib/seo';
import { TILE_SETS, TileSetId } from '@/lib/tileSets';

// Letters grouped by points for one edition, e.g. "1: A E I ... · 2: D G"
function valueGroups(id: TileSetId): [number, string[]][] {
  const groups: Record<number, string[]> = {};
  for (const letter of TILE_SETS[id].letters) {
    (groups[TILE_SETS[id].values[letter]] ||= []).push(letter);
  }
  return Object.entries(groups)
    .map(([points, letters]) => [Number(points), letters] as [number, string[]])
    .sort((a, b) => a[0] - b[0]);
}

const OTHER_EDITIONS: TileSetId[] = ['de', 'fr', 'es', 'it'];

const PATH = '/scrabble-letter-values';
const TITLE = 'Scrabble Letter Values: Points for Every Tile';
const DESCRIPTION =
  'How many points is each letter worth in Scrabble? Letter values and tile counts for the English, German, French, Spanish and Italian editions, with tips on scoring the high-value letters.';

// Standard English Scrabble tile distribution (100 tiles including 2 blanks)
const TILE_COUNTS: [string, number][] = [
  ['A', 9], ['B', 2], ['C', 2], ['D', 4], ['E', 12], ['F', 2], ['G', 3], ['H', 2], ['I', 9],
  ['J', 1], ['K', 1], ['L', 4], ['M', 2], ['N', 6], ['O', 8], ['P', 2], ['Q', 1], ['R', 6],
  ['S', 4], ['T', 6], ['U', 4], ['V', 2], ['W', 2], ['X', 1], ['Y', 2], ['Z', 1], ['Blank', 2],
];

const FAQS = [
  {
    question: 'What letters are worth 10 points in Scrabble?',
    answer: 'Q and Z are worth 10 points each, the highest of any tile in the English set.',
  },
  {
    question: 'How many tiles are in a Scrabble set?',
    answer: 'An English Scrabble set has 100 tiles: 98 letters and 2 blank tiles.',
  },
  {
    question: 'How much is a blank tile worth?',
    answer: 'A blank tile is worth 0 points. It can stand for any letter, but premium letter squares under a blank still score nothing.',
  },
  {
    question: 'What is the most common letter in Scrabble?',
    answer: 'E is the most common tile, with 12 in the set, followed by A and I with 9 each.',
  },
];

export const metadata: Metadata = pageMetadata({ path: PATH, title: TITLE, description: DESCRIPTION });

export default function LetterValuesPage() {
  return (
    <ArticleShell path={PATH} title={TITLE}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd(PATH, FAQS)).replace(/</g, '\\u003c') }}
      />
      <h1 className="text-2xl sm:text-3xl font-bold">{TITLE}</h1>
      <p>
        Every Scrabble tile has a point value printed on it. Common letters like E, A and S are worth 1 point,
        while rare letters like Q and Z are worth 10. Here are the values for the standard English set.
      </p>

      <LetterValuesTable heading="Letter values chart" />

      <h2>Tile distribution</h2>
      <p>How many of each tile come in a standard 100-tile English set:</p>
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 text-sm">
        {TILE_COUNTS.map(([letter, count]) => (
          <div key={letter} className="rounded-lg border border-[#1e3a5f]/15 bg-white/50 px-2 py-1.5 text-center">
            <span className="font-bold">{letter}</span> <span className="text-[#1e3a5f]/60">×{count}</span>
          </div>
        ))}
      </div>

      <h2>Letter values in other languages</h2>
      <p>
        Each language edition has its own letter values and tile counts. The board and the 50-point bingo are
        the same everywhere. Skrabble Keeper scores with whichever edition you choose when you start a game.
      </p>
      <div className="space-y-3">
        {OTHER_EDITIONS.map((id) => (
          <div key={id} className="rounded-xl border border-[#1e3a5f]/15 bg-white/50 px-4 py-3">
            <h3 className="font-bold">
              <span aria-hidden>{TILE_SETS[id].flag}</span> {TILE_SETS[id].name} Scrabble ({TILE_SETS[id].nativeName})
            </h3>
            <ul className="mt-1 text-sm text-[#1e3a5f]/80 space-y-0.5">
              {valueGroups(id).map(([points, letters]) => (
                <li key={points}>
                  <strong>{points} {points === 1 ? 'point' : 'points'}:</strong> {letters.join(', ')}
                </li>
              ))}
            </ul>
            {id === 'es' && (
              <p className="mt-1 text-xs text-[#1e3a5f]/60">
                The Spanish set also has CH (5), LL (8) and RR (8) double-letter tiles.
              </p>
            )}
          </div>
        ))}
      </div>

      <h2>Getting the most from high-value letters</h2>
      <p>
        A letter&apos;s value is multiplied by Double Letter and Triple Letter squares, and the whole word is then
        multiplied by Double Word and Triple Word squares. Placing a Z on a Triple Letter square turns 10 points
        into 30 before any word bonus is applied.
      </p>
      <p>
        Short words with high-value letters, such as QI, ZA, JO and XU, are worth learning because they fit into
        tight spots next to bonus squares.
      </p>

      <FaqList heading="Letter value questions" faqs={FAQS} />
    </ArticleShell>
  );
}
