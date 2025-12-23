'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const fullName = formData.get('full_name') as string
    const headline = formData.get('headline') as string
    const bio = formData.get('bio') as string
    const organization = formData.get('organization') as string
    const location = formData.get('location') as string
    const linkedinUrl = formData.get('linkedin_url') as string
    const isOpenToWork = formData.get('is_open_to_work') === 'on'

    // Avatar Upload Logic
    const avatarFile = formData.get('avatar') as File
    let avatarUrl = null

    if (avatarFile && avatarFile.size > 0) {
        // Validation: Size (1MB)
        if (avatarFile.size > 1024 * 1024) {
            return { error: 'Avatar image exceeds 1MB limit.' }
        }
        // Validation: Image Only
        if (!avatarFile.type.startsWith('image/')) {
            return { error: 'Avatar must be an image file' }
        }

        // 1. Upload
        const fileExt = avatarFile.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}.${fileExt}`
        const filePath = `user_uploads/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, avatarFile)

        if (uploadError) {
            console.error('Upload error:', uploadError)
            return { error: 'Failed to upload image' }
        }

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath)

        avatarUrl = publicUrl
    }

    // CV / Resume Upload Logic
    const resumeFile = formData.get('resume') as File
    let resumeUrl = null

    if (resumeFile && resumeFile.size > 0) {
        // Validation: Size (1MB)
        if (resumeFile.size > 1024 * 1024) {
            return { error: 'Resume exceeds 1MB limit.' }
        }
        // Validation: PDF Only
        if (resumeFile.type !== 'application/pdf') {
            return { error: 'Resume must be a PDF file' }
        }

        const fileName = `${user.id}-CV.pdf` // Standardized name
        const filePath = `user_uploads/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('resumes')
            .upload(filePath, resumeFile, { upsert: true })

        if (uploadError) {
            console.error('Resume upload error:', uploadError)
            return { error: 'Failed to upload resume' }
        }

        const { data: { publicUrl } } = supabase.storage
            .from('resumes')
            .getPublicUrl(filePath)

        resumeUrl = publicUrl
    }

    // 3. Update Profile
    const updateData: any = {
        full_name: fullName,
        headline: headline,
        bio: bio,
        organization: organization,
        location: location,
        linkedin_url: linkedinUrl,
        is_open_to_work: isOpenToWork,
        updated_at: new Date().toISOString()
    }

    if (avatarUrl) {
        updateData.avatar_url = avatarUrl
    }
    if (resumeUrl) {
        updateData.resume_url = resumeUrl
    }

    const { error: dbError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)

    if (dbError) return { error: dbError.message }

    revalidatePath('/student/profile')
    redirect('/student/profile')
}
