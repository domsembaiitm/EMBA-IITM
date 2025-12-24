-- FIX 1: Robust RLS for Recruiters (Handle NULLs)
DROP POLICY IF EXISTS "Recruiters can view students" ON public.profiles;

CREATE POLICY "Recruiters can view students" ON public.profiles
    FOR SELECT USING (
        auth.uid() IN (SELECT id FROM profiles WHERE role = 'recruiter')
        AND role = 'student'
        -- Fix: Use COALESCE to handle null emails, ensuring they don't break the boolean logic
        AND NOT (
            split_part(COALESCE(auth.jwt() ->> 'email', ''), '@', 2) = ANY(blocked_domains)
        )
    );

-- FIX 2: Security Definer Function for Landing Page Stats
-- This allows fetching aggregate counts without exposing individual private profiles
CREATE OR REPLACE FUNCTION public.get_cohort_stats()
RETURNS TABLE (
    total_students INTEGER,
    avg_experience INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER -- Bypasses RLS
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_students,
        COALESCE(AVG(work_experience), 0)::INTEGER as avg_experience
    FROM profiles
    WHERE role = 'student' 
    AND is_hidden = false;
END;
$$;

-- Grant access to public (anon) and authenticated users
GRANT EXECUTE ON FUNCTION public.get_cohort_stats TO anon, authenticated, service_role;
