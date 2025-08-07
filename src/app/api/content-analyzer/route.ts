import { NextRequest, NextResponse } from 'next/server';
import { callOllama } from '../ollama_query/route';


export async function POST(req: NextRequest) {
  const { input } = await req.json();

  const prompt = `Analyze the following input from the Content Analyzer tool perspective: ${input}`;

  const rawResult = await callOllama(prompt);

  let parsedResult;
  try {
    const cleaned = rawResult.match(/```json([\s\S]*?)```/)?.[1]?.trim() || rawResult.trim();
    parsedResult = JSON.parse(cleaned);
  } catch {
    parsedResult = { output: rawResult };
  }

  return NextResponse.json({ trends: parsedResult });
}