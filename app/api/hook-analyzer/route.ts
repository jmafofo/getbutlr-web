// app/api/hook-analyzer/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { hookText } = await req.json();

    const prompt = `
Analyze this YouTube hook for effectiveness. Comment on emotional appeal, curiosity, pacing, and strength of opening:
"${hookText}"
Also, suggest 3 improved hooks.
    `.trim();

    const result = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    return NextResponse.json({ analysis: result.choices[0]?.message.content });
  } catch (err) {
    console.error('[HOOK ANALYZER ERROR]', err);
    return NextResponse.json({ error: 'Hook analysis failed' }, { status: 500 });
  }
}
