
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
    // Initialize Admin Client (Bypass RLS)
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    try {
        // 1. Fetch all students
        const { data: profiles, error: fetchError } = await supabase
            .from('profiles')
            .select('id, full_name, role')
            .eq('role', 'student')

        if (fetchError) throw fetchError
        if (!profiles) return NextResponse.json({ message: 'No profiles found' })

        const results = []

        // 2. Iterate and Upload
        for (const profile of profiles) {
            const initials = profile.full_name?.substring(0, 2) || 'EX'
            const seed = encodeURIComponent(profile.full_name || 'student')

            // A. Fetch Avatar from DiceBear
            const response = await fetch(`https://api.dicebear.com/9.x/initials/png?seed=${seed}&backgroundColor=0f172a&textColor=ffffff&size=512`)
            const arrayBuffer = await response.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)

            // B. Upload to Storage
            const fileName = `${profile.id}.png` // Keeping it simple: ID.png. Easier to replace later.
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, buffer, {
                    contentType: 'image/png',
                    upsert: true
                })

            if (uploadError) {
                console.error(`Failed to upload for ${profile.full_name}:`, uploadError)
                results.push({ id: profile.id, status: 'failed_upload', error: uploadError.message })
                continue
            }

            // C. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName)

            // D. Update Profile with NEW URL
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', profile.id)

            if (updateError) {
                results.push({ id: profile.id, status: 'failed_update', error: updateError.message })
            } else {
                results.push({ id: profile.id, status: 'success', url: publicUrl })
            }
        }

        return NextResponse.json({
            success: true,
            processed: results.length,
            details: results
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
