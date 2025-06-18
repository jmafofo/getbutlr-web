create table title_suggestions (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users(id),
  original_title text not null,
  generated_titles text[],
  trend_stats jsonb,
  created_at timestamptz default now()
);

