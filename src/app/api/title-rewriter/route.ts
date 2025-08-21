import { NextRequest, NextResponse } from 'next/server';
import { callOllama } from '../ollama_query/route';

export async function POST(req: NextRequest) {
  try {
    const { title } = await req.json();

    const prompt = `
Rewrite the following YouTube video title into 5 high-CTR, emotional or curiosity-driven alternatives.
Be bold, but not clickbait. Return them as a plain numbered list and strickly return titles only!.

Original Title: "${title}"
`;

    const rawResult = await callOllama(prompt);

    // Clean + split into an array of titles
    const rewrites = rawResult
      .split('\n')
      .map((line) => line.replace(/^[-*\d.\s]+/, '').trim()) // strip bullets/numbers
      .filter(Boolean);

    return NextResponse.json({ rewrites });
  } catch (error) {
    console.error('Error in /api/title-rewriter:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
