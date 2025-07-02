import { NextRequest, NextResponse } from 'next/server';
import { callOllama } from '../ollama_query/route';

export async function POST(req: NextRequest) {
  try {
    const { title } = await req.json();

    const ollamaPrompt = `
    YouTube title: "${title}". Create a text-to-image prompt with one key visual and a bold text banner (visibly part of the image) containing a short, catchy phrase. Output only the image full and detailed description.
    Note:
        - If the title has given a place consider it's environment and structure.
    `;

    const rawResult = await callOllama(ollamaPrompt);
    console.log(rawResult);
    let parsedResult;
    try {
      const cleaned = rawResult.match(/```json([\s\S]*?)```/)?.[1]?.trim() || rawResult.trim();
      parsedResult = JSON.parse(cleaned);
    } catch {
      parsedResult = {
        score: 0,
        feedback: rawResult || 'Feedback could not be generated',
        image_prompt: rawResult || title
      };
    }

    const imagePrompt = parsedResult.image_prompt || rawResult || title;

    const imageResponse = await fetch(`${process.env.BACKEND_URL_S2}/api/v1/generate-flux?prompt=${imagePrompt}&return_base64=false`, {
      method: 'POST'
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
