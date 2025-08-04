// app/api/ollama-websearch/route.ts
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
  const { platform, topic } = await req.json();

  if (!topic) {
    return NextResponse.json({ error: 'Missing topic' }, { status: 400 });
  }

  if (!platform) {
    return NextResponse.json({ error: 'Missing platform' }, { status: 400 });
  }

  // Perform search
  const searchResults = await webSearch(platform, topic);

  // Build enhanced prompt
  const prompt = `
Give me the top trending audio themes, sounds, or voiceovers in ${platform} based on the topic: "${topic}".

Use the following web search results as reference context:
${searchResults}
`;

  // Query Ollama
  const rawResult = await callOllama(prompt);

  // Parse output
  let parsedResult;
  try {
    const cleaned = rawResult.match(/```json([\s\S]*?)```/)?.[1]?.trim() || rawResult.trim();
    parsedResult = JSON.parse(cleaned);
  } catch {
    parsedResult = { output: rawResult };
  }

  return NextResponse.json({ trends: parsedResult });
}
