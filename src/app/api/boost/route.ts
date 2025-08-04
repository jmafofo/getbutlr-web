import { NextRequest, NextResponse } from 'next/server';
import { callOllama } from '../ollama_query/route';

export async function POST(req: NextRequest) {
  const { title, tags, description } = await req.json();

  const prompt = `
    Based on the following YouTube metadata, suggest ways to boost performance:
    Title: ${title}
    Tags: ${tags}
    Description: ${description}
    Provide a summary of target audience and improvements to optimize reach.
  `;

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