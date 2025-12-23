import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileHeader } from '@/components/student/profile-header'
import { ThinkingStyleSection } from '@/components/student/thinking-style-section'
import { ProjectList } from '@/components/student/project-list'
import { CompetencyMap } from '@/components/student/competency-map'
import { TransformationArc } from '@/components/student/transformation-arc'
import { Button } from '@/components/ui/button'
import { Printer, Linkedin, Edit } from 'lucide-react'
import Link from 'next/link'
import { getTransformationNarrative } from '@/lib/transformation-logic'

export default async function StudentProfilePage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return redirect('/auth/login')

    // Fetch Profile
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

    // Fetch Thinking Style
    const { data: thinkingStyle } = await supabase.from('thinking_styles').select('*').eq('profile_id', user.id).single()

    // Fetch Projects
    // Using explicit select for projects to ensure compatibility
    const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false })

    // Generate Narrative (Recalibrates on profile update)
    const transformationData = getTransformationNarrative(
        profile?.headline || '',
        profile?.organization || '',
        profile?.work_experience || 120
    )

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-sans">
            {/* 1. CINEMATIC HERO SECTION (Private View) */}
            <div className="relative w-full bg-slate-900 border-b border-slate-800">
                {/* Abstract BG Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500 via-purple-500 to-transparent"></div>

                <div className="container mx-auto px-4 py-16 relative z-10">
                    <div className="flex flex-col md:flex-row gap-8 items-end">
                        {/* Huge Avatar */}
                        <div className="relative">
                            <div className="h-40 w-40 md:h-56 md:w-56 rounded-xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl">
                                <img src={profile?.avatar_url || ''} alt={profile?.full_name || ''} className="object-cover w-full h-full" />
                            </div>
                            <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                {profile?.work_experience ? `${Math.floor(profile.work_experience / 12)} Years Exp` : 'Executive'}
                            </div>
                        </div>

                        {/* Text Hero */}
                        <div className="flex-1 text-white pb-2">
                            <div className="flex flex-wrap gap-2 mb-3 opacity-90">
                                <span className="bg-slate-800 px-3 py-1 rounded-full text-xs font-medium border border-slate-700 uppercase tracking-widest">{profile?.location || 'Chennai'}</span>
                                <span className="bg-slate-800 px-3 py-1 rounded-full text-xs font-medium border border-slate-700 uppercase tracking-widest">EMBA Class of 2027</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
                                {profile?.full_name}
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-300 font-light max-w-3xl leading-relaxed">
                                {profile?.headline}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pb-2">
                            {profile?.resume_url && (
                                <a href={profile.resume_url} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" className="bg-transparent text-white border-slate-600 hover:bg-slate-800">
                                        <Printer className="h-4 w-4 mr-2" />
                                        Download CV
                                    </Button>
                                </a>
                            )}
                            <Link href="/student/profile/edit">
                                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg border-emerald-500 border">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Profile
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. MAIN CONTENT GRID */}
            <div className="container mx-auto px-4 py-16 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* LEFT COLUMN: The Narrative (Projects & Bio) */}
                    <div className="lg:col-span-8 space-y-16">

                        {/* 1. TRANSFORMATION ARC (The Structural Advantage) */}
                        <section>
                            <TransformationArc data={transformationData} />
                        </section>

                        {/* 2. EXECUTIVE BIO */}
                        <section className="prose prose-lg dark:prose-invert max-w-none">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 not-prose pl-4 border-l-4 border-blue-600">Executive Summary</h3>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                                {profile?.bio}
                            </p>
                        </section>

                        {/* 3. APPLIED PROJECTS */}
                        <section>
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 border-l-4 border-amber-500 pl-4">Applied Intelligence Portfolio</h3>
                                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800 ml-6"></div>
                            </div>
                            <ProjectList projects={projects || []} profileId={user.id} />
                        </section>
                    </div>

                    {/* RIGHT COLUMN: The Data DNA */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-8 space-y-8">
                            {/* Competency Map */}
                            <CompetencyMap />

                            {/* Psychometrics */}
                            <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                                    Leadership DNA
                                </h4>
                                <ThinkingStyleSection thinkingStyle={thinkingStyle} profileId={user.id} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
