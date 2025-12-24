-- FIX 3: Allow Public Access to Thinking Styles (Linked to Profile Visibility)
-- This fixes the "Error loading candidates" for guests, as the query joins thinking_styles.
CREATE POLICY "Public thinking styles" ON public.thinking_styles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = thinking_styles.profile_id 
            AND (privacy_settings->>'public_visibility')::boolean = true
        )
    );

-- FIX 4: Improve Recruiter Blocklist NULL Safety
-- Handles cases where blocked_domains column itself might be NULL on the record.
DROP POLICY IF EXISTS "Recruiters can view students" ON public.profiles;

CREATE POLICY "Recruiters can view students" ON public.profiles
    FOR SELECT USING (
        auth.uid() IN (SELECT id FROM profiles WHERE role = 'recruiter')
        AND role = 'student'
        AND NOT (
            split_part(COALESCE(auth.jwt() ->> 'email', ''), '@', 2) = ANY(COALESCE(blocked_domains, '{}'))
        )
    );
