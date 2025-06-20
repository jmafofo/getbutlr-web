import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!)

serve(async (req) => {
  try {
    const { title, description } = await req.json();

    const prompt = `Analyze the following YouTube video and return a list of suggestions to improve performance:

Title: ${title}
Description: ${description}

Return JSON with:
- summary
- title_feedback
- hook_suggestion
- keyword_improvement
- thumbnail_idea`

    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await aiResponse.json();
    const content = data.choices?.[0]?.message?.content;

    return new Response(content, {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid input or OpenAI error', details: err.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

