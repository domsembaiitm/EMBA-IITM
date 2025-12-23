'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, ArrowRight, Zap, TrendingUp, Quote, CheckCircle2, Lightbulb } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface TransformationProps {
    data: {
        identity: { title: string, domain: string, focus: string }
        journey: { before: string, after: string, intervention_desc: string }
        catalysts: { code: string, name: string }[]
        rationale?: string
        quote: string
        color?: string
    }
}

// Map color strings to Tailwind classes safely
const getColorClasses = (color: string = 'blue') => {
    const map: Record<string, any> = {
        blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-800' },
        indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', badge: 'bg-indigo-100 text-indigo-800' },
        purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-800' },
        emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-800' },
        orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-800' },
        red: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', badge: 'bg-red-100 text-red-800' },
        rose: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', badge: 'bg-rose-100 text-rose-800' },
        cyan: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', badge: 'bg-cyan-100 text-cyan-800' },
        slate: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', badge: 'bg-slate-200 text-slate-800' },
        zinc: { bg: 'bg-zinc-50', text: 'text-zinc-700', border: 'border-zinc-200', badge: 'bg-zinc-200 text-zinc-800' },
        violet: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', badge: 'bg-violet-100 text-violet-800' },
        amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-800' },
        stone: { bg: 'bg-stone-50', text: 'text-stone-700', border: 'border-stone-200', badge: 'bg-stone-200 text-stone-800' },
        pink: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', badge: 'bg-pink-100 text-pink-800' },
    }
    return map[color] || map['blue']
}

export function TransformationArc({ data }: TransformationProps) {
    const theme = getColorClasses(data.color)

    return (
        <Card className="border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden relative group font-sans">
            {/* Elegant Top Bar */}
            <div className={`h-2 w-full ${theme.bg.replace('50', '500')}`}></div>

            <CardContent className="p-8 space-y-8">

                {/* 1. EXECUTIVE IDENTITY HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className={`${theme.badge} border-none uppercase tracking-widest text-[10px] px-2 py-0.5 font-semibold`}>
                                {data.identity.domain}
                            </Badge>
                            <span className="text-xs text-slate-400 font-medium tracking-wide">EXECUTIVE ARCHETYPE</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 dark:text-white leading-tight">
                            {data.identity.title}
                        </h2>
                    </div>
                    <div className="hidden md:block text-right">
                        <div className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">STRATEGIC FOCUS</div>
                        <div className={`font-semibold ${theme.text}`}>{data.identity.focus}</div>
                    </div>
                </div>

                {/* 2. THE TRANSFORMATION BRIDGE (Before/After) */}
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6">
                    {/* Before */}
                    <div className="md:col-span-2 text-center md:text-left">
                        <div className="text-xs font-bold text-slate-400 mb-1">FORMERLY</div>
                        <div className="text-lg text-slate-600 font-serif italic">"{data.journey.before}"</div>
                    </div>

                    {/* Bridge Graphic */}
                    <div className="md:col-span-3 flex flex-col items-center justify-center relative py-4 md:py-0">
                        <div className="w-full h-px bg-slate-300 absolute top-1/2 -z-10"></div>
                        <div className="bg-white dark:bg-slate-900 px-4 py-1 border border-slate-200 rounded-full shadow-sm z-10 flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">EMBA Intervention</span>
                            <ArrowRight className="h-3 w-3 text-slate-400" />
                        </div>
                    </div>

                    {/* After */}
                    <div className="md:col-span-2 text-center md:text-right">
                        <div className="text-xs font-bold text-slate-400 mb-1">NOW</div>
                        <div className={`text-lg font-bold ${theme.text}`}>{data.identity.title}</div>
                    </div>
                </div>

                {/* 3. THE PERSUASION LAYER (Rationale + Catalysts) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Why this works (Rationale) */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200 flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-amber-500" />
                            Strategic Rationale
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-l-2 border-slate-200 pl-4">
                            {data.rationale || "Combines deep functional expertise with broad strategic vision."}
                        </p>

                        {/* Quote */}
                        <div className="pt-4 mt-4 border-t border-slate-100">
                            <p className="text-xs italic text-slate-500">"{data.quote}"</p>
                        </div>
                    </div>

                    {/* Evidence (Courses) */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200 flex items-center gap-2">
                            <Zap className={`h-4 w-4 ${theme.text}`} />
                            Evidence Catalysts
                        </h4>
                        <ul className="space-y-2">
                            {data.catalysts.map((c, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                    <div>
                                        <span className="font-semibold text-slate-700 dark:text-slate-200">{c.name}</span>
                                        <span className="text-xs text-slate-400 ml-1">({c.code})</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

            </CardContent>
        </Card>
    )
}
