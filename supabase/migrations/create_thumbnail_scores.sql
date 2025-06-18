CREATE TABLE thumbnail_scores (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users(id),
  video_id TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  score INT,
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

