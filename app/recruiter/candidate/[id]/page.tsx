
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ProfileHeader } from '@/components/student/profile-header'
import { ThinkingStyleSection } from '@/components/student/thinking-style-section'
import { ProjectList } from '@/components/student/project-list'
import { CompetencyMap } from '@/components/student/competency-map'
import { TransformationArc } from '@/components/student/transformation-arc'
import { Button } from '@/components/ui/button'
import { Printer, Linkedin, MessageSquarePlus, Share2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { OutreachDialog } from '@/components/recruiter/outreach-dialog'
import { getTransformationNarrative } from '@/lib/transformation-logic'
import { resolveAvatarUrl } from '@/lib/image-helper'
import { ConnectButton } from '@/components/recruiter/connect-button'
import { ShareProfile } from '@/components/recruiter/share-profile'
import { PrintButton } from '@/components/recruiter/print-button'

export default async function CandidateDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    // 1. Fetch Profile
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', id).single()

    if (!profile) return notFound()

    // 2. Fetch Thinking Style
    const { data: thinkingStyle } = await supabase.from('thinking_styles').select('*').eq('profile_id', id).single()

    // 3. Fetch Projects
    // Explicitly select columns to ensure type compatibility if needed, but select * is fine if types match
    const { data: projects } = await supabase.from('projects').select('*').eq('profile_id', id).order('created_at', { ascending: false })

    // Check Connection Status
    const { data: { user } } = await supabase.auth.getUser()
    let isConnected = false
    if (user) {
        const { data: interaction } = await supabase.from('recruiter_interactions')
            .select('*')
            .eq('recruiter_id', user.id)
            .eq('student_id', id)
            .single()
        isConnected = !!interaction
    }

    // 4. Generate Narrative
    const transformationData = getTransformationNarrative(
        profile.headline || '',
        profile.organization || '',
        profile.work_experience || 120
    )

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-sans">
            {/* 1. CINEMATIC HERO SECTION */}
            <div className="relative w-full bg-slate-900 border-b border-slate-800">
                {/* Abstract BG Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500 via-purple-500 to-transparent"></div>

                <div className="container mx-auto px-4 py-8 relative z-10">
                    <Link href="/recruiter/discover" className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-8 group">
                        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Cohort
                    </Link>
                    <div className="flex flex-col md:flex-row gap-8 items-end">
                        {/* Huge Avatar */}
                        <div className="relative">
                            <div className="h-40 w-40 md:h-56 md:w-56 rounded-xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl">
                                <img src={resolveAvatarUrl(profile.avatar_url)} alt={profile.full_name || ''} className="object-cover w-full h-full" />
                            </div>
                            <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                {profile.work_experience ? `${Math.floor(profile.work_experience / 12)} Years Exp` : 'Executive'}
                            </div>
                        </div>

                        {/* Text Hero */}
                        <div className="flex-1 text-white pb-2">
                            <div className="flex flex-wrap gap-2 mb-3 opacity-90">
                                <span className="bg-slate-800 px-3 py-1 rounded-full text-xs font-medium border border-slate-700 uppercase tracking-widest">{profile.location || 'Chennai'}</span>
                                <span className="bg-slate-800 px-3 py-1 rounded-full text-xs font-medium border border-slate-700 uppercase tracking-widest">EMBA Class of 2027</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
                                {profile.full_name}
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-300 font-light max-w-3xl leading-relaxed">
                                {profile.headline}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pb-2 items-center">
                            <div className="w-32">
                                <ConnectButton candidateId={profile.id} isConnected={!!isConnected} />
                            </div>
                            <ShareProfile name={profile.full_name || 'Candidate'} role={profile.headline || 'Executive'} />
                            <a href={profile.linkedin_url || "https://linkedin.com"} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="icon" className="rounded-full border-slate-700 bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-[#0077b5] group">
                                    <Linkedin className="h-5 w-5 group-hover:text-[#0077b5]" />
                                </Button>
                            </a>
                            <PrintButton />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. MAIN CONTENT GRID (Blog Layout) */}
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
                                {profile.bio}
                            </p>
                        </section>

                        {/* 3. APPLIED PROJECTS */}
                        <section>
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 border-l-4 border-amber-500 pl-4">Applied Intelligence Portfolio</h3>
                                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800 ml-6"></div>
                            </div>
                            <ProjectList projects={projects || []} profileId={profile.id} isReadOnly={true} />
                        </section>

                        {/* CTA */}
                        <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 text-center border border-slate-100 dark:border-slate-800">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">Interested in this profile?</h3>
                            <p className="text-slate-500 mb-6">Connect to discuss potential advisory roles or leadership opportunities.</p>
                            <OutreachDialog studentId={profile.id} studentName={profile.full_name || 'Candidate'} />
                        </div>
                    </div>

                    {/* RIGHT COLUMN: The Data DNA (Sticky Sidebar) */}
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
                                <ThinkingStyleSection thinkingStyle={thinkingStyle} profileId={profile.id} />
                            </div>

                            <div className="text-center">
                                <Button variant="link" className="text-slate-400 text-xs">
                                    View Full 8-Quarter Curriculum &rarr;
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
