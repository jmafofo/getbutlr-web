import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_ANON_KEY")!
);

serve(async (req) => {
  const { query, tone } = await req.json();
  const prompt = `For the topic "${query}", in "${tone}" tone, suggest JSON with:
  keywords: 5,
  tags: 7,
  title_variants: 3,
  thumbnail_prompt: string.`;
  const aiRes = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: "gpt-4", prompt, max_tokens: 512 }),
  });
  const { choices } = await aiRes.json();
  const { keywords, tags, title_variants, thumbnail_prompt } = JSON.parse(
    choices[0].text
  );
  await supabase.from("suggestions").insert([
    { query, tone, keywords, tags, title_variants, thumbnail_prompt },
  ]);
  return new Response(
    JSON.stringify({ keywords, tags, title_variants, thumbnail_prompt }),
    { headers: { "Content-Type": "application/json" } }
  );
});

