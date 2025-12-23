'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Database } from '@/types/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']

export function ProfileHeader({ profile, isReadOnly = false }: { profile: Profile | null, isReadOnly?: boolean }) {
    // In a real app, we would add "Edit Mode" state here

    return (
        <Card className="border-l-4 border-l-blue-600 shadow-sm">
            <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <Avatar className="h-24 w-24 border-2 border-slate-100">
                        <AvatarImage src="" />
                        <AvatarFallback className="text-xl bg-slate-900 text-slate-50">
                            {profile?.full_name?.substring(0, 2).toUpperCase() || 'EM'}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{profile?.full_name || 'Student Name'}</h2>
                                <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">{profile?.headline || 'Executive MBA Candidate'}</p>
                            </div>
                            {!isReadOnly && <Button variant="outline" size="sm">Edit Profile</Button>}
                        </div>

                        <p className="text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                            {profile?.bio || 'Add a professional bio that highlights your career trajectory and executive intent.'}
                        </p>

                        <div className="flex gap-2 pt-2">
                            <Badge variant="secondary" className="bg-slate-100 text-slate-700">Strategy</Badge>
                            <Badge variant="secondary" className="bg-slate-100 text-slate-700">Operations</Badge>
                            <Badge variant="secondary" className="bg-slate-100 text-slate-700">Leadership</Badge>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
