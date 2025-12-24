-- FIX 5: Break Infinite Recursion with Security Definer Functions
-- The previous policy queried 'profiles' within 'profiles' RLS, causing a loop.
-- We move the role check to a security definer function that bypasses RLS.

CREATE OR REPLACE FUNCTION public.check_user_role(required_role user_role)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- Bypasses RLS to safely query profiles
SET search_path = public -- Security best practice
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = required_role
  );
END;
$$;

-- Grant execute to everyone (it only checks the caller's role)
GRANT EXECUTE ON FUNCTION public.check_user_role TO anon, authenticated, service_role;

-- RECREATE PROFILES POLICY (Recruiters viewing students)
DROP POLICY IF EXISTS "Recruiters can view students" ON public.profiles;

CREATE POLICY "Recruiters can view students" ON public.profiles
    FOR SELECT USING (
        -- Use the safe function instead of direct subquery
        check_user_role('recruiter')
        AND role = 'student'
        AND NOT (
            split_part(COALESCE(auth.jwt() ->> 'email', ''), '@', 2) = ANY(COALESCE(blocked_domains, '{}'))
        )
    );

-- RECREATE THINKING STYLES POLICY
DROP POLICY IF EXISTS "Thinking styles viewable by recruiters" ON public.thinking_styles;

CREATE POLICY "Thinking styles viewable by recruiters" ON public.thinking_styles
    FOR SELECT USING (
        check_user_role('recruiter')
    );

-- RECREATE PROJECTS POLICY
DROP POLICY IF EXISTS "Projects viewable by recruiters" ON public.projects;

CREATE POLICY "Projects viewable by recruiters" ON public.projects
    FOR SELECT USING (
        check_user_role('recruiter')
    );

-- RECREATE AUDIT LOGS POLICY
DROP POLICY IF EXISTS "Admins view audit logs" ON public.audit_logs;

CREATE POLICY "Admins view audit logs" ON public.audit_logs
    FOR SELECT USING (
        check_user_role('admin')
    );
