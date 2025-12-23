'use client'

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, ExternalLink, Star } from 'lucide-react'
import { Database } from '@/types/supabase'

type Project = Database['public']['Tables']['projects']['Row']

export function ProjectList({ projects, profileId, isReadOnly = false }: { projects: Project[], profileId: string, isReadOnly?: boolean }) {
    if (projects.length === 0) {
        return (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
                <h3 className="text-lg font-medium text-slate-900">No Projects Showcase Yet</h3>
                <p className="text-slate-500 mb-4">{isReadOnly ? 'This candidate has not added any projects yet.' : 'Add your coursework and capstone projects to demonstrate your applied intelligence.'}</p>
                {!isReadOnly && <Button>Add First Project</Button>}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">Applied Intelligence Portfolio</h3>
                {!isReadOnly && <Button>+ Add Project</Button>}
            </div>

            <div className="grid gap-6">
                {projects.map((project) => {
                    // Safe Type Casting for JSON fields
                    const skills = Array.isArray(project.skills_demonstrated) ? project.skills_demonstrated as string[] : []
                    const artifacts = Array.isArray(project.artifact_urls) ? project.artifact_urls as string[] : []

                    return (
                        <Card key={project.id} className="overflow-hidden hover:shadow-md transition-shadow dark:bg-slate-900/40 border-slate-200 dark:border-slate-800">
                            <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 pb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge variant="outline" className="rounded-sm bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                                                {skills[0] || 'Capstone'}
                                            </Badge>

                                            {artifacts[0] && artifacts[0].includes('MS') && (
                                                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                                                    <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                                                    Course: {artifacts[0]}
                                                </span>
                                            )}
                                        </div>
                                        <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                                            {project.title}
                                        </CardTitle>
                                    </div>
                                    {project.is_featured && <Star className="h-5 w-5 text-amber-500 fill-amber-500" />}
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-4">
                                <div>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">The Problem</h4>
                                    <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">{project.problem_statement}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Decision / Solution</h4>
                                        <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">{project.solution_outcome}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">My Role</h4>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">{project.role_played}</p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-slate-50/30 dark:bg-slate-800/30 pt-4 flex gap-4">
                                <Button variant="ghost" size="sm" className="gap-2 ml-auto text-slate-500 hover:text-blue-600">
                                    Read Full Case Study <ExternalLink className="h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
