'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { connectWithCandidate } from '@/app/recruiter/actions'
import { UserPlus, Check } from 'lucide-react'
import { toast } from 'sonner'

export function ConnectButton({ candidateId, isConnected }: { candidateId: string, isConnected: boolean }) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>(isConnected ? 'success' : 'idle')

    async function handleConnect() {
        setStatus('loading')
        const result = await connectWithCandidate(candidateId)

        if (result?.error) {
            // alert(result.error)
            setStatus('idle')
        } else if (result?.message === 'Already connected') {
            setStatus('success')
        } else {
            setStatus('success')
        }
    }

    if (status === 'success') {
        return (
            <Button disabled className="w-full bg-green-600 text-white hover:bg-green-700">
                <Check className="mr-2 h-4 w-4" /> Connected
            </Button>
        )
    }

    return (
        <Button
            onClick={handleConnect}
            disabled={status === 'loading'}
            className="w-full bg-blue-600 hover:bg-blue-700"
        >
            <UserPlus className="mr-2 h-4 w-4" />
            {status === 'loading' ? 'Connecting...' : 'Connect'}
        </Button>
    )
}
