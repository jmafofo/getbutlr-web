import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "@supabase/supabase-js";
import { google } from "https://cdn.skypack.dev/googleapis";

const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!);
const youtube = google.youtube({ version: "v3", auth: Deno.env.get("YOUTUBE_API_KEY") });

serve(async () => {
  const { data: watches } = await supabase.from("watchlists").select("*");
  for (const w of watches || []) {
    const res = await youtube.search.list({
      q: w.keyword,
      part: ["snippet"],
      type: ["video"],
      order: "viewCount",
      publishedAfter: w.last_notified_at ? w.last_notified_at.toISOString() : new Date(Date.now() - 86400000).toISOString(),
      maxResults: 5
    });
    const items = res.data.items || [];
    if (items.length > 0) {
      // Send notifications to users (stub for email or in-app)
      // Example: await supabase.rpc('send_notification', {...});
      await supabase.from("watchlists")
        .update({ last_notified_at: new Date().toISOString() })
        .eq("id", w.id);
    }
  }
  return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
});

