-- Migration: Enforce Blocklist for Recruiters
-- Recruiter's email domain must NOT be in the student's blocked_domains array.

DROP POLICY IF EXISTS "Recruiters can view students" ON public.profiles;

CREATE POLICY "Recruiters can view students" ON public.profiles
    FOR SELECT USING (
        -- User is a recruiter
        auth.uid() IN (SELECT id FROM profiles WHERE role = 'recruiter')
        -- Target is a student
        AND role = 'student'
        -- Recruiter's email domain is NOT in the student's blocked_domains
        -- logic: 
        -- 1. Extract domain from auth.email() (this is tricky in pure SQL RLS without extensions sometimes, 
        --    but we can use split_part)
        -- 2. Check if that domain is ANY(blocked_domains)
        AND NOT (
            split_part(auth.jwt() ->> 'email', '@', 2) = ANY(blocked_domains)
        )
    );
