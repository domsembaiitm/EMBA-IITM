"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X, Shield, Plus } from "lucide-react"
import { updatePrivacySettings } from "@/app/student/actions"
import { toast } from "sonner"

export function PrivacySettings({ initialBlockedDomains }: { initialBlockedDomains: string[] }) {
    const [domains, setDomains] = useState<string[]>(initialBlockedDomains || [])
    const [inputValue, setInputValue] = useState("")
    const [isSaving, setIsSaving] = useState(false)

    const handleAdd = () => {
        if (!inputValue.trim()) return
        const domain = inputValue.trim().toLowerCase()

        // Basic validation
        if (domains.includes(domain)) {
            toast.error("Domain already blocked")
            return
        }
        if (!domain.includes('.')) {
            toast.error("Please enter a valid domain (e.g., company.com)")
            return
        }

        const newDomains = [...domains, domain]
        setDomains(newDomains)
        setInputValue("")
        saveChanges(newDomains)
    }

    const handleRemove = (domain: string) => {
        const newDomains = domains.filter(d => d !== domain)
        setDomains(newDomains)
        saveChanges(newDomains)
    }

    const saveChanges = async (newDomains: string[]) => {
        setIsSaving(true)
        const res = await updatePrivacySettings(newDomains)
        setIsSaving(false)

        if (res?.error) {
            toast.error("Failed to update privacy settings")
        } else {
            toast.success("Privacy settings updated")
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Input
                    placeholder="Block a domain (e.g. competitor.com)"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
                <Button onClick={handleAdd} size="icon" variant="outline">
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex flex-wrap gap-2">
                {domains.length === 0 && (
                    <span className="text-sm text-slate-500 italic">No domains blocked. Your profile is visible to all recruiters.</span>
                )}
                {domains.map(domain => (
                    <Badge key={domain} variant="secondary" className="px-3 py-1 text-sm bg-red-50 text-red-700 border-red-100 flex items-center gap-2">
                        <Shield className="h-3 w-3" />
                        {domain}
                        <button onClick={() => handleRemove(domain)} className="hover:text-red-900 transition-colors">
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">
                Recruiters from these domains will NOT be able to find you or view your profile.
            </p>
        </div>
    )
}
