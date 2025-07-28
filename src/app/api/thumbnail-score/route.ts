import { NextRequest, NextResponse } from 'next/server';
import { callOllama } from '../ollama_query/route';
import { createClient } from '@/src/app/utils/supabase/server';
import { v4 as uuidv4 } from 'uuid';

export async function parseFormData(req: Request) {
  const formData = await req.formData();
  const clip_result = formData.get('clip_result') as string;
  const title = formData.get('title') as string;
  const user_id = formData.get('user_id') as string;
  const file = formData.get('file') as File;

  return { clip_result, title, user_id, file };
}

export async function POST(req: Request) {
  const supabase = await createClient();
  try {
    const { clip_result, title, user_id, file } = await parseFormData(req);

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('Received file:', file.name);

    // Upload to Supabase Storage
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('thumbnails')
      .upload(`thumbnails/${Date.now()}-${file.name}`, buffer, {
        contentType: file.type,
      });

    if (uploadError) {
      console.error(uploadError);
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage
      .from('thumbnails')
      .getPublicUrl(uploadData.path);

    const publicUrl = publicUrlData?.publicUrl;

    const taskId = uuidv4();

    const prompt = `
    You are an expert YouTube thumbnail evaluator.

    Step 1 - Trim the following description to include only the visible content in the image, not the metadata:
    ${clip_result}

    Step 2 - Evaluate the trimmed description along with the video title:
    "${title}"

    Step 3 - Score and provide feedback based on the following four criteria:
      1. Clarity and composition
      2. Emotional engagement
      3. Text readability
      4. Brand consistency

    Each score must be a number from **0 to 10** (0 = lowest, 10 = highest).

    Return your response as *valid JSON only*, using the following exact format:

    {
      "trimmed_clip": string,
      "clarity_score": number,                     // 0–10
      "clarity_feedback": string,
      "emotional_engagement_score": number,        // 0–10
      "emotional_engagement_feedback": string,
      "text_readability_score": number,            // 0–10
      "text_readability_feedback": string,
      "brand_consistency_score": number,           // 0–10
      "brand_consistency_feedback": string
    }

    Do not include any explanation or notes outside of this JSON structure.
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
      console.error('Parsing error:', e);
      return NextResponse.json({ error: 'Failed to parse LLM response as JSON.' }, { status: 400 });
    }
    
    const { error } = await supabase.from('thumbnail_tasks').insert([
      {
        task_id: taskId,
        title,
        clip_result: parsedResult.trimmed_clip,
        source: 'ollama',
        user_id,
        clarity_score: parsedResult.clarity_score,
        clarity_feedback: parsedResult.clarity_feedback,
        emotional_engagement_score: parsedResult.emotional_engagement_score,
        emotional_engagement_feedback: parsedResult.emotional_engagement_feedback,
        text_readability_score: parsedResult.text_readability_score,
        text_readability_feedback: parsedResult.text_readability_feedback,
        brand_consistency_score: parsedResult.brand_consistency_score,
        brand_consistency_feedback: parsedResult.brand_consistency_feedback,
        original_thumbnail_url: publicUrl,
      },
    ]);

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Thumbnail score saved successfully', data: parsedResult, task_id: taskId });

  } catch (error) {
    console.error('Error in thumbnail-score API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}