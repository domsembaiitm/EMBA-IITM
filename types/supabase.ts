export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string
                    role: 'admin' | 'student' | 'recruiter' | 'guest'
                    full_name: string | null
                    headline: string | null
                    bio: string | null
                    location: string | null
                    linkedin_url: string | null
                    is_open_to_work: boolean
                    privacy_settings: Json
                    blocked_domains: string[] | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    role?: 'admin' | 'student' | 'recruiter' | 'guest'
                    full_name?: string | null
                    headline?: string | null
                    bio?: string | null
                    location?: string | null
                    linkedin_url?: string | null
                    is_open_to_work?: boolean
                    privacy_settings?: Json
                    blocked_domains?: string[] | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    role?: 'admin' | 'student' | 'recruiter' | 'guest'
                    full_name?: string | null
                    headline?: string | null
                    bio?: string | null
                    location?: string | null
                    linkedin_url?: string | null
                    is_open_to_work?: boolean
                    privacy_settings?: Json
                    blocked_domains?: string[] | null
                    created_at?: string
                    updated_at?: string
                }
            }
            thinking_styles: {
                Row: {
                    id: string
                    profile_id: string
                    risk_appetite: number | null
                    leadership_posture: number | null
                    decision_style: Json
                    philosophy_essay: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    profile_id: string
                    risk_appetite?: number | null
                    leadership_posture?: number | null
                    decision_style?: Json
                    philosophy_essay?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    profile_id?: string
                    risk_appetite?: number | null
                    leadership_posture?: number | null
                    decision_style?: Json
                    philosophy_essay?: string | null
                    created_at?: string
                }
            }
            projects: {
                Row: {
                    id: string
                    profile_id: string
                    related_course_id: string | null
                    title: string
                    problem_statement: string | null
                    solution_outcome: string | null
                    role_played: string | null
                    skills_demonstrated: Json
                    artifact_urls: string[] | null
                    is_featured: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    profile_id: string
                    related_course_id?: string | null
                    title: string
                    problem_statement?: string | null
                    solution_outcome?: string | null
                    role_played?: string | null
                    skills_demonstrated?: Json
                    artifact_urls?: string[] | null
                    is_featured?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    profile_id?: string
                    related_course_id?: string | null
                    title?: string
                    problem_statement?: string | null
                    solution_outcome?: string | null
                    role_played?: string | null
                    skills_demonstrated?: Json
                    artifact_urls?: string[] | null
                    is_featured?: boolean
                    created_at?: string
                }
            }
            courses: {
                Row: {
                    id: string
                    name: string
                    faculty: string | null
                    term: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    faculty?: string | null
                    term?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    faculty?: string | null
                    term?: string | null
                    created_at?: string
                }
            }
            endorsements: {
                Row: {
                    id: string
                    from_profile_id: string | null
                    to_profile_id: string | null
                    competency: string
                    text: string | null
                    visibility: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    from_profile_id?: string | null
                    to_profile_id?: string | null
                    competency: string
                    text?: string | null
                    visibility?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    from_profile_id?: string | null
                    to_profile_id?: string | null
                    competency?: string
                    text?: string | null
                    visibility?: string | null
                    created_at?: string
                }
            }
            audit_logs: {
                Row: {
                    id: string
                    actor_id: string | null
                    action: string
                    target_id: string | null
                    ip_hash: string | null
                    metadata: Json | null
                    timestamp: string
                }
                Insert: {
                    id?: string
                    actor_id?: string | null
                    action: string
                    target_id?: string | null
                    ip_hash?: string | null
                    metadata?: Json | null
                    timestamp?: string
                }
                Update: {
                    id?: string
                    actor_id?: string | null
                    action?: string
                    target_id?: string | null
                    ip_hash?: string | null
                    metadata?: Json | null
                    timestamp?: string
                }
            }
        }
    }
}
