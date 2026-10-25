import Image from 'next/image';
import Link from 'next/link';
import { SITE_NAME, SITE_URL } from '@/lib/seo';

// Layout for static, server-rendered guide pages (no game state)
export function ArticleShell({
  path,
  title,
  children,
}: {
  path: string;
  title: string;
  children: React.ReactNode;
}) {
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: title, item: `${SITE_URL}${path}` },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col text-[#1e3a5f]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs).replace(/</g, '\\u003c') }}
      />
      <header className="py-3 px-4 sm:py-4 sm:px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" aria-label={`${SITE_NAME} home`}>
            <Image
              src="/SkrabbleKeeperLogo.svg"
              alt={SITE_NAME}
              width={280}
              height={130}
              priority
              className="h-10 sm:h-14 w-auto"
            />
          </Link>
          <Link
            href="/"
            className="py-2 px-4 bg-[#1e3a5f] hover:bg-[#162d4d] text-[#f5f0e8] text-sm font-bold rounded-lg transition-colors"
          >
            Open score keeper
          </Link>
        </div>
      </header>

      <main className="flex-1 px-4 py-6">
        <article className="max-w-2xl mx-auto space-y-6 leading-relaxed [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-2 [&_p]:text-[#1e3a5f]/80">
          {children}
        </article>

        <div className="max-w-2xl mx-auto mt-10 rounded-xl bg-[#1e3a5f] text-[#f5f0e8] p-5 text-center">
          <p className="font-bold">Skip the maths at your next game</p>
          <p className="text-sm text-[#f5f0e8]/75 mt-1">
            Skrabble Keeper scores every word, bonus square and bingo for you. Free, no sign-up.
          </p>
          <Link
            href="/"
            className="inline-block mt-3 py-2 px-5 bg-[#c4a882] hover:bg-[#b39872] text-[#1e3a5f] font-bold rounded-lg transition-colors"
          >
            Start keeping score
          </Link>
        </div>
      </main>

      <footer className="py-6 px-4 text-center text-xs text-[#1e3a5f]/50 space-y-2">
        <p>
          <Link href="/how-to-score-scrabble" className="hover:text-[#1e3a5f]">How to score Scrabble</Link>
          {' · '}
          <Link href="/scrabble-letter-values" className="hover:text-[#1e3a5f]">Scrabble letter values</Link>
          {' · '}
          <Link href="/" className="hover:text-[#1e3a5f]">Score keeper</Link>
        </p>
        <p>
          Scrabble® is a registered trademark of Hasbro, Inc. {SITE_NAME} is not affiliated with or endorsed by Hasbro.
        </p>
      </footer>
    </div>
  );
}
