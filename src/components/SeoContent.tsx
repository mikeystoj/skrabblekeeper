import { BINGO_BONUS, MAX_PLAYERS } from '@/lib/constants';
import { FAQS, LETTERS_BY_VALUE } from '@/lib/seo';

// Server-rendered About / How-to / FAQ section. Gives search engines and
// AI answer engines real text to index, since the app itself renders client-side.
export function SeoContent() {
  return (
    <section className="px-4 pt-10 pb-4 text-[#1e3a5f]" aria-labelledby="about-heading">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 id="about-heading" className="text-2xl sm:text-3xl font-bold">
            Free Scrabble Score Keeper &amp; Calculator
          </h1>
          <p className="mt-3 text-[#1e3a5f]/70 leading-relaxed">
            Skrabble Keeper is a free score keeper for your Scrabble® board game. Place each word on an
            interactive board and it adds up letter values, premium squares and the {BINGO_BONUS}-point
            bingo for up to {MAX_PLAYERS} players. No pen, no paper, no sign-up.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-3">How to keep score with Skrabble Keeper</h2>
          <ol className="list-decimal pl-5 space-y-1.5 text-[#1e3a5f]/80">
            <li>Add up to {MAX_PLAYERS} player names and start the game.</li>
            <li>Tap the square where the first letter of your word goes.</li>
            <li>Type the word and choose across or down.</li>
            <li>The score is calculated with every bonus square and added to your total.</li>
            <li>Switch to the Scores view to see each player&apos;s words and running totals.</li>
          </ol>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-3">Scrabble letter values</h2>
          <div className="overflow-hidden rounded-xl border border-[#1e3a5f]/15">
            <table className="w-full text-sm">
              <thead className="bg-[#1e3a5f] text-[#f5f0e8]">
                <tr>
                  <th scope="col" className="text-left px-3 py-2 w-20">Points</th>
                  <th scope="col" className="text-left px-3 py-2">Letters</th>
                </tr>
              </thead>
              <tbody>
                {LETTERS_BY_VALUE.map(([value, letters]) => (
                  <tr key={value} className="border-t border-[#1e3a5f]/10">
                    <td className="px-3 py-2 font-bold">{value}</td>
                    <td className="px-3 py-2 tracking-wide">{letters.join(' ')}</td>
                  </tr>
                ))}
                <tr className="border-t border-[#1e3a5f]/10">
                  <td className="px-3 py-2 font-bold">0</td>
                  <td className="px-3 py-2">Blank tile</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-3">Frequently asked questions</h2>
          <div className="space-y-2">
            {FAQS.map((faq) => (
              <details key={faq.question} className="group rounded-xl bg-white/50 border border-[#1e3a5f]/10 px-4 py-3">
                <summary className="cursor-pointer font-semibold list-none flex justify-between gap-4">
                  {faq.question}
                  <span className="text-[#1e3a5f]/40 group-open:rotate-45 transition-transform" aria-hidden>+</span>
                </summary>
                <p className="mt-2 text-sm text-[#1e3a5f]/75 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>

        <p className="text-xs text-center text-[#1e3a5f]/40">
          Scrabble® is a registered trademark of Hasbro, Inc. Skrabble Keeper is not affiliated with or endorsed by Hasbro.
        </p>
      </div>
    </section>
  );
}
