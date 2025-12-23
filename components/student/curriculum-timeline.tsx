'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { embaCurriculum } from '@/lib/data/curriculum'
import { CheckCircle2, BookOpen, Star } from 'lucide-react'

export function CurriculumTimeline() {
    // Group by Quarter
    const quarters = [1, 2, 3, 4, 5, 6, 7, 8]

    return (
        <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="px-0">
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                    Academic Journey
                </CardTitle>
                <p className="text-slate-500">
                    A rigorous 24-month engagement covering 198 Credits across Functional Foundations, Integrated Perspectives, and Global Leadership.
                </p>
            </CardHeader>
            <CardContent className="px-0">
                <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 space-y-12 pb-12">
                    {quarters.map((q) => {
                        const courses = embaCurriculum.filter(c => c.quarter === q)
                        const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0)

                        return (
                            <div key={q} className="relative pl-8">
                                {/* Time Marker */}
                                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-blue-600 ring-4 ring-white dark:ring-slate-950" />

                                <div className="mb-4">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                        Quarter {q}
                                        <Badge variant="secondary" className="text-xs font-normal">
                                            {totalCredits} Credits
                                        </Badge>
                                    </h3>
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        {q <= 2 ? 'Functional Foundation' : q >= 7 ? 'Global Leadership' : 'Integrated Perspective'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
                                    {courses.map((c) => (
                                        <div key={c.code} className={`
                                            p-3 rounded-lg border text-sm
                                            ${c.type === 'Project'
                                                ? 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900'
                                                : 'bg-white border-slate-100 dark:bg-slate-900 dark:border-slate-800'}
                                        `}>
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-semibold text-slate-800 dark:text-slate-200">{c.code}</span>
                                                {c.type === 'Project' && <Star className="h-3 w-3 text-amber-500 fill-amber-500" />}
                                                {c.type === 'Core' && <Badge variant="outline" className="text-[10px] h-4 px-1">Core</Badge>}
                                                {c.type === 'Elective' && <Badge variant="outline" className="text-[10px] h-4 px-1 bg-slate-50 text-slate-500">Elective</Badge>}
                                            </div>
                                            <p className={`line-clamp-2 ${c.type === 'Project' ? 'font-bold text-amber-900 dark:text-amber-100' : 'text-slate-600 dark:text-slate-400'}`}>
                                                {c.name}
                                            </p>
                                            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                                                <span>{c.category}</span>
                                                <span>{c.credits} Cr</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
