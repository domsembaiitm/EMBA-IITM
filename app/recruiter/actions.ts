'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function connectWithCandidate(candidateId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'You must be logged in to connect.' }
    }

    // Check availability
    // In a real app, verify user.role is recruiter

    const { error } = await supabase
        .from('recruiter_interactions')
        .insert({
            recruiter_id: user.id,
            student_id: candidateId,
            status: 'interested'
        })

    if (error) {
        if (error.code === '23505') { // Unique violation
            return { message: 'Already connected' }
        }
        return { error: error.message }
    }

    revalidatePath(`/recruiter/candidate/${candidateId}`)
    return { success: true }
}
