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

    // 4. Send Notification
    if (student?.email) {
        await sendRecruiterNotification(student.email, student.full_name || 'Student', recruiterName, companyName, intent, message)
    } else {
        console.warn("Could not email student: Email not found in profile.")
    }

    revalidatePath(`/recruiter/candidate/${candidateId}`)
    return { success: true }
}
