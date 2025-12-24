-- Fix Case Sensitivity in Blocklist RLS

-- 1. Drop old policy
DROP POLICY IF EXISTS "Recruiters can view students" ON public.profiles;

-- 2. Re-create with LOWER() enforcement
CREATE POLICY "Recruiters can view students" ON public.profiles
    FOR SELECT USING (
        check_user_role('recruiter')
        AND role = 'student'
        -- Enforce Blocklist (Null Safe & Case Insensitive)
        AND NOT (
            lower(split_part(COALESCE(auth.jwt() ->> 'email', ''), '@', 2)) = ANY(COALESCE(blocked_domains, '{}'))
        )
    );
