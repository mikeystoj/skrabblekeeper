import Link from 'next/link';
import { EN_CONTENT, LandingContent, LETTERS_BY_VALUE } from '@/lib/seo';

// Server-rendered About / How-to / FAQ section. Gives search engines and
// AI answer engines real text to index, since the app itself renders client-side.
export function SeoContent({ content = EN_CONTENT }: { content?: LandingContent }) {
  const isEnglish = content.lang === 'en';

  return (
    <section lang={content.lang} className="px-4 pt-10 pb-4 text-[#1e3a5f]" aria-labelledby="about-heading">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 id="about-heading" className="text-2xl sm:text-3xl font-bold">
            {content.heading}
          </h1>
          <p className="mt-3 text-[#1e3a5f]/70 leading-relaxed">{content.intro}</p>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-3">{content.howToHeading}</h2>
          <ol className="list-decimal pl-5 space-y-1.5 text-[#1e3a5f]/80">
            {content.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        {isEnglish && <LetterValuesTable />}

        <FaqList heading={content.faqHeading} faqs={content.faqs} />

        {isEnglish && (
          <p className="text-sm text-center">
            Learn more:{' '}
            <Link href="/how-to-score-scrabble" className="underline underline-offset-2">How to score Scrabble</Link>
            {' · '}
            <Link href="/scrabble-letter-values" className="underline underline-offset-2">Scrabble letter values</Link>
          </p>
        )}

        <p className="text-xs text-center text-[#1e3a5f]/40">{content.trademark}</p>
      </div>
    </section>
  );
}

export function LetterValuesTable({ heading = 'Scrabble letter values' }: { heading?: string }) {
  return (
    <div>
      <h2 className="text-lg font-bold mb-3">{heading}</h2>
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
  );
}

export function FaqList({ heading, faqs }: { heading: string; faqs: LandingContent['faqs'] }) {
  return (
    <div>
      <h2 className="text-lg font-bold mb-3">{heading}</h2>
      <div className="space-y-2">
        {faqs.map((faq) => (
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
  );
}
