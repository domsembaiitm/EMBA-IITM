'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

import { sendRecruiterNotification } from '@/lib/email-service'

export async function connectWithCandidate(candidateId: string) {
    // Legacy simple connect
    return sendOutreach(candidateId, "Start a Conversation", "I'm interested in your profile.")
}

export async function sendOutreach(candidateId: string, intent: string, message: string, guestDetails?: { name: string, email: string, company: string }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // 1. Resolve Recruiter Identity
    let recruiterId = user?.id || '00000000-0000-0000-0000-000000000000'
    let recruiterName = guestDetails?.name || user?.email || 'A Recruiter'
    let companyName = guestDetails?.company || 'Confidential'

    // If logged in, try to fetch profile for better name
    if (user) {
        // Fetch recruiter profile logic if exists, else fallback to email
        recruiterName = user.email || 'Verified Recruiter'
    }

    // 2. Fetch Student Email (Securely)
    // We need the student's email to send notification. 
    // This requires admin/service-role if RLS prevents reading emails of others.
    // For now, we assume public profiles might not expose email directly, 
    // so we use a secure query or just log it if we can't access it.
    // Note: 'profiles' usually has email column or we join auth.users (not possible from client SDK easily).
    // Assuming 'email' is in public.profiles or we skip actual email dispatch if privacy restricted.

    // For MVP/Demo: Fetch profile directly
    const { data: student } = await supabase.from('profiles').select('email, full_name').eq('id', candidateId).single()

    // 2. RATE LIMIT CHECK
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    // Only check if we have a real user (not guest)
    if (user) {
        const { count } = await supabase
            .from('recruiter_interactions')
            .select('*', { count: 'exact', head: true })
            .eq('recruiter_id', user.id)
            .gte('created_at', oneHourAgo)

        if (count && count >= 10) {
            return { error: 'Rate limit exceeded. Max 10 connections/hour.' }
        }
    }

    // 3. Record Interaction
    const { error } = await supabase
        .from('recruiter_interactions')
        .upsert({
            recruiter_id: recruiterId,
            student_id: candidateId,
            status: 'interested',
            message: message,
            metadata: { intent, guest: guestDetails }
        }, { onConflict: 'recruiter_id, student_id' })

    if (error) {
        return { error: error.message }
    }

    // 4. Send Notification (Stub for Resend/SMTP)
    // console.log("Sending email to", student?.email)
    // In production: await resend.send(...)

    // 5. AUDIT LOG
    await supabase.from('audit_logs').insert({
        actor_id: user.id,
        action: 'CONNECT_REQUEST',
        target_id: candidateId,
        metadata: { timestamp: new Date().toISOString() }
    })

    revalidatePath(`/recruiter/candidate/${candidateId}`)
    return { success: true }
}
