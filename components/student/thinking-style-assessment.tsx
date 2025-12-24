
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { BrainCircuit, CheckCircle2 } from "lucide-react"

// Types definitions
export type ThinkingStyle = {
    risk_appetite: number
    leadership_posture: number
    archetype: string
}

import { updateThinkingStyle } from "@/app/student/actions" // Added import
import { toast } from "sonner" // Added import

const QUESTIONS = [
    {
        id: 1,
        dimension: "risk",
        text: "A disruptive competitor enters your market. Your immediate response is to:",
        options: [
            { text: "Launch a bold counter-offensive with a new experimental product.", score: 9 }, // High Risk
            { text: "Analyze their weakness and optimize our current core offering.", score: 3 },  // Low Risk
            { text: "Wait to see market reaction before shifting strategy.", score: 5 },          // Balanced
            { text: "Pivot the entire business model to a new niche.", score: 8 }                 // High Risk
        ]
    },
    {
        id: 2,
        dimension: "leadership",
        text: "Your team is deadlocked on a critical project decision. You:",
        options: [
            { text: "Make the final call immediately to break the stalemate.", score: 9 },        // Directive
            { text: "Facilitate a workshop to build team consensus.", score: 2 },                 // Consensus
            { text: "Delegate the decision to the most improved subject matter expert.", score: 5 }, // Balanced
            { text: "Set a deadline for them to resolve it themselves.", score: 7 }               // Directive
        ]
    },
    {
        id: 3,
        dimension: "risk",
        text: "You are allocated a budget surplus. You prioritize:",
        options: [
            { text: "Investing in a 'moonshot' R&D project with 10x potential.", score: 9 },      // High Risk
            { text: "Shoring up cash reserves for future stability.", score: 2 },                 // Low Risk
            { text: "Incremental upgrades to existing efficient systems.", score: 4 },            // Low Risk
            { text: "Acquiring a small, high-growth competitor.", score: 7 }                      // Med-High Risk
        ]
    },
    {
        id: 4,
        dimension: "leadership",
        text: "When driving organizational change, you believe success comes from:",
        options: [
            { text: "Clear, top-down vision and strict execution milestones.", score: 8 },        // Directive
            { text: "Grassroots adoption and cultural alignment.", score: 3 },                    // Consensus
            { text: "Empowering unit leaders to drive their own adaptation.", score: 5 },         // Balanced
            { text: "Rapid iteration and failing fast.", score: 7 }                               // Directive-ish
        ]
    }
]

export function ThinkingStyleAssessment({ onComplete }: { onComplete: (style: ThinkingStyle) => void }) {
    const [answers, setAnswers] = useState<Record<number, number>>({})
    const [step, setStep] = useState(0)

    const handleSelect = (score: number) => {
        setAnswers({ ...answers, [QUESTIONS[step].id]: score })
    }

    const handleNext = () => {
        if (step < QUESTIONS.length - 1) {
            setStep(step + 1)
        } else {
            calculateResult()
        }
    }

    const calculateResult = () => {
        // Compute Averages
        const riskScores = QUESTIONS.filter(q => q.dimension === 'risk').map(q => answers[q.id])
        const leadScores = QUESTIONS.filter(q => q.dimension === 'leadership').map(q => answers[q.id])

        const avgRisk = Math.round(riskScores.reduce((a, b) => a + b, 0) / riskScores.length)
        const avgLead = Math.round(leadScores.reduce((a, b) => a + b, 0) / leadScores.length)

        // Determine Archetype
        let archetype = "Steward"
        if (avgRisk > 6 && avgLead > 6) archetype = "Maverick"
        else if (avgRisk > 6 && avgLead <= 6) archetype = "Visionary"
        else if (avgRisk <= 6 && avgLead > 6) archetype = "Driver"
        else archetype = "Steward"

        const style = {
            risk_appetite: avgRisk,
            leadership_posture: avgLead,
            archetype
        }

        // Call Server Action
        updateThinkingStyle(style).then(res => {
            if (res?.error) toast.error(res.error)
            else toast.success("Leadership DNA Updated")
        })

        onComplete(style)
    }

    const currentQ = QUESTIONS[step]

    return (
        <Card className="border-slate-200 shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <BrainCircuit className="h-5 w-5 text-blue-600" />
                    Adaptive Leadership Assessment
                </CardTitle>
                <CardDescription>
                    Question {step + 1} of {QUESTIONS.length}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <h3 className="text-xl font-medium text-slate-900">{currentQ.text}</h3>
                    <RadioGroup onValueChange={(val: string) => handleSelect(parseInt(val))} className="space-y-3">
                        {currentQ.options.map((opt, i) => (
                            <div key={i} className={`flex items-center space-x-3 border p-4 rounded-lg transition-all cursor-pointer hover:border-blue-200 hover:bg-slate-50 ${answers[currentQ.id] === opt.score ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-slate-200'}`}>
                                <RadioGroupItem value={opt.score.toString()} id={`opt-${i}`} />
                                <Label htmlFor={`opt-${i}`} className="flex-1 cursor-pointer font-normal text-slate-700 text-base">
                                    {opt.text}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button onClick={handleNext} disabled={!answers[currentQ.id]}>
                    {step === QUESTIONS.length - 1 ? 'Analyze DNA' : 'Next Situation'}
                </Button>
            </CardFooter>
        </Card>
    )
}
