import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import OpenAI from 'https://deno.land/x/openai@v4.0.0/mod.ts';

serve(async (req) => {
  const { title, description } = await req.json();

  const openai = new OpenAI(Deno.env.get('OPENAI_API_KEY'));
  const prompt = `You're an expert YouTube growth coach. Analyze the following title and description for SEO and engagement quality. Return a structured JSON with diagnosis, score (out of 10), and one suggestion.

  Title: ${title}
  Description: ${description}`;

  const chat = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }]
  });

  const output = chat.choices?.[0]?.message?.content;

  return new Response(output, {
    headers: { 'Content-Type': 'application/json' },
    status: 200
  });
});

