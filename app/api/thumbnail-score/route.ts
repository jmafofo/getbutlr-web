import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { user_id, video_id, thumbnail_url } = await req.json();

  const prompt = `
You are an expert YouTube thumbnail evaluator.
Evaluate the following thumbnail URL: ${thumbnail_url}
Provide a score from 0 to 100 and written feedback based on:
1. Clarity and composition,
2. Emotional engagement,
3. Text readability,
4. Brand consistency.

Response format:
{"score": <integer>, "feedback": "<your feedback>"}
`;

  const resp = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
  });

  const result = JSON.parse(resp.choices[0].message.content);

  await supabase.from('thumbnail_scores').insert({
    user_id, video_id, thumbnail_url, score: result.score, feedback: result.feedback
  });

  return NextResponse.json(result);
}

