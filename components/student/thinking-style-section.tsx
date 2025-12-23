import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Database } from '@/types/supabase'
import { StrategyMatrix } from './strategy-matrix'

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

                {/* The Matrix */}
                <div className="border border-slate-100 bg-white rounded-lg p-2 shadow-sm">
                    <StrategyMatrix risk={risk} leadership={leadership} />
                </div>

                <div className="flex justify-between text-xs text-slate-500 px-2">
                    <div className="text-center">
                        <div className="font-bold text-slate-900">{risk}/10</div>
                        <div>Risk</div>
                    </div>
                    <div className="text-center">
                        <div className="font-bold text-slate-900">{leadership}/10</div>
                        <div>Leadership</div>
                    </div>
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
