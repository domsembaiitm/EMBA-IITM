-- Add 'domain' column to profiles for scalable filtering
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS domain TEXT;

-- Create an index on domain for fast filtering
CREATE INDEX IF NOT EXISTS idx_profiles_domain ON public.profiles(domain);

-- Backfill domain for existing users (Simple heuristic or default)
-- In a real prod env, we'd run a script to re-calculate this from headlines.
-- For now, default to 'Emerging Domain' or NULL.

