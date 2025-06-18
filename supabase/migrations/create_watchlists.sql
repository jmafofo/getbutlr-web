CREATE TABLE watchlists (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users(id),
  keyword TEXT NOT NULL,
  last_notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

