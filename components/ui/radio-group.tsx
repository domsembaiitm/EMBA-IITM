"use client"

import * as React from "react"

import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"

// Fallback to simple HTML if Radix is missing, but sticking to Shadcn pattern if possible.
// Since I can't check package.json easily for installed deps, I'll write a pure implementation 
// that looks like Shadcn to be safe against missing node_modules.

const RadioGroup = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { onValueChange?: (value: string) => void, value?: string, disabled?: boolean, name?: string }
>(({ className, onValueChange, value, ...props }, ref) => {
    return (
        <div className={cn("grid gap-2", className)} ref={ref} role="radiogroup" {...props}>
            {React.Children.map(props.children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, {
                        // @ts-ignore
                        checked: child.props.value === value,
                        // @ts-ignore
                        onChange: (e) => onValueChange?.(e.target.value),
                        name: props.name
                    })
                }
                return child
            })}
        </div>
    )
})
RadioGroup.displayName = "RadioGroup"

const RadioGroupItem = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
    return (
        <div className="flex items-center">
            <input
                type="radio"
                ref={ref}
                className={cn(
                    "aspect-square h-4 w-4 rounded-full border border-primary text-primary focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                {...props}
            />
        </div>
    )
})
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
