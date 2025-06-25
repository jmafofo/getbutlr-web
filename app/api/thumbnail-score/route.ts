import { NextRequest, NextResponse } from 'next/server';
import { callOllama } from '../ollama_query/route';

export async function POST(req: NextRequest) {
  try {
    const { clip_result, title } = await req.json();

    const prompt = `
      You are an expert YouTube thumbnail evaluator.
      Evaluate the following thumbnail description: ${clip_result} 
      For the video titled: ${title}
      
      Provide a score from 0 to 100 and written feedback based on:
      1. Clarity and composition,
      2. Emotional engagement,
      3. Text readability,
      4. Brand consistency.

      Return your response in strict JSON format:
      {"score": number, "feedback": string}
    `;

    const rawResult = await callOllama(prompt);

    // If we get a direct JSON response, use it
    if (typeof rawResult === 'object' && rawResult !== null) {
      return NextResponse.json(rawResult);
    }

    // Otherwise, try to parse the string response
    let parsedResult;
    try {
      const cleaned = rawResult.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedResult = JSON.parse(cleaned);
    } catch (e) {
      // If parsing fails, wrap the raw result in a proper format
      parsedResult = {
        score: 0,
        feedback: rawResult || 'No feedback could be generated'
      };
    }

    return NextResponse.json(parsedResult);

  } catch (error) {
    console.error('Error in thumbnail-score API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}