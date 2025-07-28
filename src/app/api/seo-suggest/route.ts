import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getTrendingKeywords } from '../../../lib/keywordUtils';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { title, description } = await req.json();

  // 1. Fetch trending keywords relevant to the input
  const trends = await getTrendingKeywords(title);

  // 2. Prompt OpenAI to refine title/description with keywords
  const prompt = `
You are a YouTube SEO assistant. Optimize the title and description based on trending YouTube keywords:
Trending: ${trends.join(', ')}

Title: ${title}
Description: ${description}

Respond JSON:
{"title": "...", "description": "...", "tags": ["t1","t2",...]}
`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
  });
  const optimized = JSON.parse(completion.choices[0].message.content);

  return NextResponse.json(optimized);
}

