'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'

export function CandidateFilter() {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Helper to update params
    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            if (value === null || value === '') {
                params.delete(name)
            } else {
                params.set(name, value)
            }
            return params.toString()
        },
        [searchParams]
    )

    const updateFilter = (name: string, value: string) => {
        router.push('?' + createQueryString(name, value))
    }

    // State Sync
    const isAvailable = searchParams.get('available') === 'true'
    const currentStyle = searchParams.get('style') || ''
    const currentDomain = searchParams.get('domain') || ''
    const riskLevel = parseInt(searchParams.get('risk') || '0')

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Availability</Label>
                    <Switch
                        checked={isAvailable}
                        onCheckedChange={(checked) => updateFilter('available', checked ? 'true' : '')}
                    />
                </div>
                <p className="text-xs text-muted-foreground">Only show candidates Open to Work</p>
            </div>

            <div className="space-y-4">
                <Label>Thinking Style</Label>
                <div className="grid grid-cols-2 gap-2">
                    {['Analytical', 'Intuitive', 'Consensus', 'Directive'].map(style => (
                        <Button
                            key={style}
                            variant={currentStyle === style ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateFilter('style', currentStyle === style ? '' : style)}
                            className="justify-start"
                        >
                            {style}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <Label>Industry Exposure</Label>
                <div className="flex flex-wrap gap-2">
                    {['Technology', 'BFSI', 'Manufacturing', 'Healthcare', 'Consulting'].map(domain => (
                        <Badge
                            key={domain}
                            variant={currentDomain === domain ? 'default' : 'secondary'}
                            className="cursor-pointer hover:opacity-80"
                            onClick={() => updateFilter('domain', currentDomain === domain ? '' : domain)}
                        >
                            {domain}
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <Label>Min. Risk Appetite ({riskLevel}+)</Label>
                <Slider
                    value={[riskLevel]}
                    max={10}
                    step={1}
                    onValueChange={(val) => updateFilter('risk', val[0].toString())}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Conservative</span>
                    <span>Risk-Taker</span>
                </div>
            </div>

            <div className="pt-4 border-t">
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push('/recruiter/discover')}
                >
                    Reset Filters
                </Button>
            </div>
        </div>
    )
}
