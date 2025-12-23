'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login, signup } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setError(null)

        const res = await login(formData)

        if (res?.error) {
            setError(res.error)
            setIsLoading(false)
        } else if (res?.success && res?.redirectUrl) {
            // Success - Redirect client side
            router.push(res.redirectUrl)
        } else {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <div className="absolute inset-0 bg-grid-slate-200/[0.2] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.2] -z-10" />
            <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-950/50 -z-10" />

            <Card className="w-full max-w-md shadow-2xl border-slate-200 dark:border-slate-800 backdrop-blur-sm bg-white/95 dark:bg-slate-900/95">
                <CardHeader className="space-y-3 text-center pb-8 border-b border-slate-100 dark:border-slate-800">
                    <div className="mx-auto w-12 h-12 bg-slate-900 text-white flex items-center justify-center rounded-full mb-2">
                        <span className="font-serif font-bold text-xl">D</span>
                    </div>
                    <CardTitle className="text-2xl font-serif font-bold tracking-tight text-slate-900 dark:text-white">Executive Access</CardTitle>
                    <CardDescription className="text-base">
                        DOMS IIT Madras • Class of 2027
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="student" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="student">Student / Alumni</TabsTrigger>
                            <TabsTrigger value="admin">Administrator</TabsTrigger>
                        </TabsList>

                        {/* STUDENT LOGIN */}
                        <TabsContent value="student">
                            <form action={handleSubmit}>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Student ID</Label>
                                        <Input id="email" name="email" placeholder="MS25W048" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input id="password" name="password" type="password" required />
                                    </div>
                                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                                        Login to Portfolio
                                    </Button>
                                </div>
                            </form>
                        </TabsContent>

                        {/* ADMIN LOGIN */}
                        <TabsContent value="admin">
                            <form action={handleSubmit}>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="admin-email">Admin Email</Label>
                                        <Input id="admin-email" name="email" placeholder="admin@emba.iitm.ac.in" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="admin-password">Password</Label>
                                        <Input id="admin-password" name="password" type="password" required />
                                    </div>
                                    <Button type="submit" className="w-full bg-slate-900 text-white hover:bg-slate-800">
                                        Access Dashboard
                                    </Button>
                                </div>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
