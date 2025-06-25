import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST() {
  // Simulated audio input
  const simulatedTranscript = `Today I want to show you the one trick that changed how I grow my audience. It's fast, free, and you can start right now. Let's get into it.`;

  const prompt = `Rewrite this raw voice transcription into a structured and engaging YouTube script:
"""
${simulatedTranscript}
"""`;

  const chatResponse = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are an expert YouTube scriptwriter helping creators polish their spoken thoughts.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7
  });

  const polishedScript = chatResponse.choices[0].message.content || simulatedTranscript;

  return NextResponse.json({ transcript: polishedScript });
}

