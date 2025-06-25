import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { commentsText } = await req.json();

  const prompt = `Analyze the following YouTube comments. Provide:

1. Sentiment Summary
2. List of recurring requests or suggestions (as bullet points)
3. Estimate of toxic/negative comment count

Format your reply like:
Sentiment: [your analysis]
Requests:
- ...
- ...
Toxic Comments: [number]

Comments:
"""
${commentsText}
"""`;

  try {
    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a comment analysis assistant trained to summarize feedback and detect toxicity.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.6
    });

    const content = chatResponse.choices[0].message.content || '';
    const blocks = content.split(/\n\n+/);

    if (blocks.length < 3) {
      return NextResponse.json({
        sentiment: 'Unable to analyze sentiment.',
        requests: [],
        toxicCount: 0
      });
    }

    const [sentimentBlock, requestBlock, toxicBlock] = blocks;
    const sentiment = sentimentBlock.replace(/^Sentiment:\s*/, '').trim();
    const requests = (requestBlock?.match(/-\s.+/g) || []).map(line => line.replace(/-\s/, ''));
    const toxicCount = parseInt(toxicBlock.match(/\d+/)?.[0] || '0', 10);

    return NextResponse.json({ sentiment, requests, toxicCount });
  } catch (err) {
    return NextResponse.json({
      sentiment: 'Failed to analyze comments.',
      requests: [],
      toxicCount: 0
    });
  }
}

