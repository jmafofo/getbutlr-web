import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "@supabase/supabase-js";
import { google } from "https://cdn.skypack.dev/googleapis";

const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!);
const youtube = google.youtube({ version: "v3", auth: Deno.env.get("YOUTUBE_API_KEY") });

serve(async (req) => {
  const { user_id, original_title, tone, style } = await req.json();

  const searchRes = await youtube.search.list({
    q: original_title, part: ["snippet"],
    type: ["video"], maxResults: 5, order: "viewCount"
  });
  const videoIds = searchRes.data.items?.map(i => i.id?.videoId).filter(Boolean).join(",");
  const stats = await youtube.videos.list({ id: videoIds!, part: ["snippet","statistics"] });

  const trend_stats = stats.data.items?.map(v => ({
    title: v.snippet?.title,
    views: v.statistics?.viewCount,
    likes: v.statistics?.likeCount
  }));

  const prompt = `Profile tone: ${tone}, styles: ${style.join(", ")}.
Original title: "${original_title}".
Trending titles: ${trend_stats.map(v => v.title).join(" | ")}.
Generate 3 optimized title variants as JSON array.`;

  const aiRes = await fetch("https://api.openai.com/v1/completions", {
    method: "POST", headers: {
      "Authorization": `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
      "Content-Type": "application/json"
    }, body: JSON.stringify({ model: "gpt-4", prompt, max_tokens: 256 })
  });
  const { choices } = await aiRes.json();
  const generated_titles = JSON.parse(choices[0].text);

  await supabase.from("title_suggestions").insert([{ user_id, original_title, generated_titles, trend_stats }]);
  return new Response(JSON.stringify({ generated_titles, trend_stats }), {
    headers: { "Content-Type": "application/json" }
  });
});

