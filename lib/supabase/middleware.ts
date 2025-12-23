
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const isDemo = request.cookies.has('demo-mode')
    if (
        !user &&
        !request.nextUrl.pathname.startsWith('/login') &&
        !request.nextUrl.pathname.startsWith('/auth') &&
        !request.nextUrl.pathname.startsWith('/recruiter') && // Allow public access to 'Talent Blog'
        request.nextUrl.pathname !== '/'
    ) {
        // no user, redirect to login
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // Role-Based Access Control (RBAC)
    if (user) {
        // We need to fetch the profile to know the role in Middleware
        // NOTE: In high-scale apps, store role in JWT metadata (app_metadata) to avoid this DB call on every request.
        // For MVP, checking DB or assuming metadata availability (if set on sign up).
        // Let's assume we fetch it or it's in metadata.
        // For now, simpler approach: we don't query DB here to keep middleware fast,
        // we rely on Layout/Page checks OR we can hack it by checking a cookie or relying on optimistic checks.
        // BUT, for strictness: let's fetch profile.

        // However, Supabase middleware client is for auth management.
        // Let's trust the Client Component protection for deep security, but add basic route guards.

        // Correct Pattern: Use `supabase.auth.getUser()` which returns the JWT.
        // If we put custom claims in JWT, we can check role. 
        // Without custom claims, we must query DB.

        // Let's query DB for role to be safe (MVP scale is low).

        // Optimization: For now, we will SKIP the DB query in middleware to avoid perf hit, 
        // and rely on Layouts to redirect if Unauthorized. 
        // Wait, the PROMPT req is Strict RBAC.

        // Let's add basic path segmentation enforcement IF we can efficiently.
        // actually, supabase.from('profiles').select('role').eq('id', user.id).single() is fast.

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user!.id)
            .single()

        const role = profile?.role
        const path = request.nextUrl.pathname

        if (path.startsWith('/student') && role !== 'student') {
            // Redirect Recruiter trying to access Student raw pages? 
            // Actually Recruiters VIEW students, but usually via /recruiter/student-view/...
            // If /student/profile is the "My Profile" edit page, then yes, block.
            const url = request.nextUrl.clone()
            url.pathname = '/' // or 403
            return NextResponse.redirect(url)
        }

    }

    return supabaseResponse
}
