

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Eye, EyeOff, CheckCircle } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { toggleProfileVisibility } from '@/app/auth/actions'

export default async function AdminCohortPage() {
    const supabase = await createClient()

    // Secure: Fetch all student profiles
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .order('full_name', { ascending: true })

    if (error) {
        return <div>Error loading cohort data</div>
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <Users className="h-8 w-8 text-blue-600" />
                            Cohort Master View
                        </h1>
                        <p className="text-slate-500 mt-2">admin.access_level: <span className="font-mono text-xs bg-slate-200 px-2 py-0.5 rounded">ROOT</span></p>
                    </div>
                    <Link href="/">
                        <Button variant="outline">Exit to Home</Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Active Student Profiles ({profiles?.length || 0})</CardTitle>
                        <CardDescription>
                            Direct access to any student profile for demonstration purposes.
                            <span className="text-amber-600 ml-2 font-medium">⚠ "Login As" forces a session override</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Current Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {profiles?.map((student) => (
                                    <TableRow key={student.id} className={student.is_hidden ? 'opacity-50 bg-slate-50' : ''}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full overflow-hidden bg-slate-200">
                                                    <img src={student.avatar_url || ''} alt="" className="h-full w-full object-cover" />
                                                </div>
                                                {student.full_name}
                                                {student.is_hidden && <Badge variant="destructive" className="ml-2 text-[10px] h-5">HIDDEN</Badge>}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-500 uppercase">{student.organization || 'N/A'}</span>
                                                <span className="text-sm truncate max-w-[200px]">{student.headline || 'Student'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <Badge variant="secondary">{student.work_experience ? Math.floor(student.work_experience / 12) : 0} Yrs</Badge>
                                                {/* User requested check for credentials logic here later? */}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/recruiter/candidate/${student.id}`}>
                                                    <Button size="sm" variant="ghost">
                                                        <Eye className="h-4 w-4 mr-1" /> View
                                                    </Button>
                                                </Link>

                                                <form action={async () => {
                                                    'use server'
                                                    await toggleProfileVisibility(student.id, !student.is_hidden)
                                                }}>
                                                    <Button size="sm" variant={student.is_hidden ? "default" : "secondary"} className="text-xs">
                                                        {student.is_hidden ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                                                        {student.is_hidden ? 'Unhide' : 'Hide'}
                                                    </Button>
                                                </form>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

