'use client'

import { embaCurriculum } from '@/lib/data/curriculum'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PieChart, Zap, Globe, Layers, BookOpen } from 'lucide-react'

export function CompetencyMap() {
    // Calculate Credits by Category
    const cats = {
        'Functional Foundation': 0,
        'Integrated Perspective': 0,
        'Global Leadership': 0
    }
    const projects = 18 // Fixed per curriculum images (3 * 6)

    embaCurriculum.forEach(c => {
        if (c.type !== 'Project' && c.category in cats) {
            cats[c.category as keyof typeof cats] += c.credits
        }
    })

    const total = Object.values(cats).reduce((a, b) => a + b, 0) + projects

    return (
        <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pb-2">
                <CardTitle className="text-xl font-bold flex items-center gap-2 mb-2">
                    <PieChart className="h-5 w-5 text-blue-600" />
                    Nature of Knowledge
                </CardTitle>
                <p className="text-sm text-slate-500">
                    A holistic composition of business acumen built over {total} credits.
                </p>
            </CardHeader>
            <CardContent className="px-0 space-y-6">
                {/* Visual Bar */}
                <div className="flex h-4 rounded-full overflow-hidden w-full">
                    <div style={{ width: `${(cats['Functional Foundation'] / total) * 100}%` }} className="bg-slate-800 dark:bg-slate-700" />
                    <div style={{ width: `${(cats['Integrated Perspective'] / total) * 100}%` }} className="bg-blue-600" />
                    <div style={{ width: `${(cats['Global Leadership'] / total) * 100}%` }} className="bg-amber-500" />
                    <div style={{ width: `${(projects / total) * 100}%` }} className="bg-purple-600" />
                </div>

                {/* Legend & Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2 mb-2">
                            <Layers className="h-4 w-4 text-slate-800 dark:text-slate-400" />
                            <h4 className="font-bold text-slate-900 dark:text-slate-200">Functional Foundation</h4>
                        </div>
                        <p className="text-xs text-slate-500 mb-2">Core business mechanics: Finance, Ops, Marketing, HR.</p>
                        <Badge variant="secondary" className="bg-slate-200 text-slate-800">{cats['Functional Foundation']} Credits</Badge>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="h-4 w-4 text-blue-600" />
                            <h4 className="font-bold text-blue-900 dark:text-blue-300">Integrated Perspective</h4>
                        </div>
                        <p className="text-xs text-blue-700/70 dark:text-blue-400 mb-2">Cross-functional strategy & decision making.</p>
                        <Badge className="bg-blue-600">{cats['Integrated Perspective']} Credits</Badge>
                    </div>

                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-900">
                        <div className="flex items-center gap-2 mb-2">
                            <Globe className="h-4 w-4 text-amber-600" />
                            <h4 className="font-bold text-amber-900 dark:text-amber-300">Global Leadership</h4>
                        </div>
                        <p className="text-xs text-amber-800/70 dark:text-amber-400 mb-2">Ethics, Governance, & Global Strategy.</p>
                        <Badge className="bg-amber-500">{cats['Global Leadership']} Credits</Badge>
                    </div>

                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-900">
                        <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="h-4 w-4 text-purple-600" />
                            <h4 className="font-bold text-purple-900 dark:text-purple-300">Applied Intelligence</h4>
                        </div>
                        <p className="text-xs text-purple-800/70 dark:text-purple-400 mb-2">3 Major Capstone Projects.</p>
                        <Badge className="bg-purple-600">{projects} Credits</Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
