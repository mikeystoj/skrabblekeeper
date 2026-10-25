import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { LANGUAGE_ALTERNATES } from '@/lib/seo-locales';

const absolute = (path: string) => (path === '/' ? SITE_URL : `${SITE_URL}${path}`);

// Every landing page lists all language versions (hreflang)
const languages = Object.fromEntries(
  Object.entries(LANGUAGE_ALTERNATES).map(([lang, path]) => [lang, absolute(path)])
);

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const landingPages = Object.entries(LANGUAGE_ALTERNATES)
    .filter(([lang]) => lang !== 'x-default')
    .map(([lang, path]) => ({
      url: absolute(path),
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: lang === 'en' ? 1 : 0.8,
      alternates: { languages },
    }));

  const guides = ['/how-to-score-scrabble', '/scrabble-letter-values'].map((path) => ({
    url: absolute(path),
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...landingPages, ...guides];
}
