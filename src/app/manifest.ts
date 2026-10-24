import type { MetadataRoute } from 'next';
import { SITE_NAME } from '@/lib/seo';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} - Scrabble Score Keeper`,
    short_name: 'Skrabble',
    description: 'Free Scrabble score keeper with an interactive board view',
    start_url: '/',
    display: 'standalone',
    background_color: '#f5f0e8',
    theme_color: '#1e3a5f',
    orientation: 'portrait',
    categories: ['games', 'utilities'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
