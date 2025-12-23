"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type SliderProps = {
    className?: string
    min?: number
    max?: number
    step?: number
    value?: number[]
    onValueChange?: (value: number[]) => void
    name?: string
}

export function Slider({ className, min = 0, max = 100, step = 1, value = [0], onValueChange, name, ...props }: SliderProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value)
        if (onValueChange) {
            onValueChange([val])
        }
    }

    return (
        <div className={cn("relative flex w-full touch-none select-none items-center", className)} {...props}>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value[0]}
                onChange={handleChange}
                name={name}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 disabled:opacity-50 dark:bg-slate-800 accent-primary"
            />
        </div>
    )
}
