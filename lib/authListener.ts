import { supabase } from '@/lib/supabaseClient';
import { logEvent } from './analytics';

export function initAuthListener() {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      logEvent('user_signed_in', { email: session?.user.email });
    } else if (event === 'SIGNED_OUT') {
      logEvent('user_signed_out');
    }
  });
}

