import type { Metadata } from 'next';
import { ScoreKeeperApp } from '@/components/ScoreKeeperApp';
import { SeoContent } from '@/components/SeoContent';
import { buildJsonLd, EN_CONTENT, pageMetadata } from '@/lib/seo';
import { LANGUAGE_ALTERNATES } from '@/lib/seo-locales';

export const metadata: Metadata = pageMetadata({
  path: EN_CONTENT.path,
  title: EN_CONTENT.title,
  description: EN_CONTENT.description,
  languages: LANGUAGE_ALTERNATES,
});

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()).replace(/</g, '\\u003c') }}
      />
      <ScoreKeeperApp>
        <SeoContent />
      </ScoreKeeperApp>
    </>
  );
}
