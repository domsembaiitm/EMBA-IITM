"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

export function PrintButton() {
    return (
        <Button
            variant="outline"
            size="icon"
            className="rounded-full border-slate-700 bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-800"
            onClick={() => window.print()}
            title="Print Profile"
        >
            <Printer className="h-5 w-5" />
        </Button>
    )
}
