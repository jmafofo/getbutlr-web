// app/api/growth-planner/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { goals, niche, frequency } = await req.json();

    const prompt = `
I am a content creator in the "${niche}" niche. I want to grow by "${goals}" and can publish ${frequency} videos per week. Please give me a personalized weekly content plan with topics, posting schedule, and optimization tips.
    `.trim();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const plan = completion.choices[0]?.message.content || 'No plan generated.';
    return NextResponse.json({ plan });
  } catch (error) {
    console.error('[GROWTH PLANNER ERROR]', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
