-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('admin', 'student', 'recruiter', 'guest');
CREATE TYPE interaction_status AS ENUM ('interested', 'connected', 'rejected');

-- 2. PROFILES TABLE (Extends Supabase Auth)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    role user_role DEFAULT 'student',
    full_name TEXT,
    headline TEXT,
    bio TEXT,
    organization TEXT,
    work_experience INTEGER, -- Total months
    avatar_url TEXT,
    location TEXT,
    linkedin_url TEXT,
    is_open_to_work BOOLEAN DEFAULT FALSE,
    privacy_settings JSONB DEFAULT '{"public_visibility": false}'::jsonb,
    blocked_domains TEXT[] DEFAULT '{}', -- Privacy: Domain Blocklist
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. THINKING STYLES TABLE (The "How I Think" Engine)
CREATE TABLE public.thinking_styles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    risk_appetite INTEGER CHECK (risk_appetite BETWEEN 1 AND 10), -- 1=Conservative, 10=Risk-Taker
    leadership_posture INTEGER CHECK (leadership_posture BETWEEN 1 AND 10), -- 1=Consensus, 10=Directive
    decision_style JSONB DEFAULT '{}'::jsonb, -- Sliders e.g. {"analytical": 80, "intuitive": 20}
    philosophy_essay TEXT, -- Mandatory structured essay
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. COURSES TABLE (Academic Context)
CREATE TABLE public.courses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT, -- e.g. MS9111
    credits INTEGER, -- e.g. 24
    quarter INTEGER, -- 1-8
    category TEXT, -- e.g. 'Functional Foundation', 'Integrated Perspective'
    faculty TEXT,
    term TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. PROJECTS TABLE (Coursework & Capstones)
CREATE TABLE public.projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    related_course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL, -- Link to course
    title TEXT NOT NULL,
    problem_statement TEXT,
    solution_outcome TEXT,
    role_played TEXT,
    skills_demonstrated JSONB DEFAULT '[]'::jsonb,
    artifact_urls TEXT[], -- Array of URLs to PDFs/Images (Watermarked)
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(profile_id, title)
);

-- 6. ENDORSEMENTS TABLE (Signal Amplification)
CREATE TABLE public.endorsements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    from_profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    to_profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    competency TEXT NOT NULL,
    text TEXT,
    visibility TEXT DEFAULT 'private',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. RECRUITER INTERACTIONS ("Soft Outreach")
CREATE TABLE public.recruiter_interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    recruiter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    status interaction_status DEFAULT 'interested',
    message TEXT, -- Optional initial message
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(recruiter_id, student_id)
);

-- 8. AUDIT LOGS (Security & Compliance)
CREATE TABLE public.audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL, -- e.g. "VIEW_PROFILE", "SEARCH_QUERY"
    target_id UUID, -- Affected record ID
    ip_hash TEXT,
    metadata JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thinking_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.endorsements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiter_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
-- Public: Anyone can read basic info if public_visibility is true
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (
        (privacy_settings->>'public_visibility')::boolean = true
    );

-- Owner: Can read/update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR ALL USING (auth.uid() = id);

-- Recruiters: Can view student profiles
-- CRITICAL PLUMBING: Blocklist logic must be enforced here or in API layer. 
-- RLS enforcing blocklist in SQL is expensive but safer.
CREATE POLICY "Recruiters can view students" ON public.profiles
    FOR SELECT USING (
        auth.uid() IN (SELECT id FROM profiles WHERE role = 'recruiter')
        AND role = 'student'
        -- Enforce Blocklist (Null Safe)
        AND NOT (
            split_part(COALESCE(auth.jwt() ->> 'email', ''), '@', 2) = ANY(COALESCE(blocked_domains, '{}'))
        )
    );

-- Thinking Styles Policies
CREATE POLICY "Thinking styles viewable by owner" ON public.thinking_styles
    FOR ALL USING (
        profile_id = auth.uid()
    );

CREATE POLICY "Thinking styles viewable by recruiters" ON public.thinking_styles
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'recruiter')
    );

DROP POLICY IF EXISTS "Public thinking styles" ON public.thinking_styles;

CREATE POLICY "Public thinking styles" ON public.thinking_styles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = thinking_styles.profile_id 
            AND (privacy_settings->>'public_visibility')::boolean = true
        )
    );

-- Courses Policies
CREATE POLICY "Courses viewable by authenticated" ON public.courses
    FOR SELECT USING (auth.role() = 'authenticated');

-- Projects Policies
CREATE POLICY "Projects viewable by owner" ON public.projects
    FOR ALL USING (auth.uid() = profile_id);

CREATE POLICY "Projects viewable by recruiters" ON public.projects
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'recruiter')
    );

-- Endorsements Policies
CREATE POLICY "Endorsements readable by recipient" ON public.endorsements
    FOR SELECT USING (to_profile_id = auth.uid());

CREATE POLICY "Endorsements manageable by author" ON public.endorsements
    FOR ALL USING (from_profile_id = auth.uid());

-- Recruiter Interactions Policies
CREATE POLICY "Recruiters manage their interactions" ON public.recruiter_interactions
    FOR ALL USING (recruiter_id = auth.uid());

CREATE POLICY "Students see interactions about them" ON public.recruiter_interactions
    FOR SELECT USING (student_id = auth.uid());

-- Audit Logs Policies
CREATE POLICY "Admins view audit logs" ON public.audit_logs
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 10. INDEXES
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_projects_profile_id ON public.projects(profile_id);
CREATE INDEX idx_interactions_student_id ON public.recruiter_interactions(student_id);
CREATE INDEX idx_thinking_styles_profile_id ON public.thinking_styles(profile_id);
CREATE INDEX idx_audit_created_at ON public.audit_logs(timestamp);

-- 11. FUNCTIONS
-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', (new.raw_user_meta_data->>'role')::user_role);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 12. STORAGE BUCKETS
-- Create 'resumes' bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', true) ON CONFLICT (id) DO NOTHING;

-- Storage Policies
-- Public Access to view resumes
CREATE POLICY "Public Resumes" ON storage.objects FOR SELECT USING ( bucket_id = 'resumes' );

-- Authenticated Entry for uploads
CREATE POLICY "Users can upload own resume" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update own resume" ON storage.objects FOR UPDATE USING (
    bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]
);
