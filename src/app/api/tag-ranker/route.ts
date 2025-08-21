import { NextRequest, NextResponse } from 'next/server';
import { callOllama } from '../ollama_query/route';

export async function POST(req: NextRequest) {
  try {
    const { tagsText } = await req.json();
    const tags = tagsText
      .split(',')
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 0)
      .slice(0, 20);

    const prompt = `
You are an SEO assistant. Analyze the following YouTube tags.
Return ONLY valid JSON. Do not include markdown, code fences, or explanations.

The JSON must be an array of objects, each object with:
- "tag": string (the original tag),
- "score": number (0–10, relevance + SEO potential),
- "comment": string (a 1-sentence comment),
- "suggestion": string | null (a better alternative tag if possible, otherwise null).

Tags to evaluate: ${tags.join(', ')}
`;

    const rawResult = await callOllama(prompt);

    // 🧹 Clean response: remove ```json ... ``` wrappers if they exist
    const cleaned = rawResult
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    let results: any[] = [];

    try {
      results = JSON.parse(cleaned);
    } catch (err) {
      console.error('❌ Failed to parse Ollama output:', rawResult);
      return NextResponse.json(
        { error: 'Invalid AI response', raw: rawResult },
        { status: 500 }
      );
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error in /api/tag-ranker:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
