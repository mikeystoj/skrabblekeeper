import { NextResponse } from 'next/server';

const RAPIDAPI_HOST = 'english-word-finder-anagram-api-poocoo-app.p.rapidapi.com';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const word = searchParams.get('word');

    if (!word) {
      return NextResponse.json({ error: 'Word parameter is required' }, { status: 400 });
    }

    const apiKey = process.env.RAPIDAPI_KEY;
    if (!apiKey) {
      console.error('RAPIDAPI_KEY is not set');
      return NextResponse.json({ error: 'Word checker not configured' }, { status: 500 });
    }

    // Search for the exact word
    const response = await fetch(
      `https://${RAPIDAPI_HOST}/api/v1/words?page=1&pageSize=10&contains=${encodeURIComponent(word.toLowerCase())}&length=${word.length}`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': RAPIDAPI_HOST,
        },
      }
    );

    if (!response.ok) {
      console.error('RapidAPI error:', response.status, response.statusText);
      return NextResponse.json({ error: 'Word check failed' }, { status: 500 });
    }

    const data = await response.json();
    
    // Check if the exact word is in the results
    const words = data.data?.words || [];
    const wordLower = word.toLowerCase();
    const isValid = words.some((w: string) => w.toLowerCase() === wordLower);

    return NextResponse.json({
      word: word.toUpperCase(),
      isValid,
      suggestions: isValid ? [] : words.slice(0, 5), // Show suggestions if word not found
    });
  } catch (error) {
    console.error('Error checking word:', error);
    return NextResponse.json({ error: 'Failed to check word' }, { status: 500 });
  }
}

