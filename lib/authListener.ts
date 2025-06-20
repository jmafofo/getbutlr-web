import { supabase } from './supabaseClient';

export function initAuthListener() {
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      const userId = session.user.id;

      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('theme')
          .eq('user_id', userId)
          .single();

        if (data?.theme) {
          const html = document.documentElement;
          if (data.theme === 'dark') {
            html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
          } else {
            html.classList.remove('dark');
            localStorage.setItem('theme', 'light');
          }
        }
      } catch (err) {
        console.warn('Failed to load user theme preferences:', err);
      }
    }
  });
}

