import { NextRequest, NextResponse } from 'next/server';
import { callOllama } from '../ollama_query/route';

export async function POST(req: NextRequest) {
  const { topic, frequency, style } = await req.json();

  const prompt = `Generate a 7-day YouTube content calendar for a channel about "${topic}". 
The creator uploads ${frequency} times per week and prefers "${style}" format.
Include titles, ideal upload days, and suggested hooks. Make it smart and relevant to current trends.`;

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
