
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CandidateFilter } from '@/components/recruiter/candidate-filter'
import { CandidateGrid } from '@/components/recruiter/candidate-grid'
import { SearchToolbar } from '@/components/recruiter/search-toolbar'
// import { embaStudents } from '@/lib/data/seeds' // REMOVED
import { getDomainFromProfile } from '@/lib/domain-mapper'

export default async function RecruiterDiscoverPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // FILTER LOGIC
    const pendingParams = await searchParams

    let query = supabase
        .from('profiles')
        .select(`
            id,
            full_name,
            headline,
            bio,
            organization,
            avatar_url,
            is_open_to_work,
            domain,
            thinking_styles (
                risk_appetite,
                leadership_posture
            )
        `)
        .eq('role', 'student')
        .eq('is_hidden', false)

    // 1. Availability
    if (pendingParams.available === 'true') {
        query = query.eq('is_open_to_work', true)
    }

    // 2. Domain (Server-Side)
    // Note: This relies on the new 'domain' column in profiles.
    if (pendingParams.domain) {
        query = query.eq('domain', pendingParams.domain)
    }

    // 3. Text Search (Server-Side)
    const queryTerm = typeof pendingParams.q === 'string' ? pendingParams.q : null
    if (queryTerm) {
        const q = `%${queryTerm}%`
        query = query.or(`full_name.ilike.${q},headline.ilike.${q},bio.ilike.${q},organization.ilike.${q}`)
    }

    const { data: rawCandidates, error } = await query

    if (error) {
        console.error("Error fetching candidates:", error)
        return <div>Error loading candidates</div>
    }

    // Post-process candidates
    let candidates = rawCandidates?.map(c => ({
        id: c.id,
        full_name: c.full_name,
        headline: `${c.headline} • ${c.organization || 'Corporate'}`,
        bio: c.bio,
        avatar_url: c.avatar_url,
        is_open_to_work: c.is_open_to_work,
        domain: c.domain || getDomainFromProfile(c.headline || '', c.organization || ''), // Fallback to calculation if null (e.g. pre-migration)
        thinking_styles: c.thinking_styles
    })) || []

    // 4. Risk Filter (In-Memory for now as it requires complex relational filtering)
    if (pendingParams.risk) {
        const minRisk = parseInt(pendingParams.risk as string)
        candidates = candidates.filter(c => c.thinking_styles?.[0]?.risk_appetite >= minRisk)
    }

    // 5. Client-Side Text Search Fallback (Double check or removal? Removal preferred if server side covers it)
    // We already filtered by text on server, so we can remove the valid client side filter.


    // 4. Style Filter (In-Memory) is tricky without mapping, skipping for MVP stability.

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
            {/* Sidebar Filter */}
            <aside className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 overflow-y-auto hidden md:block">
                <h2 className="text-xl font-bold mb-6 tracking-tight">Talent Discovery</h2>
                <CandidateFilter />
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-6xl mx-auto space-y-6">
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-serif text-slate-900 dark:text-slate-50">Executive Talent Pool</h1>
                            <p className="text-slate-500 mt-2 text-lg">
                                Curated profiles from the <span className="font-semibold text-slate-900">Class of 2027</span>.
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <SearchToolbar />
                        </div>
                    </div>

                    <CandidateGrid candidates={candidates} />
                </div>
            </main>

            {!user && (
                <div className="fixed bottom-4 right-4 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-xs font-bold shadow-lg border border-amber-200">
                    GUEST MODE (Limited View)
                </div>
            )}
        </div>
    )
}
