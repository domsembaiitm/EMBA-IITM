
-- 1. Open Access for Public Viewing (Recruiter/Guest Mode)
DROP POLICY IF EXISTS "Public profiles" ON public.profiles;
CREATE POLICY "Public profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public projects" ON public.projects;
CREATE POLICY "Public projects" ON public.projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public styles" ON public.thinking_styles;
CREATE POLICY "Public styles" ON public.thinking_styles FOR SELECT USING (true);

-- 2. Moderation Schema
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT false;

-- 3. Ensure Admin can update anything
DROP POLICY IF EXISTS "Admin full access" ON public.profiles;
CREATE POLICY "Admin full access" ON public.profiles USING (
  public.get_my_role() = 'admin'
);
