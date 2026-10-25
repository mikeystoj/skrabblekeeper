import { SITE_URL } from './seo';

// IndexNow lets Bing (and engines that share its index, like ChatGPT search)
// recrawl pages as soon as they change. The key is public by design: it is
// served from /<key>.txt to prove we own the domain.
export const INDEXNOW_KEY = 'b468d8ba740b0a1bf81ca853196c59d4';

export async function submitToIndexNow(urls: string[]) {
  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: new URL(SITE_URL).host,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: urls,
    }),
  });

  // 200 = submitted, 202 = accepted (key still being verified)
  return { ok: response.ok, status: response.status };
}
