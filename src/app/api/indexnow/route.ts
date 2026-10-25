import { NextRequest, NextResponse } from 'next/server';
import sitemap from '@/app/sitemap';
import { submitToIndexNow } from '@/lib/indexnow';

// Called by the IndexNow GitHub Action after each production deploy.
// Submits every sitemap URL so Bing recrawls them right away.
export async function POST(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only the production site should be submitted, never preview deployments
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') {
    return NextResponse.json({ skipped: 'not production' });
  }

  const urls = sitemap().map((entry) => entry.url);

  try {
    const result = await submitToIndexNow(urls);
    console.log('IndexNow submission:', result, urls);
    return NextResponse.json({ ...result, submitted: urls.length }, { status: result.ok ? 200 : 502 });
  } catch (error) {
    console.error('IndexNow submission failed:', error);
    return NextResponse.json({ error: 'IndexNow submission failed' }, { status: 502 });
  }
}
