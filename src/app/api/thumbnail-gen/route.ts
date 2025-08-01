import { NextRequest, NextResponse } from 'next/server';
import { callOllama } from '../ollama_query/route';
import { createClient } from '@/src/app/utils/supabase/server';

// Function to generate an image from a title using Ollama
// async function generateImageFromTitle(title: string, user_id: string) {
//   console.log('CHECK THE 2nd id', user_id)
//   const supabase = await createClient();

//   const ollamaPrompt = `
//     YouTube title: "${title}". Create a text-to-image prompt with one key visual and a bold text banner (visibly part of the image) containing a short, catchy phrase. Output only 1 concise image full and detailed description.
//     Note:
//         - If the title has a given place, consider its environment and structure.
//   `;

//   const rawResult = await callOllama(ollamaPrompt);
//   console.log(rawResult);
//   let parsedResult;
//   try {
//     const cleaned = rawResult.match(/```json([\s\S]*?)```/)?.[1]?.trim() || rawResult.trim();
//     parsedResult = JSON.parse(cleaned);
//   } catch {
//     parsedResult = { image_prompt: rawResult || title };
//   }

//   const imagePrompt = parsedResult.image_prompt || rawResult || title;

//   const imageResponse = await fetch(`${process.env.BACKEND_URL_S2}/api/v1/generate-flux`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       prompt: imagePrompt,
//       return_base64: false,
//       user_uuid: user_id,
//       seed: Math.floor(Math.random() * 1000000)
//     })
//   });

//   if (!imageResponse.ok) {
//     throw new Error(`Failed to generate image: ${await imageResponse.text()}`);
//   }

//   const data = await imageResponse.json();
//   const task_id = data.task_id;

//   const { error } = await supabase.from('thumbnail_tasks').insert([
//     {
//       task_id,
//       title,
//       prompt: imagePrompt,
//       source: 'flux',
//       user_id,
//     },
//   ]);

//   if (error) {
//     console.error('Error saving to Supabase:', error);
//   }
//   return NextResponse.json({
//       taskId: task_id
//     });
//   // const imageBlob = await imageResponse.blob();
//   // const imageArrayBuffer = await imageBlob.arrayBuffer();
//   // const imageBase64 = Buffer.from(imageArrayBuffer).toString('base64');

//   // return NextResponse.json({
//   //   image_base64: `data:image/png;base64,${imageBase64}`
//   // });
// }

// Function to process an uploaded thumbnail
async function processUploadedThumbnail(title: string, task_id: string, clip_result: string, user_id: string) {
  // const clip_result = await processImage({ file: thumbnailFile });
  const supabase = await createClient();

  const ollamaPrompt = `
    You are an expert YouTube thumbnail evaluator.
    Step 1 - Evaluate the clip interrogator result of the image: ${clip_result}.
    Step 2 - Evaluate the title "${title}".
    Step 3 - Create a text-to-image concise short prompt adding a text banner with a short, catchy phrase, also prevent showing naked people.
    Note:
      - Output only the image full and detailed description.
  `;

  const rawResult = await callOllama(ollamaPrompt);
  let parsedResult;
  try {
    const cleaned = rawResult.match(/```json([\s\S]*?)```/)?.[1]?.trim() || rawResult.trim();
    parsedResult = JSON.parse(cleaned);
  } catch {
    parsedResult = { image_prompt: rawResult || title };
  }

  const imagePrompt = parsedResult.image_prompt || rawResult || title;

  const imageResponse = await fetch(`${process.env.BACKEND_URL_S2}/api/v1/generate-flux`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: imagePrompt,
      task_id: task_id,
      user_uuid: String(user_id),
    })
  });

  if (!imageResponse.ok) {
    throw new Error(`Failed to generate image: ${await imageResponse.text()}`);
  }

  const data = await imageResponse.json();
  // const task_id = data.task_id;

  // const { error } = await supabase.from('thumbnail_tasks').insert([
  //   {
  //     task_id,
  //     title,
  //     prompt: imagePrompt,
  //     source: 'flux',
  //     user_id,
  //   },
  // ]);
  // if (error) {
  //   console.error('Error saving to Supabase:', error);
  // }
  return NextResponse.json({
    taskId: task_id
  });

  // const imageBlob = await imageResponse.blob();
  // const imageArrayBuffer = await imageBlob.arrayBuffer();
  // const imageBase64 = Buffer.from(imageArrayBuffer).toString('base64');

  // return NextResponse.json({
  //   image_base64: `data:image/png;base64,${imageBase64}`
  // });
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

    // if (contentType.includes('application/json')) {
    //   const body = await req.json();
    //   const title = body.title?.trim();
    //   if (!title) {
    //     return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    //   }
    //   return await generateImageFromTitle(title, userId);
    // }

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const title = (formData.get('title') as string)?.trim();
      const clip_result = formData.get('clip_result') as string;
      const task_id = formData.get('task_id') as string;

      if (!title) {
        return NextResponse.json({ error: 'Title is required' }, { status: 400 });
      }
      return await processUploadedThumbnail(title, task_id, clip_result, userId);

      // if (thumbnailFile) {
      //   return await processUploadedThumbnail(title, clip_result, userId);
      // } else {
      //   return await generateImageFromTitle(title, userId);
      // }
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
