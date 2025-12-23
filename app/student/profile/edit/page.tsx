
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { updateProfile } from '@/app/student/actions'
import { ArrowLeft, Upload } from 'lucide-react'
import Link from 'next/link'
import { ProfileEditForm } from '@/components/student/profile-edit-form'

export default async function EditProfilePage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/student/profile">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Your Profile</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Core Information</CardTitle>
                        <CardDescription>
                            This information is visible to recruiters and shapes your "Legacy Narrative".
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ProfileEditForm profile={profile} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

