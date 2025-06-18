CREATE TABLE ab_tests (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users(id),
  video_id TEXT NOT NULL,
  test_name TEXT NOT NULL,
  variant_a_title TEXT,
  variant_b_title TEXT,
  variant_a_thumbnail TEXT,
  variant_b_thumbnail TEXT,
  impressions_a INT DEFAULT 0,
  impressions_b INT DEFAULT 0,
  clicks_a INT DEFAULT 0,
  clicks_b INT DEFAULT 0,
  watch_time_a INT DEFAULT 0,
  watch_time_b INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

