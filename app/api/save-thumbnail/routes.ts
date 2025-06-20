import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  const { image, metadata } = await req.json();
  const filename = `thumbnails/${Date.now()}.png`;

  await supabase.storage.from('thumbnails').upload(filename, Buffer.from(image, 'base64'));
  await supabase.from('thumbnail_logs').insert({ filename, metadata });

  return new Response(JSON.stringify({ ok: true }));
}

