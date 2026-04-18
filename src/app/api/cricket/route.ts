import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_CRICKET_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json(
      { status: 'error', info: 'Cricket API key not configured' },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `https://api.cricketdata.org/v1/currentMatches?apikey=${apiKey}&offset=0`,
      { next: { revalidate: 120 } } // Cache for 2 minutes server-side
    );

    if (!res.ok) {
      return NextResponse.json(
        { status: 'error', info: `Upstream returned ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Cricket API proxy error:', err);
    return NextResponse.json(
      { status: 'error', info: 'Failed to reach cricket API' },
      { status: 502 }
    );
  }
}
