'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowUpRight, BarChart2 } from 'lucide-react'
import Link from 'next/link'
import { resolveAvatarUrl } from '@/lib/image-helper'

export function CandidateGrid({ candidates }: { candidates: { id: string, full_name: string | null, headline: string | null, bio: string | null, avatar_url?: string | null, thinking_styles: { risk_appetite: number, leadership_posture: number }[] }[] }) {
    if (candidates.length === 0) {
        return (
            <div className="text-center py-20">
                <h3 className="text-lg text-slate-500">No candidates match your filters.</h3>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((candidate) => {
                const thinking = candidate.thinking_styles?.[0]

                return (
                    <Card key={candidate.id} className="group hover:border-blue-500/30 transition-all hover:shadow-xl dark:bg-slate-900 border-slate-200">
                        <CardHeader className="flex flex-row items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="aspect-square relative overflow-hidden bg-slate-100 h-16 w-16 rounded-full border border-slate-200 shadow-sm">
                                <img
                                    src={resolveAvatarUrl(candidate.avatar_url)}
                                    alt={candidate.full_name || 'Candidate Avatar'}
                                    loading="lazy"
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-serif font-bold text-lg truncate text-slate-900 dark:text-slate-100">
                                    {candidate.full_name}
                                </h3>
                                <p className="text-sm text-slate-500 truncate font-medium">{candidate.headline}</p>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4 pt-4">
                            {/* Thinking Style Signals */}
                            <div className="flex gap-2 mb-2">
                                {thinking?.risk_appetite > 7 ? (
                                    <Badge variant="outline" className="rounded-full px-3 py-0.5 text-[10px] tracking-wide font-semibold border-amber-200 text-amber-800 bg-amber-50 uppercase">High Risk</Badge>
                                ) : (
                                    <Badge variant="outline" className="rounded-full px-3 py-0.5 text-[10px] tracking-wide font-semibold border-slate-200 text-slate-600 bg-slate-50 uppercase">Balanced</Badge>
                                )}
                                {thinking?.leadership_posture > 7 ? (
                                    <Badge variant="outline" className="rounded-full px-3 py-0.5 text-[10px] tracking-wide font-semibold border-indigo-200 text-indigo-800 bg-indigo-50 uppercase">Driver</Badge>
                                ) : (
                                    <Badge variant="outline" className="rounded-full px-3 py-0.5 text-[10px] tracking-wide font-semibold border-blue-200 text-blue-800 bg-blue-50 uppercase">Consensus</Badge>
                                )}
                            </div>

                            <div className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed line-clamp-3">
                                &quot;{candidate.bio}&quot;
                            </div>
                        </CardContent>

                        <CardFooter className="pt-2 pb-5">
                            <Link href={`/recruiter/candidate/${candidate.id}`} className="w-full">
                                <Button className="w-full gap-2 rounded-full font-medium text-sm transition-all bg-slate-900 hover:bg-blue-700 text-white h-10 shadow-lg shadow-slate-900/10">
                                    View Executive Profile <ArrowUpRight className="h-3 w-3" />
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
    )
}
