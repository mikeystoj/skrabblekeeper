import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ScoreKeeperApp } from '@/components/ScoreKeeperApp';
import { SeoContent } from '@/components/SeoContent';
import { buildJsonLd, pageMetadata } from '@/lib/seo';
import { LANGUAGE_ALTERNATES, LOCALIZED_CONTENT, LOCALIZED_LANGS, LocalizedLang } from '@/lib/seo-locales';

// Only the localized landing pages exist; anything else is a 404
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALIZED_LANGS.map((lang) => ({ lang }));
}

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const content = LOCALIZED_CONTENT[lang as LocalizedLang];
  if (!content) return {};

  const locales: Record<LocalizedLang, string> = { de: 'de_DE', fr: 'fr_FR', es: 'es_ES', it: 'it_IT' };
  return pageMetadata({
    path: content.path,
    title: content.title,
    description: content.description,
    locale: locales[lang as LocalizedLang],
    languages: LANGUAGE_ALTERNATES,
  });
}

export default async function LocalizedHome({ params }: Props) {
  const { lang } = await params;
  const content = LOCALIZED_CONTENT[lang as LocalizedLang];
  if (!content) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(content)).replace(/</g, '\\u003c') }}
      />
      <ScoreKeeperApp>
        <SeoContent content={content} />
      </ScoreKeeperApp>
    </>
  );
}
