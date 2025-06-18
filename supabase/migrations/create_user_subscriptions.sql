CREATE TABLE IF NOT EXISTS user_subscriptions (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  tier TEXT NOT NULL DEFAULT 'free', -- 'free', 'trial', 'growth', 'pro'
  trial_started TIMESTAMPTZ,
  trial_expires TIMESTAMPTZ,
  next_billing TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'past_due', 'canceled'
  customer_id TEXT,
  subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

