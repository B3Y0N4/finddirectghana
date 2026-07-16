-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- Required before the auth system works

-- ── Profiles table (extends auth.users) ──────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id         uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role       text NOT NULL DEFAULT 'tenant' CHECK (role IN ('tenant', 'landlord')),
  full_name  text,
  phone      text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Service role bypasses RLS automatically (no policy needed for server-side ops)

-- ── Add owner_id to listings ──────────────────────────────────
ALTER TABLE listings ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES auth.users(id);

-- ── Add reviewer_id to reviews ───────────────────────────────
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS reviewer_id uuid REFERENCES auth.users(id);
