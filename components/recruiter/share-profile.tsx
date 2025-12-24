'use client'

import { Button } from '@/components/ui/button'
import { Share2, Check, Link as LinkIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export function ShareProfile({ name, role }: { name: string, role?: string }) {
    const [copied, setCopied] = useState(false)

    const handleShare = async () => {
        if (typeof window === 'undefined') return

        const url = window.location.href
        const title = `${name} - EMBA Profile`
        const text = `Check out ${name}'s executive profile.`

        // 1. Try Native Share Sheet (Mobile/Safari)
        if (navigator.share) {
            try {
                await navigator.share({ title, text, url })
                return
            } catch (err) {
                // User cancelled or share failed, fall through to clipboard
                console.log('Share sheet refused, falling back to clipboard')
            }
        }

        // 2. Fallback to Clipboard
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            toast.success("Profile link copied to clipboard")
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            toast.error("Failed to copy link")
        }
    }

    return (
        <Button
            variant="outline"
            size="icon"
            className="rounded-full border-slate-700 bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-800"
            onClick={handleShare}
            title="Share Profile"
        >
            {copied ? <Check className="h-5 w-5 text-green-500" /> : <Share2 className="h-5 w-5" />}
        </Button>
    )
}
