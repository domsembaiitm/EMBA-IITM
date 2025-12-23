'use client'

import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Label
} from 'recharts'

export function StrategyMatrix({ risk, leadership }: { risk: number, leadership: number }) {
    const data = [{ x: risk, y: leadership, z: 1 }]

    return (
        <div className="w-full h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                    margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    {/* X-Axis: Risk Appetite */}
                    <XAxis type="number" dataKey="x" name="Risk" unit="" domain={[0, 10]} hide />

                    {/* Y-Axis: Leadership Posture */}
                    <YAxis type="number" dataKey="y" name="Leadership" unit="" domain={[0, 10]} hide />

                    <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                            return (
                                <div className="bg-slate-900 text-white text-xs p-2 rounded shadow-xl border border-slate-700">
                                    <p className="font-bold">My Strategy Signature</p>
                                    <p>Risk: {payload[0].value}</p>
                                    <p>Drive: {payload[1].value}</p>
                                </div>
                            );
                        }
                        return null;
                    }} />

                    {/* Quadrant Labels */}
                    <ReferenceLine x={5} stroke="#cbd5e1" strokeDasharray="3 3" />
                    <ReferenceLine y={5} stroke="#cbd5e1" strokeDasharray="3 3" />

                    {/* The Student Point */}
                    <Scatter name="Me" data={data} fill="#2563eb" r={10} shape="circle">
                        {/* Pulse Effect css can go here if we were custom, but standard circle is fine */}
                    </Scatter>
                </ScatterChart>
            </ResponsiveContainer>

            {/* CSS Overlay Labels for Quadrants */}
            <div className="absolute top-2 left-2 text-[10px] uppercase font-bold text-slate-400">Guardian</div>
            <div className="absolute top-2 right-2 text-[10px] uppercase font-bold text-slate-400">Driver</div>
            <div className="absolute bottom-2 left-2 text-[10px] uppercase font-bold text-slate-400">Anchor</div>
            <div className="absolute bottom-2 right-2 text-[10px] uppercase font-bold text-slate-400">Maverick</div>
        </div>
    )
}
