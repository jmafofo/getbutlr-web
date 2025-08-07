import { NextRequest, NextResponse } from 'next/server';
import { callOllama } from '../ollama_query/route';

export async function POST(req: NextRequest) {
  const { topic } = await req.json();

  if (!topic || typeof topic !== 'string') {
    return NextResponse.json({ error: 'Missing or invalid topic.' }, { status: 400 });
  }

  // Expert content creator prompt
  const prompt = `You are an expert content creator. Generate creative, unique, and engaging content ideas for the niche or topic: "${topic}". Provide the output as a JSON array of ideas like:
    \`\`\`json
    [
    { "title": "Title 1", "description": "Short description here." },
    { "title": "Title 2", "description": "Another description here." }
    ]
    \`\`\`
    Only return the JSON wrapped in code block.`;

  try {
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
  } catch (error) {
    return NextResponse.json({ error: 'Failed to query Ollama.' }, { status: 500 });
  }
}
