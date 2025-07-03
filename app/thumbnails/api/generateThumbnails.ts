
export async function POST(req: Request) {
  const { prompt } = await req.json();

  const generateMockThumbnail = (text: string, score: number) => ({
    url: `https://dummyimage.com/600x400/000/fff&text=${encodeURIComponent(text)}`,
    text,
    score,
  });

  return Response.json({
    thumbnails: [
      generateMockThumbnail(prompt + ' - Style A', 65),
      generateMockThumbnail(prompt + ' - Style B', 72),
      generateMockThumbnail(prompt + ' - Style C', 81),
    ],
  });
}
