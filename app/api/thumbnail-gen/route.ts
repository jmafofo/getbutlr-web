import { NextRequest, NextResponse } from 'next/server';
import { callOllama } from '../ollama_query/route';

export async function POST(req: NextRequest) {
  try {
    const { clip_result, title } = await req.json();

    const ollamaPrompt = `
      You are an expert YouTube thumbnail evaluator and generator.
      Step 1 - Evaluate the title description: "${title}".
      Step 2 - Provide a detailed prompt to be passed to a text-to-image generator to create the image.
    `;

    const rawResult = await callOllama(ollamaPrompt);

    let parsedResult;
    try {
      const cleaned = rawResult.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedResult = JSON.parse(cleaned);
    } catch (e) {
      parsedResult = {
        score: 0,
        feedback: rawResult || 'No feedback could be generated',
        image_prompt: rawResult || title
      };
    }

    const imagePrompt = parsedResult.image_prompt || rawResult || title;

    // Call the generate-image API
    const imageResponse = await fetch(`${process.env.BACKEND_URL}/generate-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: imagePrompt })
    });

    if (!imageResponse.ok) {
      throw new Error('Failed to generate image');
    }

    const imageBlob = await imageResponse.blob();
    const imageArrayBuffer = await imageBlob.arrayBuffer();
    const imageBase64 = Buffer.from(imageArrayBuffer).toString('base64');

    return NextResponse.json({
      feedback: parsedResult.feedback || '',
      score: parsedResult.score || 0,
      image_prompt: imagePrompt,
      image_base64: `data:image/png;base64,${imageBase64}`
    });

  } catch (error) {
    console.error('Error in thumbnail generator API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}