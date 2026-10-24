import { LETTER_VALUES, BINGO_BONUS, MAX_PLAYERS } from './constants';
import { PRICE_AMOUNT, CURRENCY } from './stripe';

// Canonical origin - the apex domain redirects here
export const SITE_URL = 'https://www.skrabblekeeper.com';
export const SITE_NAME = 'Skrabble Keeper';
export const SITE_DESCRIPTION =
  `Free Scrabble score keeper and calculator. Tap words onto an interactive board and Skrabble Keeper adds up letter values, premium squares and the ${BINGO_BONUS}-point bingo for up to ${MAX_PLAYERS} players. No sign-up, works on any phone, tablet or computer.`;

export const PRO_PRICE = (PRICE_AMOUNT / 100).toFixed(2);
export const PRO_CURRENCY = CURRENCY.toUpperCase();

// Letters grouped by point value, e.g. [[1, ['A','E',...]], [2, ['D','G']], ...]
export const LETTERS_BY_VALUE: [number, string[]][] = Object.entries(
  Object.entries(LETTER_VALUES).reduce<Record<number, string[]>>((groups, [letter, value]) => {
    (groups[value] ||= []).push(letter);
    return groups;
  }, {})
)
  .map(([value, letters]) => [Number(value), letters] as [number, string[]])
  .sort((a, b) => a[0] - b[0]);

const letterValuesSentence = LETTERS_BY_VALUE
  .map(([value, letters]) => `${letters.join(', ')} = ${value} point${value === 1 ? '' : 's'}`)
  .join('; ');

export const FAQS: { question: string; answer: string }[] = [
  {
    question: 'How do you keep score in Scrabble?',
    answer: `Add up the face value of every letter in each word you make, apply any premium squares the new tiles cover, and add the total to your running score. Skrabble Keeper does this for you: tap the first square, type the word, choose across or down, and the score is calculated and added to that player's total.`,
  },
  {
    question: 'How much is each letter worth in Scrabble?',
    answer: `In the standard English set: ${letterValuesSentence}. Blank tiles are worth 0 points.`,
  },
  {
    question: 'How do premium squares work in Scrabble?',
    answer: 'Double Letter and Triple Letter squares multiply the value of the tile placed on them. Double Word and Triple Word squares multiply the whole word, after letter bonuses are applied. The centre star counts as a Double Word square. Premium squares only count on the turn a tile is first placed on them.',
  },
  {
    question: 'What is a bingo in Scrabble?',
    answer: `A bingo is when a player uses all seven tiles from their rack in a single turn. It earns a ${BINGO_BONUS}-point bonus on top of the word score.`,
  },
  {
    question: 'Is Skrabble Keeper free?',
    answer: `Yes. Score keeping, the interactive board and word history are free with no account needed. Keeper Pro is an optional one-time purchase of ${PRO_CURRENCY} $${PRO_PRICE} that adds dictionary word checking, game history and stats, word suggestions, extra language letter sets and a turn timer.`,
  },
  {
    question: 'How many players can Skrabble Keeper track?',
    answer: `Skrabble Keeper tracks scores for up to ${MAX_PLAYERS} players, with each player's words and points listed turn by turn.`,
  },
  {
    question: 'Does Skrabble Keeper work on my phone?',
    answer: 'Yes. It runs in any modern browser on iPhone, Android, tablets and computers. Add it to your home screen and it opens like an app. Your game is saved in your browser, so refreshing the page will not lose your scores.',
  },
  {
    question: 'Can I use Skrabble Keeper with other languages?',
    answer: 'The app is available in English, German, French, Spanish and Italian. Keeper Pro adds German, French and Spanish letter sets and dictionaries.',
  },
];

export function buildJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/icon-512.png`,
        sameAs: ['https://x.com/skrabblekeeper'],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: 'en',
      },
      {
        '@type': 'WebApplication',
        '@id': `${SITE_URL}/#app`,
        name: SITE_NAME,
        alternateName: ['Scrabble Score Keeper', 'Scrabble Score Calculator', 'Scrabble Scorer'],
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        applicationCategory: 'GameApplication',
        operatingSystem: 'Any (web browser)',
        browserRequirements: 'Requires JavaScript',
        image: `${SITE_URL}/opengraph-image.png`,
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: ['en', 'de', 'fr', 'es', 'it'],
        featureList: [
          'Automatic Scrabble score calculation',
          'Interactive 15x15 board with premium squares',
          `Score tracking for up to ${MAX_PLAYERS} players`,
          `Automatic ${BINGO_BONUS}-point bingo bonus`,
          'Word history per player',
          'Dictionary word checker (Pro)',
          'Game history and stats (Pro)',
          'Turn timer (Pro)',
        ],
        offers: [
          {
            '@type': 'Offer',
            name: 'Free',
            price: '0',
            priceCurrency: PRO_CURRENCY,
          },
          {
            '@type': 'Offer',
            name: 'Keeper Pro (lifetime)',
            price: PRO_PRICE,
            priceCurrency: PRO_CURRENCY,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE_URL}/#faq`,
        mainEntity: FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
    ],
  };
}
