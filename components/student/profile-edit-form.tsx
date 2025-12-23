'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { updateProfile } from '@/app/student/actions'
import Link from 'next/link'
import { useState } from 'react'
import { resolveAvatarUrl } from '@/lib/image-helper'
import { toast } from 'sonner' // Assuming sonner or use standard alert if not available, falling back to simple alert for now if no toast lib installed or I'll check hooks.
// Actually, standard alert is safest if I don't know the toast lib setup, but I'll use a simple state message.

export function ProfileEditForm({ profile }: { profile: any }) {
    const [error, setError] = useState<string | null>(null)

    // Client-side validation handler
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'pdf') => {
        const file = e.target.files?.[0]
        if (file) {
            // 1MB Limit
            if (file.size > 1024 * 1024) {
                setError(`File ${file.name} is too large. Maximum size is 1MB.`)
                e.target.value = '' // Clear input
                return
            }

            // Format Limit
            if (type === 'image' && !file.type.startsWith('image/')) {
                setError('Profile photo must be an image file.')
                e.target.value = ''
                return
            }
            if (type === 'pdf' && file.type !== 'application/pdf') {
                setError('Resume must be a PDF file.')
                e.target.value = ''
                return
            }
            setError(null)
        }
    }

    async function handleSubmit(formData: FormData) {
        const result = await updateProfile(formData)
        if (result?.error) {
            setError(result.error)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                    {error}
                </div>
            )}

            {/* Avatar */}
            <div className="space-y-4">
                <Label>Profile Assets</Label>
                <div className="flex items-center gap-6">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="avatar" className="text-xs text-slate-500">Profile Photo (Max 1MB)</Label>
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full overflow-hidden bg-slate-200 border">
                                <img src={resolveAvatarUrl(profile?.avatar_url)} alt="" className="h-full w-full object-cover" />
                            </div>
                            <Input
                                id="avatar"
                                name="avatar"
                                type="file"
                                accept="image/*"
                                className="max-w-xs"
                                onChange={(e) => handleFileChange(e, 'image')}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 flex-1">
                        <Label htmlFor="resume" className="text-xs text-slate-500">CV / Resume (PDF, Max 1MB)</Label>
                        <Input
                            id="resume"
                            name="resume"
                            type="file"
                            accept=".pdf"
                            className="w-full"
                            onChange={(e) => handleFileChange(e, 'pdf')}
                        />
                        {profile?.resume_url && (
                            <p className="text-xs text-green-600 flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                Resume on file
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input id="full_name" name="full_name" defaultValue={profile?.full_name || ''} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="organization">Organization</Label>
                    <Input id="organization" name="organization" defaultValue={profile?.organization || ''} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="work_experience">Work Experience (Months)</Label>
                    <Input id="work_experience" name="work_experience" type="number" defaultValue={profile?.work_experience || 0} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" defaultValue={profile?.location || ''} />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="headline">Headline</Label>
                <Input id="headline" name="headline" defaultValue={profile?.headline || ''} required />
                <p className="text-xs text-slate-500">E.g. "Operations Leader specializing in AI Transformation"</p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="bio">Executive Bio</Label>
                <Textarea id="bio" name="bio" defaultValue={profile?.bio || ''} className="h-32" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" defaultValue={profile?.location || ''} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                    <Input id="linkedin_url" name="linkedin_url" defaultValue={profile?.linkedin_url || ''} placeholder="https://linkedin.com/in/..." />
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <input type="checkbox" id="is_open_to_work" name="is_open_to_work" defaultChecked={profile?.is_open_to_work} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <Label htmlFor="is_open_to_work">Open to new opportunities</Label>
            </div>

            <div className="pt-4 flex justify-end gap-2">
                <Link href="/student/profile">
                    <Button variant="outline">Cancel</Button>
                </Link>
                <Button type="submit">Save Changes</Button>
            </div>
        </form>
    )
}
