'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { addProject } from '@/app/student/actions'
import { Plus } from 'lucide-react'
import { toast } from 'sonner' // Assuming sonner is installed as per package.json

export function ProjectAddDialog() {
    const [open, setOpen] = useState(false)

    async function handleSubmit(formData: FormData) {
        const result = await addProject(formData)
        if (result?.error) {
            // Fallback if toast not configured globally yet, though package.json has it.
            alert(result.error)
        } else {
            setOpen(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Capstone / Project
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Project</DialogTitle>
                    <DialogDescription>
                        Highlight a key initiative, capstone, or strategic project.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <Input id="title" name="title" placeholder="Global Supply Chain Redesign" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role_played" className="text-right">
                                Your Role
                            </Label>
                            <Input id="role_played" name="role_played" placeholder="Lead Strategist" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="solution_outcome" className="text-right">
                                Outcome
                            </Label>
                            <Textarea id="solution_outcome" name="solution_outcome" placeholder="Reduced logistics costs by 15%..." className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="artifact_url" className="text-right">
                                Link (Opt)
                            </Label>
                            <Input id="artifact_url" name="artifact_url" placeholder="https://..." className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save Project</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
