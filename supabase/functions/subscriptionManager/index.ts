import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!
);

serve(async () => {
  const { data } = await supabase
    .from('user_subscriptions')
    .select('*')
    .in('status', ['trial', 'active']);

  const now = new Date();
  for (const sub of data || []) {
    // Trial expiry reminders
    if (sub.tier === 'trial' && sub.trial_expires) {
      const daysLeft = (new Date(sub.trial_expires).getTime() - now.getTime()) / (1000*60*60*24);
      if (daysLeft.toFixed(0) == '7' || daysLeft.toFixed(0) == '2' || daysLeft.toFixed(0) == '0') {
        // schedule in-app/email reminder (via supabase buckets or edge here)
      }

      if (now > new Date(sub.trial_expires)) {
        // convert to Growth
        await supabase.from('user_subscriptions').update({
          tier: 'growth',
          next_billing: new Date(now.getTime() + 30*24*60*60*1000),
          status: 'active'
        }).eq('user_id', sub.user_id);
        // trigger Stripe subscription creation here
      }
    }

    // Past-due payment logic
    if (sub.tier === 'growth' && sub.next_billing) {
      if (now > new Date(sub.next_billing)) {
        // attempt renew, then update next_billing or mark past_due
      }
    }
  }

  return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
});

