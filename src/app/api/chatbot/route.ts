import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  // 1. Retrieve top matching FAQs (semantic or exact)
  const { data: faqs } = await supabase
    .from('support_faqs')
    .select('question, answer')
    .ilike('question', `%${message}%`)
    .limit(3);

  // 2. Build prompt with context + user message
  let prompt = `You are a friendly AI assistant. Use the FAQs below to help the user.\n\n`;
  if (faqs) {
    faqs.forEach((f, i) => {
      prompt += `FAQ ${i + 1}:\nQ: ${f.question}\nA: ${f.answer}\n\n`;
    });
  }
  prompt += `User: ${message}\nAI:`;

  // 3. Call OpenAI for conversational help
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  // 4. Return the assistant’s reply
  return NextResponse.json({ reply: completion.choices[0].message.content });
}

