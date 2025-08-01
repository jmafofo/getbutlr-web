import { NextRequest, NextResponse } from 'next/server';
import { callOllama } from '../ollama_query/route';
import { createClient } from '@/src/app/utils/supabase/server';

// Function to process an uploaded thumbnail
async function modifyUploadedThumbnail(title: string, task_id: string, clip_result: string, user_id: string) {
  const supabase = await createClient();

  const { data: tt_data, error: tt_Error } = await supabase
    .from('thumbnail_tasks')
    .select('*')
    .eq('task_id', task_id)
    .single();
  
  if (tt_Error || !tt_data) {
    return NextResponse.json({ error: 'No data found' }, { status: 404 });
  }

  const imageUrl = tt_data?.original_thumbnail_url;

  console.log('CHECK URL ===>', imageUrl)

  const ollamaPrompt = `
  You are an expert YouTube thumbnail designer.
  
  Image Context:
  - CLIP analysis of current image: ${clip_result}
  - Current title: "${title}"
  
  Task:
  1. Evaluate how well the image aligns with the title's message based on the CLIP result.
  2. Suggest only **subtle, localized changes** that improve visual alignment and click-through appeal — do *not* redesign or alter the main layout or core subject.
  3. Preserve the original composition, characters, background, and color scheme as much as possible.
  
  Instructions for Output:
  Your response must be a detailed, visual description suitable for an image-to-image model with *minor enhancement intent*. Be highly specific, focusing on:
  - Small adjustments to facial expression, text, contrast, or highlights.
  - Additions like arrows, emojis, or glow effects (if helpful).
  - Light changes to brightness, sharpness, saturation, or framing.
  - Text or graphic overlays that support the message — without obstructing key elements.
  
  Do not:
  - Replace the background.
  - Change the style completely.
  - Remove the main subject.
  
  Final Output:
  Return one detailed prompt that describes the **subtle, non-destructive** visual improvements to the existing image, formatted for use with an image-to-image model.
  `;  

  const rawResult = await callOllama(ollamaPrompt);
  
  let parsedResult;
  try {
    const cleaned = rawResult.match(/```json([\s\S]*?)```/)?.[1]?.trim() || rawResult.trim();
    parsedResult = JSON.parse(cleaned);
  } catch {
    parsedResult = { image_prompt: rawResult || title };
  }

  console.log(parsedResult)

  const imagePrompt = parsedResult.image_prompt || rawResult || title;

  const imageResponse = await fetch(`${process.env.BACKEND_URL_S2}/api/v1/generate-flux-im2im`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: imagePrompt,
      task_id: task_id,
      user_uuid: String(user_id),
      image_url: imageUrl,
    })
  });

  if (!imageResponse.ok) {
    throw new Error(`Failed to generate image: ${await imageResponse.text()}`);
  }

  const data = await imageResponse.json();

  return NextResponse.json({
    taskId: task_id
  });
}

// Main POST handler
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (!sessionData?.session || sessionError) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = sessionData.session.user.id;
  console.log('this is the userid', userId);
  try {
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const title = (formData.get('title') as string)?.trim();
      const clip_result = formData.get('clip_result') as string;
      const task_id = formData.get('task_id') as string;

      if (!title) {
        return NextResponse.json({ error: 'Title is required' }, { status: 400 });
      }
      return await modifyUploadedThumbnail(title, task_id, clip_result, userId);
    }

    return NextResponse.json(
      { error: `Unsupported Content-Type: ${contentType}` },
      { status: 415 }
    );
  } catch (error) {
    console.error('Error in thumbnail generator API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
