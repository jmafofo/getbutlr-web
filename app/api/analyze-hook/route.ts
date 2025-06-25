import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { hook } = await req.json();

  const prompt = `Analyze the following YouTube video hook for punchiness, clarity, and engagement. Return:
1. A score from 0–100
2. Feedback paragraph
3. Three actionable improvement suggestions

Hook:
"""
${hook}
"""`;

  const chatResponse = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a video content optimization expert helping creators improve their hooks.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7
  });

  const response = chatResponse.choices[0].message.content || '';
  const [scoreLine, feedback, ...suggestionsRaw] = response.split('\n').filter(Boolean);
  const score = parseInt(scoreLine.match(/\d+/)?.[0] || '0', 10);
  const suggestions = suggestionsRaw.map(line => line.replace(/^[-\d.\)]\s*/, ''));

  return NextResponse.json({ score, feedback, suggestions });
}

