import { NextRequest, NextResponse } from 'next/server';
import { callOllama } from '../ollama_query/route';
import axios from 'axios';

const SERP_API_KEY = process.env.NEXT_PUBLIC_SERP_API_KEY;

async function webSearch(platform: string, topic: string): Promise<string> {
  const serpUrl = 'https://serpapi.com/search.json';

  try {
    const response = await axios.get(serpUrl, {
      params: {
        q: `trending ${platform} sounds ${topic}`,
        api_key: SERP_API_KEY,
        engine: 'google',
      },
    });

    const results = response.data.organic_results?.slice(0, 5) || [];
    const snippets = results.map((r: any) => r.snippet).join('\n\n');
    return snippets || 'No relevant results found.';
  } catch (error) {
    console.error('Web search failed:', error);
    return 'Web search failed.';
  }
}

export async function POST(req: NextRequest) {
  const { comments, region, demographics, interests, platform } = await req.json();

  // 1. Get relevant web content via SERP API
  const serpSnippets = await webSearch(platform || 'YouTube', interests || '');

  // 2. Construct the full prompt
  const prompt = `
You are analyzing YouTube audience data.

Region: ${region}
Demographics: ${demographics}
Interests: ${interests}
Trending content related to the audience (from Google):\n\n${serpSnippets}

Now, analyze these YouTube comments for:
- Sentiment
- Viewer intent
- Feedback patterns
- Content suggestions

Comments:\n\n${comments}
`;

  // 3. Call Ollama with constructed prompt
  const rawResult = await callOllama(prompt);

  // 4. Try to parse as JSON, fallback to raw text
  let parsedResult;
  try {
    const cleaned = rawResult.match(/```json([\s\S]*?)```/)?.[1]?.trim() || rawResult.trim();
    parsedResult = JSON.parse(cleaned);
  } catch {
    parsedResult = { output: rawResult };
  }

  return NextResponse.json({ trends: parsedResult });
}
