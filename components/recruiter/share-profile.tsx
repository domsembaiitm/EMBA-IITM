'use client'

import { Button } from '@/components/ui/button'
import { Share2, Check } from 'lucide-react'
import { useState } from 'react'

export function ShareProfile({ name, role }: { name: string, role?: string }) {
    const [copied, setCopied] = useState(false)

    const handleShare = async () => {
        if (typeof window !== 'undefined') {
            try {
                await navigator.clipboard.writeText(window.location.href)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
            } catch (err) {
                // Fallback or Alert
                alert("Could not copy link. URL: " + window.location.href)
            }
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
