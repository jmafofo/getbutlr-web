// app/api/seo-checklist/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { title, description, tags } = await req.json();

    const prompt = `
Review this YouTube video metadata and provide an SEO checklist with suggestions:
Title: "${title}"
Description: "${description}"
Tags: ${tags.join(', ')}
    `.trim();

    const result = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
    });

    return NextResponse.json({ checklist: result.choices[0]?.message.content });
  } catch (err) {
    console.error('[SEO CHECKLIST ERROR]', err);
    return NextResponse.json({ error: 'SEO analysis failed' }, { status: 500 });
  }
}
