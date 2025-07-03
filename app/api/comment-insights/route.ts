// app/api/comment-insights/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { commentsText } = await req.json();

    const prompt = `Analyze these YouTube comments for sentiment, viewer intent, feedback, and content suggestions:\n\n${commentsText}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
    });

    return NextResponse.json({ insights: response.choices[0]?.message.content });
  } catch (err) {
    console.error('[COMMENT INSIGHTS ERROR]', err);
    return NextResponse.json({ error: 'Failed to analyze comments' }, { status: 500 });
  }
}
