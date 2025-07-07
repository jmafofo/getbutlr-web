// app/api/youtube/trending/route.ts

import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Missing query parameter: q' }, { status: 400 });
  }
  console.log(process.env.NEXT_PUBLIC_RAPIDAPI_KEY);
  const url = `https://youtube138.p.rapidapi.com/search/?q=${encodeURIComponent(query)}&hl=en&gl=US`;

  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY! || "77dac0e96emsh4a16f79fa5bb42ap184cd6jsn44230c17c963",
      'x-rapidapi-host': 'youtube138.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    const result = await response.json();

    const topVideos = (result.contents || [])
        .filter((item: any) => item.type === 'video')
        .slice(0, 5)
        .map((item: any) => ({
            id: item.video.videoId,
            snippet: {
            title: item.video.title,
            description: Array.isArray(item.video.descriptionSnippet)
                ? item.video.descriptionSnippet.map((d: any) => d.text).join(' ')
                : '',
            thumbnail: item.video.thumbnails?.[0]?.url,
            channelTitle: item.video.author?.title || '',
            views: item.video.stats?.views ?? 0
            }
        }));


    return NextResponse.json({ items: topVideos });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
