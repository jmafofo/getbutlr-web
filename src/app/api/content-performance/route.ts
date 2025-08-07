import { NextRequest, NextResponse } from 'next/server';
import { callOllama } from '../ollama_query/route';

export async function POST(req: NextRequest) {
  const { title, description, tags } = await req.json();

  const prompt = `Evaluate the following YouTube content for performance potential:\nTitle: ${title}\nDescription: ${description}\nTags: ${tags.join(", ")}\nGive a score out of 100 and explain strengths and areas of improvement.`;

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
