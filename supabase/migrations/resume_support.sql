
-- 1. Schema Update
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS resume_url TEXT;

-- 2. Storage Bucket for Resumes
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

-- Policies
DROP POLICY IF EXISTS "Public Access Resumes" ON storage.objects;
CREATE POLICY "Public Access Resumes" ON storage.objects FOR SELECT USING ( bucket_id = 'resumes' );

DROP POLICY IF EXISTS "Auth Upload Resumes" ON storage.objects;
CREATE POLICY "Auth Upload Resumes" ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'resumes' AND auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Owner Update Resumes" ON storage.objects;
CREATE POLICY "Owner Update Resumes" ON storage.objects FOR UPDATE 
USING ( bucket_id = 'resumes' AND auth.uid() = owner );
