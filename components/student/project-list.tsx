'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { deleteProject } from '@/app/student/actions'
import { Trash2, ExternalLink } from 'lucide-react'

export function ProjectList({ projects, isReadOnly = false, profileId }: { projects: any[], isReadOnly?: boolean, profileId?: string }) {

    if (!projects || projects.length === 0) {
        return (
            <div className="text-center py-8 border border-dashed rounded-lg text-slate-500 text-sm">
                No projects added yet. Showcase your applied learning here.
            </div>
        )
    }

    return (
        <div className="grid gap-4">
            {projects.map((project) => (
                <div key={project.id} className="flex items-start justify-between p-4 border rounded-lg bg-white dark:bg-slate-900">
                    <div className="space-y-1">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            {project.title}
                            {project.artifact_urls?.[0] && (
                                <a href={project.artifact_urls[0]} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700">
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            )}
                        </div>
                        <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{project.role_played}</div>
                        <p className="text-sm text-slate-600 mt-2 max-w-xl">{project.solution_outcome}</p>
                    </div>
                    {!isReadOnly && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={async () => {
                                if (confirm('Delete this project?')) {
                                    await deleteProject(project.id)
                                }
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            ))}
        </div>
    )
}
