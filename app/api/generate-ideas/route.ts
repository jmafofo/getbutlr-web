import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { niche } = await req.json();

  const prompt = `You are an expert in viral video content. Given the niche "${niche}", do the following:
1. Summarize what top-performing videos in this niche are doing to succeed.
2. Suggest 3 viral video ideas.
3. Extract 5 keywords or themes.
4. Outline common structure or content patterns that lead to growth.`;

  const chatResponse = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are an AI tool analyzing YouTube niche performance and helping creators generate winning ideas.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7
  });

  const content = chatResponse.choices[0].message.content || '';
  const [summary, ideasBlock, keywordsBlock, structureBlock] = content.split(/\n\n+/);

  const ideas = (ideasBlock?.match(/\d+\.\s.+/g) || []).map(line => line.replace(/^\d+\.\s/, ''));
  const keywords = (keywordsBlock?.match(/-\s.+/g) || []).map(line => line.replace(/-\s/, ''));
  const structure = (structureBlock?.match(/-\s.+/g) || []).map(line => line.replace(/-\s/, ''));

  return NextResponse.json({
    summary: summary.replace(/^\d+\.\s*/, ''),
    ideas,
    keywords,
    structure
  });
}

