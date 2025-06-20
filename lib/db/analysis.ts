import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function saveAnalysis({ title, score }: { title: string; score: number }) {
  const { error } = await supabase.from('analyses').insert({ title, score });
  if (error) throw error;
}

export async function getAnalyses() {
  const { data, error } = await supabase.from('analyses').select('*').order('timestamp', { ascending: true });
  if (error) throw error;
  return data;
}

