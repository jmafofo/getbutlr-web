create table creator_profiles (
  user_id uuid primary key references auth.users(id),
  tone_preference text,
  content_style text[],
  traits jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

