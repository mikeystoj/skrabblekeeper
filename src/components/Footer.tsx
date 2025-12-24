'use client';

export function Footer() {
  const funnyPhrases = [
    "Warning: May cause heated family arguments",
    "Triple word scores won't fix your marriage",
    "Scrabble: Where 'QI' is a real word and 'ZYZZYVA' is a flex",
    "Side effects include: dictionary addiction",
    "Making up words since 1938... wait, that's not allowed",
  ];

  // Pick a random phrase on each render (client-side only)
  const randomPhrase = funnyPhrases[Math.floor(Math.random() * funnyPhrases.length)];

  return (
    <footer className="py-6 px-4 mt-8">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-[#1e3a5f]/40 text-xs italic mb-2">
          {randomPhrase}
        </p>
        <p className="text-[#1e3a5f]/40 text-xs">
          Made by{' '}
          <span className="font-bold text-[#1e3a5f]/60 hover:text-[#1e3a5f] transition-colors cursor-pointer">
            Mayke
          </span>
          {' '}• © {new Date().getFullYear()} Skrabble Keeper • Not affiliated with Scrabble® or Hasbro®
        </p>
      </div>
    </footer>
  );
}

