// app/api/voice-to-script/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { transcript } = await req.json();

    if (!transcript || transcript.length < 5) {
      return NextResponse.json({ error: 'Transcript too short.' }, { status: 400 });
    }

    const prompt = `Turn this into a clear, structured YouTube video script:\n\n"${transcript}"`;
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const generatedScript = completion.choices[0]?.message.content || 'No script generated.';
    return NextResponse.json({ script: generatedScript });
  } catch (error) {
    console.error('[VOICE-TO-SCRIPT ERROR]', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
