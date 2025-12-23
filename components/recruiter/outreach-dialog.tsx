"use client"

import { sendOutreach } from "@/app/recruiter/actions"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquarePlus, Loader2, CheckCircle } from "lucide-react"

interface OutreachDialogProps {
    studentId: string
    studentName: string
    variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
}

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function OutreachDialog({ studentId, studentName }: OutreachDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [guestDetails, setGuestDetails] = useState({ name: "", email: "", company: "", intent: "Start a Conversation" })
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
    const [isGuest, setIsGuest] = useState(false)
    const [user, setUser] = useState<any>(null)

    const router = useRouter()
    const supabase = createClient()

    const handleOpenChange = async (isOpen: boolean) => {
        if (isOpen) {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                setUser(session.user)
                setIsGuest(false)
            } else {
                setUser(null)
                setIsGuest(true)
            }
            setOpen(true)
        } else {
            setOpen(false)
            if (status === 'success') {
                setTimeout(() => {
                    setStatus('idle')
                    setMessage('')
                    setGuestDetails({ name: "", email: "", company: "", intent: "Start a Conversation" })
                }, 300)
            }
        }
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            // If Guest, validate fields
            if (isGuest && (!guestDetails.email || !guestDetails.name)) {
                alert("Please provide your name and email.")
                setLoading(false)
                return
            }

            // Call Server Action
            const result = await sendOutreach(
                studentId,
                guestDetails.intent,
                message,
                isGuest ? { name: guestDetails.name, email: guestDetails.email, company: guestDetails.company } : undefined
            )

            if (result.error) {
                console.error(result.error)
                setStatus('error')
            } else {
                setStatus('success')
                setTimeout(() => {
                    setOpen(false)
                }, 2000)
            }
        } catch (error) {
            console.error('Error sending request:', error)
            setStatus('error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-full shadow-lg shadow-blue-900/20">
                    <MessageSquarePlus className="mr-2 h-5 w-5" /> Request Introduction
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Request Introduction</DialogTitle>
                    <DialogDescription>
                        Send a message to <strong>{studentName}</strong> to express your interest.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {status === 'success' ? (
                        <div className="flex flex-col items-center justify-center py-8 text-green-600">
                            <CheckCircle className="h-12 w-12 mb-4" />
                            <p className="text-lg font-semibold">Request Sent Successfully!</p>
                            <p className="text-sm text-slate-500">We'll be in touch shortly.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {isGuest && (
                                <div className="grid gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                            <Label>Name</Label>
                                            <Input placeholder="John Doe" value={guestDetails.name} onChange={e => setGuestDetails({ ...guestDetails, name: e.target.value })} />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Company</Label>
                                            <Input placeholder="Acme Corp" value={guestDetails.company} onChange={e => setGuestDetails({ ...guestDetails, company: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Email</Label>
                                        <Input placeholder="john@company.com" type="email" value={guestDetails.email} onChange={e => setGuestDetails({ ...guestDetails, email: e.target.value })} />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1">
                                <Label>Purpose</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={guestDetails.intent || 'Start a Conversation'}
                                    onChange={e => setGuestDetails({ ...guestDetails, intent: e.target.value })}
                                >
                                    <option value="Start a Conversation">Start a Conversation</option>
                                    <option value="Hiring / Recruitment">Hiring / Recruitment</option>
                                    <option value="Capstone Project">Capstone Project</option>
                                    <option value="Advisory Role">Advisory Role</option>
                                    <option value="Mentorship">Mentorship</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <Label>Message</Label>
                                <Textarea
                                    placeholder={isGuest ? "Hi, I'd like to discuss a potential role..." : "Hi, I'm interested in discussing..."}
                                    className="min-h-[100px]"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                    {status === 'error' && (
                        <p className="text-sm text-red-500">Failed to send request. Please try again.</p>
                    )}
                </div>

                {status !== 'success' && (
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={loading || !message.trim() || (isGuest && !guestDetails.email)}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send Request"}
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    )
}
