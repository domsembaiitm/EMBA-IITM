'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    // Type-casting here for simplicity, but in production use Zod
    let email = formData.get('email') as string
    const password = formData.get('password') as string
    const role = formData.get('role') as string // 'student' or 'recruiter'

    // 1. Normalize Email (Allow ID-only login)
    if (email && !email.includes('@')) {
        email = `${email.trim()}@emba.iitm.ac.in`
    }

    if (!email || !password) {
        return { error: 'Email and password are required' }
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (signInError) {
        return { error: 'Invalid credentials' }
    }

    // [SECURE] Fetch the actual role from the database, do not trust the form input
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Login failed' }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    const dbRole = profile?.role

    revalidatePath('/', 'layout')

    let target = '/'
    if (dbRole === 'recruiter') {
        target = '/recruiter/discover'
    } else if (dbRole === 'student') {
        target = '/student/profile' // Redirects to their own profile usually
    } else if (dbRole === 'admin') {
        target = '/admin/cohort'
    }

    return { success: true, redirectUrl: target }
}

// ADMIN ACTIONS

export async function toggleProfileVisibility(profileId: string, isHidden: boolean) {
    const supabase = await createClient()

    // 1. Verify Admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Double check DB role
    const { data: adminProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (adminProfile?.role !== 'admin') return { error: 'Unauthorized: Admin only' }

    // 2. Update
    const { error } = await supabase.from('profiles').update({ is_hidden: isHidden }).eq('id', profileId)

    if (error) return { error: error.message }

    revalidatePath('/admin/cohort')
    return { success: true }
}

export async function signup(formData: FormData) {
    // Disabled for Production as per User Request ("only 49.. any additional user should get added only via the admin")
    return { error: 'Self-signup is disabled. Please contact the administrator.' }
}
