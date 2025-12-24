
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Activity, Search, Users } from 'lucide-react'

export default async function AnalyticsPage() {
    const supabase = await createClient()

    // 1. Fetch Logs
    const { data: logs } = await supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100)

    // 2. Simple Stats Aggregation
    const totalLogs = logs?.length || 0
    const searchEvents = logs?.filter(l => l.action === 'SEARCH_CANDIDATES').length || 0
    const viewEvents = logs?.filter(l => l.action === 'VIEW_PROFILE').length || 0
    const connectEvents = logs?.filter(l => l.action === 'CONNECT_REQUEST').length || 0

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <Activity className="h-8 w-8 text-indigo-600" />
                        Platform Analytics
                    </h1>
                    <p className="text-slate-500 mt-2">Real-time audit logs and engagement tracking.</p>
                </div>

                {/* Scorecards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Interactions</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalLogs}</div>
                            <p className="text-xs text-muted-foreground">Events logged (last 100)</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Candidate Searches</CardTitle>
                            <Search className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{searchEvents}</div>
                            <p className="text-xs text-muted-foreground">Recruiter searches performing</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{viewEvents}</div>
                            <p className="text-xs text-muted-foreground">Total candidate profile impressions</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Logs Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Audit Log Stream</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Actor</TableHead>
                                    <TableHead>Target</TableHead>
                                    <TableHead>Metadata</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs?.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="font-mono text-xs">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${log.action === 'CONNECT_REQUEST' ? 'bg-green-100 text-green-800' :
                                                    log.action === 'SEARCH_CANDIDATES' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-slate-100 text-slate-800'
                                                }`}>
                                                {log.action}
                                            </span>
                                        </TableCell>
                                        <TableCell className="font-mono text-xs text-slate-500">
                                            {log.actor_id?.slice(0, 8)}...
                                        </TableCell>
                                        <TableCell className="font-mono text-xs text-slate-500">
                                            {log.target_id?.slice(0, 8) || '-'}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs text-slate-400 max-w-[200px] truncate">
                                            {JSON.stringify(log.metadata)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
