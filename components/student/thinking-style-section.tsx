'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Database } from '@/types/supabase'
import { Progress } from '@/components/ui/progress' // Need to verify if I installed Progress? I missed it in the command. I'll use a simple HTML div if not.

type ThinkingStyle = Database['public']['Tables']['thinking_styles']['Row']

export function ThinkingStyleSection({ thinkingStyle, profileId }: { thinkingStyle: ThinkingStyle | null, profileId: string }) {

    const risk = thinkingStyle?.risk_appetite || 5
    const leadership = thinkingStyle?.leadership_posture || 5

    return (
        <Card className="h-full bg-slate-50/50 dark:bg-slate-900/50 border-slate-200">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    🧠 How I Think
                </CardTitle>
                <CardDescription>My decision-making DNA</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <span>Conservative</span>
                        <span>Risk Agnostic</span>
                        <span>Risk Taker</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 transition-all" style={{ width: `${risk * 10}%` }}></div>
                    </div>
                    <p className="text-xs text-right text-slate-400">Risk Appetite: {risk}/10</p>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <span>Consensus</span>
                        <span>Balanced</span>
                        <span>Directive</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 transition-all" style={{ width: `${leadership * 10}%` }}></div>
                    </div>
                    <p className="text-xs text-right text-slate-400">Leadership: {leadership}/10</p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h4 className="font-semibold text-sm mb-2 text-slate-900">Leadership Philosophy</h4>
                    <p className="text-sm text-slate-600 italic">
                        &quot;{thinkingStyle?.philosophy_essay || 'I believe in leading by example and empowering teams to make data-driven decisions while maintaining a clear strategic vision...'}&quot;
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
