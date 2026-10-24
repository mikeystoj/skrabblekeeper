import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleShell } from '@/components/ArticleShell';
import { FaqList } from '@/components/SeoContent';
import { buildFaqJsonLd, pageMetadata } from '@/lib/seo';
import { BINGO_BONUS } from '@/lib/constants';

const PATH = '/how-to-score-scrabble';
const TITLE = 'How to Score Scrabble: Rules, Bonus Squares and Examples';
const DESCRIPTION =
  'Learn how Scrabble scoring works: letter values, Double and Triple Letter and Word squares, the 50-point bingo, blank tiles and end-of-game scoring, with worked examples.';

const FAQS = [
  {
    question: 'Do you add or multiply bonus squares first in Scrabble?',
    answer: 'Apply letter bonuses (Double and Triple Letter) first, add up the word, then apply word bonuses (Double and Triple Word).',
  },
  {
    question: 'What happens if a word covers two Double Word squares?',
    answer: 'The word score is doubled twice, so it is multiplied by 4. Two Triple Word squares multiply the word by 9.',
  },
  {
    question: 'Do premium squares count again on later turns?',
    answer: 'No. A premium square only counts on the turn a tile is first placed on it. Later words that use that tile score its face value only.',
  },
  {
    question: 'How is the end of a Scrabble game scored?',
    answer: 'Each player subtracts the value of their unplayed tiles from their score. If a player used all their tiles, they add the total of everyone else\'s unplayed tiles to their score.',
  },
];

export const metadata: Metadata = pageMetadata({ path: PATH, title: TITLE, description: DESCRIPTION });

export default function HowToScorePage() {
  return (
    <ArticleShell path={PATH} title={TITLE}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd(PATH, FAQS)).replace(/</g, '\\u003c') }}
      />
      <h1 className="text-2xl sm:text-3xl font-bold">{TITLE}</h1>
      <p>
        A Scrabble score is the sum of the letter values in each word you make, adjusted by any premium squares
        your new tiles cover. Here is how each rule works, with examples.
      </p>

      <h2>1. Add up the letter values</h2>
      <p>
        Each tile shows its point value. Add the values of every letter in the word. See the full{' '}
        <Link href="/scrabble-letter-values" className="underline underline-offset-2">Scrabble letter values chart</Link>.
      </p>

      <h2>2. Apply letter bonuses</h2>
      <p>
        A Double Letter square doubles the tile placed on it, and a Triple Letter square triples it. Only the
        tile on that square is affected.
      </p>

      <h2>3. Apply word bonuses</h2>
      <p>
        After letter bonuses, a Double Word square doubles the whole word and a Triple Word square triples it.
        The centre star counts as a Double Word square. If a word covers two word squares, both apply: two
        Double Words multiply the word by 4, and two Triple Words by 9.
      </p>

      <h2>4. Count every new word</h2>
      <p>
        If your tiles form more than one word, score each word and add them together. Bonus squares count for
        every word that runs through a newly placed tile. Tiles already on the board score their face value only.
      </p>

      <h2>5. Add the bingo bonus</h2>
      <p>Using all seven tiles from your rack in one turn adds {BINGO_BONUS} points on top of the word score.</p>

      <h2>6. Blank tiles</h2>
      <p>A blank can be any letter but is worth 0 points, even on a Double or Triple Letter square.</p>

      <h2>7. End of the game</h2>
      <p>
        When the game ends, each player subtracts the value of the tiles left on their rack. A player who has
        used all their tiles adds the total of everyone else&apos;s remaining tiles.
      </p>

      <h2>Worked examples</h2>
      <ul className="list-disc pl-5 space-y-2 text-[#1e3a5f]/80">
        <li>
          <strong>QUIZ, no bonuses:</strong> Q (10) + U (1) + I (1) + Z (10) = <strong>22 points</strong>.
        </li>
        <li>
          <strong>QUIZ with Z on a Triple Letter:</strong> 10 + 1 + 1 + (10 × 3) = <strong>42 points</strong>.
        </li>
        <li>
          <strong>QUIZ on a Double Word:</strong> 22 × 2 = <strong>44 points</strong>.
        </li>
        <li>
          <strong>RETAINS on a Double Word, all seven tiles:</strong> (7 × 2) + {BINGO_BONUS} ={' '}
          <strong>{7 * 2 + BINGO_BONUS} points</strong>.
        </li>
      </ul>

      <FaqList heading="Scoring questions" faqs={FAQS} />
    </ArticleShell>
  );
}
